from typing import List
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import CurrentUser, SessionDep, get_current_user, verify_admin, verify_role
from app.models import Problem
from app.schemas.problem import ProblemCreate, ProblemRead, ProblemUpdate
from app.schemas.utils import ErrorResponse
from app.api.controllers import problems as problems_controller
from app.core.utils import RoleType

router = APIRouter(
    prefix="/problems",
    tags=["Problemas"],
    dependencies=[Depends(get_current_user)]
    )

@router.get(
    "/",
    response_model=List[ProblemRead],
    summary="Obtener todos los problemas",
    description="Obtiene una lista con todos los problemas registrados en el sistema.",
    response_description="Lista de problemas.",
    responses={
        200: {"description": "Lista de problemas obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron problemas"},
    }
    )
def get_problems(session: SessionDep, skip: int = 0, limit: int = 10):
    problems = problems_controller.get_problems(session, skip, limit)
    return problems

@router.get(
    "/id:{problem_id}", 
    response_model=ProblemRead,
    summary="Obtener un problema por su ID",
    description="Obtiene un problema del sistema utilizando su ID como clave.",
    response_description="El problema obtenido.",
    responses={
        200: {"description": "Problema encontrado"},
        404: {"model": ErrorResponse, "description": "Problema no encontrado"},
    }
    )
def get_problem_by_id(problem_id: int, session: SessionDep):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    return problem

@router.get(
    "/difficulty/{difficulty}",
    response_model=List[ProblemRead],
    summary="Obtener problemas por dificultad",
    description="Devuelve una lista de problemas filtrados por dificultad.",
    response_description="Lista de problemas por dificultad.",
    responses={
        200: {"description": "Lista de problemas obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron problemas con la dificultad especificada"},
    }
)
def list_problems_by_difficulty(difficulty: str, session: SessionDep):
    problems = problems_controller.get_problems_by_difficulty(session, difficulty)
    if not problems:
        raise HTTPException(status_code=404, detail="No se encontraron problemas con la dificultad especificada")
    return problems

@router.post(
    "/",
    response_model=ProblemCreate,
    summary="Crear un problema",
    description="Crea un nuevo problema en el sistema.",
    response_description="El problema creado.",
    responses={
        200: {"description": "Problema creado"},
        404: {"model": ErrorResponse, "description": "Problema no creado"},
    },
    dependencies=[Depends(verify_admin)]
    )
def create_problem(problem: ProblemCreate, session: SessionDep, current_user: CurrentUser):
    new_problem = problems_controller.create_problem(
        session=session,
        new_problem=Problem.from_orm(problem),
        current_user=current_user
        )
    return new_problem

@router.patch(
    "/{problem_id}", 
    response_model=ProblemUpdate,
    summary="Actualizar un problema",
    description="Actualiza un problema del sistema utilizando su ID como clave.",
    responses={
        200: {"description": "Problema actualizado"},
        404: {"model": ErrorResponse, "description": "Problema no encontrado"},
    }
    )
def update_problem(
        problem_id: int,
        problem_update: ProblemUpdate,
        session: SessionDep,
        current_user: CurrentUser
    ):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    if not verify_role(current_user, [RoleType.ADMIN, RoleType.EDITOR]):
        raise HTTPException(status_code=403, detail="No tienes permisos para realizar esta acción")
    updated_problem = problems_controller.update_problem(session=session, db_problem=problem, problem_in=problem_update)
    return updated_problem

@router.delete(
    "/{problem_id}",
    response_model=ProblemRead,
    summary="Eliminar un problema",
    description="Elimina un problema del sistema utilizando su ID.",
    response_description="El problema eliminado.",
    responses={
        200: {"description": "Problema eliminado"},
        404: {"model": ErrorResponse, "description": "Problema no encontrado"},
    },
    dependencies=[Depends(verify_admin)]
    )
def delete_problem(problem_id: int, session: SessionDep):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    deleted_problem = problems_controller.delete_problem(session, problem_id)
    return deleted_problem
