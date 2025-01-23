from sqlmodel import Session, select
from ..models import testCase

def get_testCases(session: Session):
    testCases = session.exec(select(testCase)).all()
    return testCases

def get_testCase_by_id(session: Session, testCase_id: int):
    testCase = session.get(testCase, testCase_id)
    return testCase

def get_testCases_by_problem_id(session: Session, problem_id: int):
    testCases = session.exec(select(testCase).where(testCase.problem_id == problem_id)).all()
    return testCases

def create_testCase(session: Session, testCase: testCase):
    session.add(testCase)
    session.commit()
    session.refresh(testCase)
    return testCase

def update_testCase(session: Session, testCase_id: int, testCase_data):
    testCase = session.get(testCase, testCase_id)
    for key, value in testCase_data.items():
        setattr(testCase, key, value)
    session.commit()
    session.refresh(testCase)
    return testCase

def delete_testCase(session: Session, testCase_id: int):
    testCase = session.get(testCase, testCase_id)
    session.delete(testCase)
    session.commit()
    return testCase