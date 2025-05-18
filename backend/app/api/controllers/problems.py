from typing import List
from sqlmodel import Session, select
from app.models import Problem, User
from app.schemas.problem import ProblemCreate, ProblemRead, ProblemUpdate

def get_problems(session: Session, skip: int = 0, limit: int = 10) -> List[Problem]:
    problems = session.exec(select(Problem).offset(skip).limit(limit)).all()
    return problems

def get_problem_by_id(session: Session, problem_id: int) -> Problem:
    problem = session.get(Problem, problem_id)
    return problem

def get_problems_by_difficulty(session: Session, difficulty: str) -> List[Problem]:
    problems = session.exec(select(Problem).where(Problem.difficulty == difficulty)).all()
    return problems

def create_problem(*, session: Session, new_problem: ProblemCreate, current_user: User) -> Problem:
    problem_db = Problem.model_validate(
        new_problem,
        update={"authorID": current_user.id}
        )
    session.add(problem_db)
    session.commit()
    session.refresh(problem_db)
    return problem_db

def update_problem(session: Session, db_problem: Problem, problem_in: ProblemUpdate) -> Problem:
    problem_data = problem_in.model_dump(exclude_unset=True)
    db_problem.sqlmodel_update(problem_data)
    session.add(db_problem)
    session.commit()
    session.refresh(db_problem)
    return db_problem

def delete_problem(session: Session, problem_id: int) -> Problem:
    problem = session.get(Problem, problem_id)
    session.delete(problem)
    session.commit()
    return problem
