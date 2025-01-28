from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import testCase, Problem
from ..controllers import test_cases as test_cases_controller
from ..schemas import TestCaseCreate, TestCaseRead, TestCaseUpdate

router = APIRouter(tags=["Casos de prueba"])


@router.get(
    "/testCases/",
    response_model=List[TestCaseRead],
    summary="Obtener todos los casos de prueba",
    description="Obtiene una lista con todos los casos de prueba registrados en el sistema.",
    response_description="Lista de casos de prueba.",
    responses={
        200: {"description": "Lista de casos de prueba obtenida"},
    }
)
def get_testCases(session: Session = Depends(get_session)):
    testCases = test_cases_controller.get_testCases(session)
    return testCases


@router.get(
    "/testCases/{testCase_id}",
    response_model=TestCaseRead,
    summary="Obtener un caso de prueba por su ID",
    description="Obtiene un caso de prueba del sistema utilizando su ID como clave.",
    response_description="El caso de prueba obtenido.",
    responses={
        200: {"description": "Caso de prueba encontrado"},
        404: {"description": "Caso de prueba no encontrado"},
    }
)
def get_testCase_by_id(testCase_id: int, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(
            status_code=404, detail="Caso de prueba no encontrado")
    return testCase


@router.get(
    "/testCases/problem/{problem_id}",
    response_model=List[TestCaseRead],
    summary="Obtener casos de prueba por problema",
    description="Obtiene una lista con todos los casos de prueba registrados en el sistema de un problema específico.",
    response_description="Lista de casos de prueba de ese problema.",
    responses={
        200: {"description": "Lista de casos de prueba obtenida"},
        404: {"description": "No se encontraron casos de prueba o no existe el problema solicitado."},
    }
)
def get_testCases_by_problem_id(problem_id: int, session: Session = Depends(get_session)):
    problem = session.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    
    testCases = test_cases_controller.get_testCases_by_problem_id(session, problem_id)
    return testCases


@router.post(
    "/testCases/",
    response_model=TestCaseRead,
    summary="Crear un caso de prueba",
    description="Crea un nuevo caso de prueba en el sistema.",
    response_description="El caso de prueba creado.",
    responses={
        200: {"description": "Caso de prueba creado"},
    }
)
def create_testCase(testCase: TestCaseCreate, session: Session = Depends(get_session)):
    testCase = test_cases_controller.create_testCase(session, testCase)
    return testCase


@router.patch(
    "/testCases/{testCase_id}",
    response_model=TestCaseRead,
    summary="Actualizar un caso de prueba",
    description="Actualiza la informacion de un caso de prueba en el sistema utilizando su ID como clave.",
    response_description="Caso de prueba actualizado.",
    responses={
        200: {"description": "Caso de prueba actualizado"},
        404: {"description": "Caso de prueba no encontrado"},
    }
)
def update_testCase(testCase_id: int, testCase_update: TestCaseUpdate, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(status_code=404, detail="Caso de prueba no encontrado")
    
    updated_testCase = test_cases_controller.update_testCase(
        session, testCase_id, testCase_update.dict(exclude_unset=True))
    return updated_testCase


@router.delete(
    "/testCases/{testCase_id}",
    response_model=TestCaseRead,
    summary="Eliminar un caso de prueba",
    description="Elimina un caso de prueba del sistema utilizando su ID.",
    response_description="El caso de prueba eliminado.",
    responses={
        200: {"description": "Caso de prueba eliminado"},
        404: {"description": "Caso de prueba no encontrado"},
    }
)
def delete_testCase(testCase_id: int, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(
            status_code=404, detail="Caso de prueba no encontrado")
    deleted_testCase = test_cases_controller.delete_testCase(
        session, testCase_id)
    return deleted_testCase
