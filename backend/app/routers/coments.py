from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import Comment
from ..controllers import comments as comments_controller
from ..schemas import CommentCreate, CommentRead, CommentUpdate

router = APIRouter(tags=["Comentarios"])

@router.get("/comments/", response_model=List[CommentRead])
def get_comments(session: Session = Depends(get_session)):
    comments = comments_controller.get_comments(session)
    return comments

@router.get("/comments/{comment_id}", response_model=CommentRead)
def get_comment_by_id(comment_id: int, session: Session = Depends(get_session)):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    return comment

@router.get("/comments/user/{user_id}", response_model=List[CommentRead])
def get_comments_by_user_id(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    comments = comments_controller.get_comments_by_user_id(session, user_id)
    
    return comments

@router.post("/comments/", response_model=CommentRead)
def create_comment(comment: CommentCreate, session: Session = Depends(get_session)):
    comment = comments_controller.create_comment(session, comment)
    return comment

@router.patch("/comments/{comment_id}", response_model=CommentRead)
def update_comment(comment_id: int, comment_update: CommentUpdate, session: Session = Depends(get_session)):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    updated_comment = comments_controller.update_comment(session, comment_id, comment_update.dict(exclude_unset=True))
    return updated_comment

@router.delete("/comments/{comment_id}", response_model=CommentRead, summary="Eliminar un comentario", description="Elimina un comentario del sistema utilizando su ID.", response_description="El comentario eliminado.")
def delete_comment(comment_id: int, session: Session = Depends(get_session)):
    comment = comments_controller.get_comment_by_id(session, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    deleted_comment = comments_controller.delete_comment(session, comment_id)
    return deleted_comment