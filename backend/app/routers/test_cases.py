from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import testCase
from ..controllers import test_cases as test_cases_controller
from ..schemas import TestCaseCreate, TestCaseRead, TestCaseUpdate

router = APIRouter(tags=["Casos de prueba"])

@router.get("/testCases/", response_model=List[TestCaseRead])
def get_testCases(session: Session = Depends(get_session)):
    testCases = test_cases_controller.get_testCases(session)
    return testCases

@router.get("/testCases/{testCase_id}", response_model=TestCaseRead)
def get_testCase_by_id(testCase_id: int, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(status_code=404, detail="Caso de prueba no encontrado")
    return testCase

@router.get("/testCases/problem/{problem_id}", response_model=List[TestCaseRead])
def get_testCases_by_problem_id(problem_id: int, session: Session = Depends(get_session)):
    testCases = test_cases_controller.get_testCases_by_problem_id(session, problem_id)
    return testCases

@router.post("/testCases/", response_model=TestCaseRead)
def create_testCase(testCase: TestCaseCreate, session: Session = Depends(get_session)):
    testCase = test_cases_controller.create_testCase(session, testCase)
    return testCase

@router.patch("/testCases/{testCase_id}", response_model=TestCaseRead)
def update_testCase(testCase_id: int, testCase_update: TestCaseUpdate, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(status_code=404, detail="Caso de prueba no encontrado")
    updated_testCase = test_cases_controller.update_testCase(session, testCase_id, testCase_update.dict(exclude_unset=True))
    return updated_testCase

@router.delete("/testCases/{testCase_id}", response_model=TestCaseRead)
def delete_testCase(testCase_id: int, session: Session = Depends(get_session)):
    testCase = test_cases_controller.get_testCase_by_id(session, testCase_id)
    if not testCase:
        raise HTTPException(status_code=404, detail="Caso de prueba no encontrado")
    deleted_testCase = test_cases_controller.delete_testCase(session, testCase_id)
    return deleted_testCase

