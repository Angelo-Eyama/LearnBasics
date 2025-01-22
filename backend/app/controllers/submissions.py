from sqlmodel import Session, select
from ..models import Submission
from datetime import datetime

# # # # # # # # # # # # #  #
# OPERACIONES DE ENTREGAS  #
# # # # # # # # # # # # #  #

def get_submissions(session: Session):
    submissions = session.exec(select(Submission)).all()
    return submissions

def get_submission_by_id(session: Session, submission_id: int):
    submission = session.get(Submission, submission_id)
    return submission

#Funcion que devuelve todas las entregas de un problema concreto
def get_submissions_by_problem_id(session: Session, problem_id: int):
    submissions = session.exec(select(Submission).where(Submission.problemID == problem_id)).all()
    return submissions

#Funcion que devuelve todas las entregas de un usuario concreto
def get_submissions_by_user_id(session: Session, user_id: int):
    submissions = session.exec(select(Submission).where(Submission.userID == user_id)).all()
    return submissions

def create_submission(session: Session, submission: Submission):
    #Incluir la fecha de creacion
    submission.timeSubmitted = datetime.now()
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission

def update_submission(session: Session, submission_id: int, submission_data):
    submission = session.get(Submission, submission_id)
    for key, value in submission_data.items():
        setattr(submission, key, value)
        
    #Incluir la fecha de actualizacion
    submission.timeUpdated = datetime.now()
    session.commit()
    session.refresh(submission)
    return submission

def delete_submission(session: Session, submission_id: int):
    submission = session.get(Submission, submission_id)
    session.delete(submission)
    session.commit()
    return submission
