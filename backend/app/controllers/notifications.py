from sqlmodel import Session, select
from ..models import Notification

def get_notifications(session: Session):
    notifications = session.exec(select(Notification)).all()
    return notifications

def create_notification(session: Session, notification: Notification):
    notification.timePosted = datetime.now()
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return notification

def delete_notification(session: Session, notification_id: int):
    notification = session.get(Notification, notification_id)
    session.delete(notification)
    session.commit()
    return notification

def change_state_notification(session: Session, notification_id: int):
    notification = session.get(Notification, notification_id)
    notification.readed = not notification.readed
    session.commit()
    session.refresh(notification)
    return notification

def get_notifications_by_user_id(session: Session, user_id: int):
    notifications = session.exec(select(Notification).where(Notification.userID == user_id)).all()
    return notifications