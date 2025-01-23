from sqlmodel import Session, select
from ..models import Problem

# # # # # # # # # # # # #  #
# OPERACIONES DE PROBLEMAS #
# # # # # # # # # # # # #  #


def get_problems(session: Session):
    problems = session.exec(select(Problem)).all()
    return problems

def get_problem_by_id(session: Session, problem_id: int):
    problem = session.get(Problem, problem_id)
    return problem

def get_problems_by_block(session: Session, block: str):
    problems = session.exec(select(Problem).where(Problem.block == block)).all()
    return problems

def create_problem(session: Session, problem: Problem):
    session.add(problem)
    session.commit()
    session.refresh(problem)
    return problem

def update_problem(session: Session, problem_id: int, problem_data):
    problem = session.get(Problem, problem_id)
    for key, value in problem_data.items():
        setattr(problem, key, value)
    session.commit()
    session.refresh(problem)
    return problem

def delete_problem(session: Session, problem_id: int):
    problem = session.get(Problem, problem_id)
    session.delete(problem)
    session.commit()
    return problem