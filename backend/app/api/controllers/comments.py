from sqlmodel import Session, select
from app.models import Comment
from app.schemas.comment import CommentCreate, CommentUpdate


def get_comments_by_user_id(*, session: Session, user_id: int):
    comments = session.exec(
        select(Comment).where(Comment.userID == user_id)
        ).all()
    return comments


def create_comment(*, session: Session, new_comment: CommentCreate):
    comment_db = Comment.model_validate(new_comment)
    session.add(comment_db)
    session.commit()
    session.refresh(comment_db)
    return comment_db



def update_comment(*, session: Session, db_comment: Comment, comment_in: CommentUpdate):
    comment_data = comment_in.model_dump(exclude_unset=True)
    db_comment.sqlmodel_update(comment_data)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

