from sqlmodel import Session, select, func
from app.models import Comment
from app.schemas.comment import CommentCreate, CommentUpdate, CommentList


def get_comments_by_user_id(session: Session, user_id: int):
    comments = session.exec(
        select(Comment).where(Comment.userID == user_id)
    ).all()
    count = session.exec(select(func.count(Comment.id))).one()
    return CommentList(total=count, comments=comments)


def get_comments(session: Session):
    comments = session.exec(select(Comment)).all()
    count = session.exec(select(func.count(Comment.id))).one()
    # Filtrar comentarios con usuarios nulos
    valid_comments = [comment for comment in comments if comment.user is not None]
    return CommentList(total=len(valid_comments), comments=valid_comments)


def get_comment_by_id(session: Session, comment_id: int):
    comment = session.get(Comment, comment_id)
    return comment

def get_comments_by_problem_id(session: Session, problem_id: int):
    comments = session.exec(
        select(Comment).where(Comment.problemID == problem_id)
    ).all()
    count = session.exec(select(func.count(Comment.id))).one()
    return CommentList(total=count, comments=comments)


def create_comment(session: Session, new_comment: CommentCreate):
    comment_db = Comment.model_validate(new_comment)
    session.add(comment_db)
    session.commit()
    session.refresh(comment_db)
    return comment_db


def update_comment(session: Session, db_comment: Comment, comment_in: CommentUpdate):
    comment_data = comment_in.model_dump(exclude_unset=True)
    db_comment.sqlmodel_update(comment_data)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

def change_comment_approval(session: Session, comment_id: int):
    comment = session.get(Comment, comment_id)
    if not comment:
        return None
    comment.isApproved = not comment.isApproved
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

def delete_comment(session: Session, comment_id: int):
    comment = session.get(Comment, comment_id)
    session.delete(comment)
    session.commit()
    return comment