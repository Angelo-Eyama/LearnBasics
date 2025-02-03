from typing import Any
from sqlmodel import Session, select
from app.models import Problem
from app.schemas.problem import ProblemCreate, ProblemRead, ProblemUpdate

def create_problem(*, session: Session, new_problem: ProblemCreate) -> Problem:
    problem_db = Problem.model_validate(new_problem)
    session.add(problem_db)
    session.commit()
    session.refresh(problem_db)
    return problem_db

def update_problem(*, session: Session, db_problem: Problem, problem_in: ProblemUpdate) -> Problem:
    problem_data = problem_in.model_dump(exclude_unset=True)
    db_problem.sqlmodel_update(problem_data)
    session.add(db_problem)
    session.commit()
    session.refresh(db_problem)
    return db_problem

def get_problems_by_block(*, session: Session, block: str) -> List[Problem]:
    problems = session.exec(select(Problem).where(Problem.block == block)).all()
    return problems