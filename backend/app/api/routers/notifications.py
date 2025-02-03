from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import Notification, User
from ..controllers import notifications as notifications_controller
from ..schemas import NotificationCreate, NotificationRead, NotificationUpdate

router = APIRouter(tags=["Notificaciones"])


@router.get("/notifications/", response_model=List[NotificationRead])
def get_notifications(session: Session = Depends(get_session)):
    notifications = notifications_controller.get_notifications(session)
    return notifications


@router.get("/notifications/{notification_id}", response_model=NotificationRead)
def get_notification_by_id(notification_id: int, session: Session = Depends(get_session)):
    notification = notifications_controller.get_notification_by_id(
        session, notification_id)
    if not notification:
        raise HTTPException(
            status_code=404, detail="Notificación no encontrada")
    return notification

@router.get("/notifications/user/{user_id}", response_model=List[NotificationRead])
def get_notifications_by_user_id(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    notifications = notifications_controller.get_notifications_by_user_id(session, user_id)
    return notifications

@router.post("/notifications/", response_model=NotificationRead)
def create_notification(notification: NotificationCreate, session: Session = Depends(get_session)):
    notification = notifications_controller.create_notification(session, notification)
    return notification

@router.delete("/notifications/{notification_id}", response_model=NotificationRead, summary="Eliminar una notificación", description="Elimina una notificación del sistema utilizando su ID.", response_description="La notificación eliminada.")
def delete_notification(notification_id: int, session: Session = Depends(get_session)):
    notification = notifications_controller.get_notification_by_id(session, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    deleted_notification = notifications_controller.delete_notification(session, notification_id)
    return deleted_notification

@router.patch(
    "/notifications/{notification_id}", 
    response_model=NotificationRead, 
    summary="Cambia el estado de una notificación", 
    description="Cambia el estado de una notificación, de leido a no leido y viceversa. Utilizando el ID para identificarlo", 
    responses={
        200: {"description": "Notificación actualizada"},
        404: {"description": "Notificación no encontrada"},
    }
    )
def change_state_notification(notification_id: int, session: Session = Depends(get_session)):
    notification = notifications_controller.get_notification_by_id(session, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    updated_notification = notifications_controller.change_state_notification(session, notification_id)
    return updated_notification