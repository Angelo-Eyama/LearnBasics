from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import CurrentUser, SessionDep, get_current_user, verify_admin

from app.models import Submission
from app.api.controllers import submissions as submissions_controller
from app.schemas.submission import SubmissionCreate, SubmissionRead, SubmissionUpdate, SubmissionList
from app.schemas.utils import ErrorResponse

router = APIRouter(
    tags=["Entregas"],
    dependencies=[Depends(get_current_user)]
    )

@router.get(
    "/submissions/", 
    response_model=SubmissionList,
    summary="Obtener todas las entregas",
    description="Obtiene una lista con todas las entregas registradas en el sistema.",
    response_description="Lista de entregas.",
    responses={
        200: {"description": "Lista de entregas obtenida"},
        400: {"model": ErrorResponse, "description": "No se encontraron entregas"}
    },
    dependencies=[Depends(verify_admin)]
    )
def get_submissions(session: SessionDep):
    submissions = submissions_controller.get_submissions(session)
    return submissions

@router.get(
    "/submissions/user/me",
    response_model=SubmissionList,
    summary="Obtener entregas del usuario autenticado",
    response_description="Lista de entregas.",
    responses={
        200: {"description": "Lista de entregas obtenida"},
    }
)
def get_my_submissions(current_user: CurrentUser, session: SessionDep):
    submissions = submissions_controller.get_submissions_by_user_id(session, current_user.id)
    return submissions

@router.get(
    "/submissions/user/{user_id}",
    response_model=SubmissionList,
    summary="Obtener entregas por ID de usuario",
    description="Obtiene una lista con todas las entregas registradas en el sistema realizadas por un usuario.",
    response_description="Lista de entregas.",
    responses={
        200: {"description": "Lista de entregas obtenida"},
        403: {"model": ErrorResponse, "description": "No se puede acceder a las entregas de otro usuario"}
    },
    dependencies=[Depends(verify_admin)]
    )
def get_submissions_by_user_id(user_id: int, session: SessionDep):
    submissions = submissions_controller.get_submissions_by_user_id(session, user_id)
    return submissions

@router.get(
    "/submissions/{submission_id}",
    response_model=SubmissionRead,
    summary="Obtener una entrega por su ID",
    description="Obtiene una entrega del sistema utilizando su ID como clave.",
    response_description="Entrega obtenida.",
    responses={
        200: {"description": "Entrega encontrada"},
        403: {"model": ErrorResponse, "description": "No tienes permiso para acceder a este recurso"},
        404: {"model": ErrorResponse, "description": "Entrega no encontrada"},
    }
    )
def get_submission_by_id(submission_id: int, session: SessionDep, current_user: CurrentUser):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    if submission.userID != current_user.id and not verify_admin(current_user):
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")
    return submission

@router.post(
    "/submissions/",
    response_model=SubmissionCreate,
    summary="Crear una entrega",
    description="Crea una nueva entrega en el sistema.",
    response_description="Entrega creada.",
    responses={
        200: {"description": "Entrega creada"},
        400: {"model": ErrorResponse, "description": "Error en los datos enviados"},
    }
    )
def create_submission(submission: SubmissionCreate, session: SessionDep):
    new_submission = submissions_controller.create_submission(session, submission)
    return new_submission

@router.patch(
    "/submissions/{submission_id}",
    response_model=SubmissionUpdate,
    summary="Actualizar una entrega",
    description="Actualiza una entrega en el sistema utilizando su ID como clave.",
    response_description="Entrega actualizada.",
    responses={
        200: {"description": "Entrega actualizada"},
        404: {"model": ErrorResponse, "description": "Entrega no encontrada"},
    }
    )
def update_submission(submission_id: int, submission_update: SubmissionUpdate, session: SessionDep, current_user: CurrentUser):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    if submission.userID != current_user.id and not verify_admin(current_user):
        raise HTTPException(status_code=403, detail="No tienes permiso para acceder a este recurso")
    updated_submission = submissions_controller.update_submission(session=session, db_submission=submission, submission_in=submission_update)
    return updated_submission