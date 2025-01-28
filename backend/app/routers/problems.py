from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import Problem
from ..controllers import problems as problems_controller
from ..schemas import ProblemCreate, ProblemRead, ProblemUpdate

router = APIRouter(
    tags=["Problemas"]
    )

@router.get(
    "/problems/",
    response_model=List[ProblemRead],
    summary="Obtener todos los problemas",
    description="Obtiene una lista con todos los problemas registrados en el sistema.",
    response_description="Lista de problemas.",
    responses={
        200: {"description": "Lista de problemas obtenida"},
        404: {"description": "No se encontraron problemas"},
    }
    )
def get_problems(session: Session = Depends(get_session)):
    problems = problems_controller.get_problems(session)
    return problems

@router.get(
    "/problems/id:{problem_id}", 
    response_model=ProblemRead,
    summary="Obtener un problema por su ID",
    description="Obtiene un problema del sistema utilizando su ID como clave.",
    response_description="El problema obtenido.",
    responses={
        200: {"description": "Problema encontrado"},
        404: {"description": "Problema no encontrado"},
    }
    )
def get_problem_by_id(problem_id: int, session: Session = Depends(get_session)):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    return problem

@router.get(
    "/problems/{block}",
    response_model=List[ProblemRead],
    summary="Obtener problemas por bloque",
    description="Obtiene una lista con todos los problemas registrados en el sistema de un bloque específico.",
    response_description="Lista de problemas en ese bloque.",
    responses={
        200: {"description": "Lista de problemas obtenida"},
        404: {"description": "No se encontraron problemas o no existe el bloque solicitado."},
    }
    )
def get_problems_by_block(block: str, session: Session = Depends(get_session)):
    problems = problems_controller.get_problems_by_block(session, block)
    if not problems:
        raise HTTPException(status_code=404, detail="No se encontraron problemas o no existe el bloque solicitado.")
    return problems

@router.post(
    "/problems/",
    response_model=ProblemCreate,
    summary="Crear un problema",
    description="Crea un nuevo problema en el sistema.",
    response_description="El problema creado.",
    responses={
        200: {"description": "Problema creado"},
        404: {"description": "Problema no creado"},
    }
    )
def create_problem(problem: ProblemCreate, session: Session = Depends(get_session)):
    new_problem = problems_controller.create_problem(session, Problem.from_orm(problem))
    return new_problem

@router.patch(
    "/problems/{problem_id}", 
    response_model=ProblemUpdate,
    summary="Actualizar un problema",
    description="Actualiza un problema del sistema utilizando su ID como clave.",
    responses={
        200: {"description": "Problema actualizado"},
        404: {"description": "Problema no encontrado"},
    }
    )
def update_problem(problem_id: int, problem_update: ProblemUpdate, session: Session = Depends(get_session)):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    updated_problem = problems_controller.update_problem(session, problem_id, problem_update.dict(exclude_unset=True))
    return updated_problem

@router.delete(
    "/problems/{problem_id}",
    response_model=ProblemRead,
    summary="Eliminar un problema",
    description="Elimina un problema del sistema utilizando su ID.",
    response_description="El problema eliminado.",
    responses={
        200: {"description": "Problema eliminado"},
        404: {"description": "Problema no encontrado"},
    }
    )
def delete_problem(problem_id: int, session: Session = Depends(get_session)):
    problem = problems_controller.get_problem_by_id(session, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    deleted_problem = problems_controller.delete_problem(session, problem_id)
    return deleted_problem
