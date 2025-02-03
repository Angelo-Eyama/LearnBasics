from sqlmodel import Session, select
from app.models import TestCase
from app.schemas.testCase import TestCaseCreate, TestCaseUpdate

def get_test_cases_by_problem_id(session: Session, problem_id: int):
    test_cases = session.exec(
        select(TestCase).where(TestCase.problemID == problem_id)
        ).all()
    return test_cases

def create_test_case(*, session: Session, new_test_case: TestCaseCreate):
    test_case_db = TestCase.model_validate(new_test_case)
    session.add(test_case_db)
    session.commit()
    session.refresh(test_case_db)
    return test_case_db

def update_test_case(*, session: Session, db_test_case: TestCase, test_case_in: TestCaseUpdate):
    test_case_data = test_case_in.model_dump(exclude_unset=True)
    db_test_case.sqlmodel_update(test_case_data)
    session.add(db_test_case)
    session.commit()
    session.refresh(db_test_case)
    return db_test_case

