from typing import List
from fastapi import APIRouter, HTTPException
from app.api.deps import SessionDep, CurrentUser

from app.models import Problem
from app.api.controllers import test_cases as test_cases_controller
from app.schemas.testCase import TestCaseCreate, TestCaseRead, TestCaseUpdate



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
def get_test_cases(session: SessionDep):
    test_cases = test_cases_controller.get_test_cases(session)
    return test_cases


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
def get_test_case_by_id(test_case_id: int, session: SessionDep):
    test_case = test_cases_controller.get_test_case_by_id(session, test_case_id)
    if not test_case:
        raise HTTPException(
            status_code=404, detail="Caso de prueba no encontrado")
    return test_case


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
def get_test_cases_by_problem_id(problem_id: int, session: SessionDep):
    problem = session.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problema no encontrado")
    
    test_cases = test_cases_controller.get_test_cases_by_problem_id(session, problem_id)
    return test_cases


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
def create_test_case(test_case: TestCaseCreate, session: SessionDep):
    test_case = test_cases_controller.create_test_case(session, test_case)
    return test_case


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
def update_test_case(test_case_id: int, test_case_update: TestCaseUpdate, session: SessionDep):
    test_case = test_cases_controller.get_test_case_by_id(session, test_case_id)
    if not test_case:
        raise HTTPException(status_code=404, detail="Caso de prueba no encontrado")
    
    updated_test_case = test_cases_controller.update_test_case(
        session=session, db_test_case=test_case, test_case_in=test_case_update)
    return updated_test_case


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
def delete_test_case(test_case_id: int, session: SessionDep):
    test_case = test_cases_controller.get_test_case_by_id(session, test_case_id)
    if not test_case:
        raise HTTPException(
            status_code=404, detail="Caso de prueba no encontrado")
    deleted_test_case = test_cases_controller.delete_test_case(
        session, test_case_id)
    return deleted_test_case
