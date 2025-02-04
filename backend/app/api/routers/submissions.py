from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.deps import SessionDep, CurrentUser

from app.models import Submission
from app.api.controllers import submissions as submissions_controller
from app.schemas.submission import SubmissionCreate, SubmissionRead, SubmissionUpdate


router = APIRouter(tags=["Entregas"])

@router.get(
    "/submissions/", 
    response_model=List[SubmissionRead],
    summary="Obtener todas las entregas",
    description="Obtiene una lista con todas las entregas registradas en el sistema.",
    response_description="Lista de entregas.",
    responses={
        200: {"description": "Lista de entregas obtenida"},
    }
    )
def get_submissions(session: SessionDep):
    submissions = submissions_controller.get_submissions(session)
    return submissions

@router.get(
    "/submissions/user/{user_id}",
    response_model=List[SubmissionRead],
    summary="Obtener entregas por ID de usuario",
    description="Obtiene una lista con todas las entregas registradas en el sistema realizadas por un usuario.",
    response_description="Lista de entregas.",
    responses={
        200: {"description": "Lista de entregas obtenida"},
    }
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
        404: {"description": "Entrega no encontrada"},
    }
    )
def get_submission_by_id(submission_id: int, session: SessionDep):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return submission

@router.post(
    "/submissions/",
    response_model=SubmissionCreate,
    summary="Crear una entrega",
    description="Crea una nueva entrega en el sistema.",
    response_description="Entrega creada.",
    responses={
        200: {"description": "Entrega creada"}
    }
    )
def create_submission(submission: SubmissionCreate, session: SessionDep):
    new_submission = submissions_controller.create_submission(session, Submission.from_orm(submission))
    return new_submission

@router.patch(
    "/submissions/{submission_id}",
    response_model=SubmissionUpdate,
    summary="Actualizar una entrega",
    description="Actualiza una entrega en el sistema utilizando su ID como clave.",
    response_description="Entrega actualizada.",
    responses={
        200: {"description": "Entrega actualizada"},
        404: {"description": "Entrega no encontrada"},
    }
    )
def update_submission(submission_id: int, submission_update: SubmissionUpdate, session: SessionDep):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    updated_submission = submissions_controller.update_submission(session, submission_id, submission_update.dict(exclude_unset=True))
    return updated_submission