from sqlmodel import Session, select
from ..models import Comment

def get_comments(session: Session):
    comments = session.exec(select(Comment)).all()
    return comments

def get_comment_by_id(session: Session, comment_id: int):
    comment = session.get(Comment, comment_id)
    return comment

def get_comments_by_user_id(session: Session, user_id: int):
    comments = session.exec(select(Comment).where(Comment.userID == user_id)).all()
    return comments

def create_comment(session: Session, comment: Comment):
    comment.timePosted = datetime.now()
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

def update_comment(session: Session, comment_id: int, comment_data):
    comment = session.get(Comment, comment_id)
    for key, value in comment_data.items():
        setattr(comment, key, value)
    session.commit()
    session.refresh(comment)
    return comment

def delete_comment(session: Session, comment_id: int):
    comment = session.get(Comment, comment_id)
    session.delete(comment)
    session.commit()
    return comment