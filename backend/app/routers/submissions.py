from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import Submission
from ..controllers import submissions as submissions_controller
from ..schemas import SubmissionCreate, SubmissionRead, SubmissionUpdate

router = APIRouter(tags=["Entregas"])

@router.get("/submissions/", response_model=List[SubmissionRead])
def get_submissions(session: Session = Depends(get_session)):
    submissions = submissions_controller.get_submissions(session)
    return submissions

@router.get("/submissions/{submission_id}", response_model=SubmissionRead)
def get_submission_by_id(submission_id: int, session: Session = Depends(get_session)):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return submission

@router.post("/submissions/", response_model=SubmissionCreate)
def create_submission(submission: SubmissionCreate, session: Session = Depends(get_session)):
    new_submission = submissions_controller.create_submission(session, Submission.from_orm(submission))
    return new_submission

@router.patch("/submissions/{submission_id}", response_model=SubmissionUpdate)
def update_submission(submission_id: int, submission_update: SubmissionUpdate, session: Session = Depends(get_session)):
    submission = submissions_controller.get_submission_by_id(session, submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    updated_submission = submissions_controller.update_submission(session, submission_id, submission_update.dict(exclude_unset=True))
    return updated_submission