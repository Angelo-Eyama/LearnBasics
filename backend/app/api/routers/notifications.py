from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import SessionDep, CurrentUser, get_current_user, verify_admin
from app.api.controllers import notifications as notifications_controller
from app.models import User, Notification
from app.schemas.notification import NotificationCreate, NotificationRead, NotificationsList
from app.schemas.utils import ErrorResponse

router = APIRouter(
    tags=["Notificaciones"],
    prefix="/notifications",
    dependencies=[Depends(get_current_user)]
)


@router.get(
    "/",
    response_model=NotificationsList,
    dependencies=[Depends(verify_admin)],
    responses={
        200: {"description": "Lista de notificaciones obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron notificaciones"}
    }
)
def get_notifications(session: SessionDep):
    notifications = notifications_controller.get_notifications(session)
    return notifications


@router.get(
    "/{notification_id}",
    response_model=NotificationRead,
    dependencies=[Depends(verify_admin)],
    responses={
        200: {"description": "Notificación encontrada"},
        404: {"model": ErrorResponse, "description": "Notificación no encontrada"}
    }
)
def get_notification_by_id(notification_id: int, session: SessionDep):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(
            status_code=404, detail="Notificación no encontrada")
    return notification

@router.get(
    "/user/me",
    response_model=NotificationsList,
    summary="Obtener las notificaciones del usuario autenticado",
    responses={
        200: {"description": "Lista de notificaciones obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron notificaciones"}
    }
)
def get_my_notifications(current_user: CurrentUser, session: SessionDep):
    notifications = notifications_controller.get_notifications_by_user_id(
        session, current_user.id)
    return notifications

@router.get(
    "/user/{user_id}",
    response_model=List[NotificationRead],
    dependencies=[Depends(verify_admin)],
    responses={
        200: {"description": "Lista de notificaciones obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron notificaciones"}
    }
)
def get_notifications_by_user_id(user_id: int, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    notifications = notifications_controller.get_notifications_by_user_id(
        session, user_id)
    return notifications



@router.post(
    "/",
    response_model=NotificationRead,
    dependencies=[Depends(verify_admin)],
    responses={
        200: {"description": "Notificación creada"},
        404: {"model": ErrorResponse, "description": "Error al crear la notificación"}
    }
)
def create_notification(notification: NotificationCreate, session: SessionDep):
    notification = notifications_controller.create_notification(
        session, notification)
    return notification


@router.delete(
    "/{notification_id}",
    response_model=NotificationRead,
    summary="Eliminar una notificación",
    description="Elimina una notificación del sistema utilizando su ID.",
    response_description="La notificación eliminada.",
    responses={
        200: {"description": "Notificación eliminada"},
        404: {"model": ErrorResponse, "description": "Notificación no encontrada"},
    },
    dependencies=[Depends(verify_admin)]
)
def delete_notification(notification_id: int, session: SessionDep):
    notification = notifications_controller.get_notification_by_id(
        session, notification_id)
    if not notification:
        raise HTTPException(
            status_code=404, detail="Notificación no encontrada")
    deleted_notification = notifications_controller.delete_notification(
        session, notification_id)
    return deleted_notification


@router.patch(
    "/{notification_id}",
    response_model=NotificationRead,
    summary="Marcar una notificación como leída utilizando su ID",
    responses={
        200: {"description": "Notificación actualizada"},
        404: {"model": ErrorResponse, "description": "Notificación no encontrada"},
    }
)
def read_notification(notification_id: int, session: SessionDep):
    notification = notifications_controller.get_notification_by_id(
        session, notification_id)
    if not notification:
        raise HTTPException(
            status_code=404, detail="Notificación no encontrada")
    updated_notification = notifications_controller.read_notification(
        session, notification_id)
    return updated_notification
