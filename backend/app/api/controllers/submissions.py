from sqlmodel import Session, select
from app.models import Submission
from datetime import datetime
from app.schemas.submission import SubmissionCreate, SubmissionUpdate

def get_submissions(session: Session):
    submissions = session.exec(select(Submission)).all()
    return submissions

def get_submission_by_id(session: Session, submission_id: int):
    submission = session.get(Submission, submission_id)
    return submission

#Funcion que devuelve todas las entregas de un problema concreto
def get_submissions_by_problem_id(session: Session, problem_id: int):
    submissions = session.exec(
        select(Submission).where(Submission.problemID == problem_id)
        ).all()
    return submissions

#Funcion que devuelve todas las entregas de un usuario concreto
def get_submissions_by_user_id(session: Session, user_id: int):
    submissions = session.exec(select(Submission).where(Submission.userID == user_id)).all()
    return submissions

def create_submission(session: Session, new_submission: SubmissionCreate):
    submission_db = Submission.model_validate(new_submission)
    session.add(submission_db)
    session.commit()
    session.refresh(submission_db)
    return submission_db

def update_submission(*, session: Session, db_submission: Submission, submission_in: SubmissionUpdate):
    submission_data = submission_in.model_dump(exclude_unset=True)
    db_submission.sqlmodel_update(submission_data)
    session.add(db_submission)
    session.commit()
    session.refresh(db_submission)
    return db_submission
