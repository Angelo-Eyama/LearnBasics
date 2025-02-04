from typing import List
from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import CurrentUser, SessionDep
from app.api.controllers import comments as comments_controller

from app.models import User
from app.schemas.comment import CommentCreate, CommentRead, CommentUpdate

router = APIRouter(tags=["Comentarios"])


@router.get(
    "/comments/",
    response_model=List[CommentRead],
    summary="Obtener todos los comentarios",
    description="Obtiene una lista con todos los comentarios registrados en el sistema.",
    response_description="Lista de comentarios.",
    responses={
        200: {"description": "Lista de comentarios obtenida"},
        404: {"description": "No se encontraron comentarios"},
    }
)
def get_comments(session: SessionDep):
    comments = comments_controller.get_comments(session)
    return comments


@router.get(
    "/comments/{comment_id}",
    response_model=CommentRead,
    summary="Obtener un comentario por su ID",
    description="Obtiene un comentario del sistema utilizando su ID como clave.",
    response_description="El comentario obtenido.",
    responses={
        200: {"description": "Comentario encontrado"},
        404: {"description": "Comentario no encontrado"},
    }
)
def get_comment_by_id(comment_id: int, session: SessionDep):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    return comment


@router.get(
    "/comments/user/{user_id}",
    response_model=List[CommentRead],
    summary="Obtener comentarios por ID de usuario",
    description="Obtiene una lista con todos los comentarios registrados en el sistema realizados por un usuario.",
    response_description="Lista de comentarios.",
    responses={
        200: {"description": "Lista de comentarios obtenida"},
        404: {"description": "No se encontraron comentarios"},
    }
)
def get_comments_by_user_id(user_id: int, session: SessionDep):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    comments = comments_controller.get_comments_by_user_id(session, user_id)

    return comments


@router.post(
    "/comments/",
    response_model=CommentRead,
    summary="Crear un comentario",
    description="Crea un nuevo comentario en el sistema.",
    response_description="El comentario creado.",
    responses={
        200: {"description": "Comentario creado"},
        404: {"description": "No se pudo crear el comentario"},
    }
)
def create_comment(comment: CommentCreate, session: SessionDep):
    comment = comments_controller.create_comment(session, comment)
    return comment


@router.patch(
    "/comments/{comment_id}",
    response_model=CommentRead,
    summary="Actualizar un comentario",
    description="Actualiza un comentario del sistema utilizando su ID como clave.",
    response_description="El comentario actualizado.",
    responses={
        200: {"description": "Comentario actualizado"},
        404: {"description": "Comentario no encontrado"},
    }
)
def update_comment(comment_id: int, comment_update: CommentUpdate, session: SessionDep):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    updated_comment = comments_controller.update_comment(
        session=session, db_comment=comment, comment_in=comment_update)
    return updated_comment


@router.delete(
    "/comments/{comment_id}",
    response_model=CommentRead, summary="Eliminar un comentario",
    description="Elimina un comentario del sistema utilizando su ID.",
    response_description="El comentario eliminado."
)
def delete_comment(comment_id: int, session: SessionDep):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    deleted_comment = comments_controller.delete_comment(session, comment_id)
    return deleted_comment