from sqlmodel import Session, select, func
from app.models import Notification
from app.schemas.notification import NotificationCreate, NotificationUpdate, NotificationsList

def get_notifications(session: Session):
    count = session.exec(select(func.count(Notification.id)).count()).one()
    notifications = session.exec(select(Notification)).all()
    return NotificationsList(
        total=count,
        notifications=notifications
    )

def get_notification_by_id(session: Session, notification_id: int):
    notification = session.get(Notification, notification_id)
    return notification

def get_notifications_by_user_id(session: Session, user_id: int):
    count = session.exec(select(func.count(Notification.id)).where(Notification.userID == user_id)).one()
    notifications = session.exec(
        select(Notification).where(Notification.userID == user_id)
    ).all()
    return NotificationsList(
        total=count,
        notifications=notifications
    )

def create_notification(session: Session, new_notification: NotificationCreate):
    notification_db = Notification.model_validate(new_notification)
    session.add(notification_db)
    session.commit()
    session.refresh(notification_db)
    return notification_db

def update_notification(session: Session, db_notification: Notification, notification_in: NotificationUpdate):
    notification_data = notification_in.model_dump(exclude_unset=True)
    db_notification.sqlmodel_update(notification_data)
    session.add(db_notification)
    session.commit()
    session.refresh(db_notification)
    return db_notification

def delete_notification(session: Session, notification_id: int):
    notification = session.get(Notification, notification_id)
    if not notification:
        return None
    session.delete(notification)
    session.commit()
    return notification

def change_state_notification(session: Session, notification_id: int):
    notification = session.get(Notification, notification_id)
    if not notification:
        return None
    notification.read = not notification.read
    session.commit()
    session.refresh(notification)
    return notification