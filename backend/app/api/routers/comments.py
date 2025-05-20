from typing import List
from fastapi import APIRouter, HTTPException, Depends

from app.api.deps import CurrentUser, SessionDep, get_current_user, verify_role
from app.api.controllers import comments as comments_controller

from app.models import User
from app.schemas.comment import CommentCreate, CommentRead, CommentUpdate
from app.schemas.utils import ErrorResponse
from app.core.utils import RoleType

router = APIRouter(
    tags=["Comentarios"],
    dependencies=[Depends(get_current_user)]
    )


@router.get(
    "/comments/",
    response_model=List[CommentRead],
    summary="Obtener todos los comentarios",
    description="Obtiene una lista con todos los comentarios registrados en el sistema.",
    response_description="Lista de comentarios.",
    responses={
        200: {"description": "Lista de comentarios obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron comentarios"},
    }
)
def get_comments(session: SessionDep):
    comments = comments_controller.get_comments(session)
    return comments

@router.get(
    "/comments/problem/{problem_id}",
    response_model=List[CommentRead],
    description="Obtiene una lista con todos los comentarios registrados en el sistema para un problema específico.",
    response_description="Lista de comentarios.",
    responses={
        200: {"description": "Lista de comentarios obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron comentarios"},
    }
)
def get_comments_by_problem_id(problem_id: int, session: SessionDep):
    comments = comments_controller.get_comments_by_problem_id(session, problem_id)
    if not comments:
        raise HTTPException(status_code=404, detail="No se encontraron comentarios para este problema")
    return comments

@router.get(
    "/comments/{comment_id}",
    response_model=CommentRead,
    summary="Obtener un comentario por su ID",
    description="Obtiene un comentario del sistema utilizando su ID como clave.",
    response_description="El comentario obtenido.",
    responses={
        200: {"description": "Comentario encontrado"},
        404: {"model": ErrorResponse, "description": "El comentario no existe"},
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
        404: {"model": ErrorResponse, "description": "No se encontraron comentarios"},
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
        404: {"model": ErrorResponse, "description": "No se pudo crear el comentario"},
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
        404: {"model": ErrorResponse, "description": "Comentario no encontrado"},
    }
)
def update_comment(comment_id: int, comment_update: CommentUpdate, session: SessionDep, current_user: CurrentUser):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    if comment.userID != current_user.id and not verify_role(current_user, [RoleType.ADMIN, RoleType.EDITOR]):
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")    
    updated_comment = comments_controller.update_comment(session=session, db_comment=comment, comment_in=comment_update)
    return updated_comment


@router.delete(
    "/comments/{comment_id}",
    response_model=CommentRead, summary="Eliminar un comentario",
    description="Elimina un comentario del sistema utilizando su ID.",
    response_description="El comentario eliminado.",
    responses={
        200: {"description": "Comentario eliminado"},
        403: {"model": ErrorResponse, "description": "El usuario no tiene permisos para acceder a este recurso"},
        404: {"model": ErrorResponse, "description": "Comentario no encontrado"},
    }
)
def delete_comment(comment_id: int, session: SessionDep, current_user: CurrentUser):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    if comment.userID != current_user.id and not verify_role(current_user, [RoleType.ADMIN, RoleType.EDITOR]):
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")
    deleted_comment = comments_controller.delete_comment(session, comment_id)
    return deleted_comment