from sqlmodel import Session, select
from app.models import Token
from app.schemas.token import TokenUpdate

def create_token(session: Session, token: Token):
    db_token = Token.model_validate(token)
    session.add(db_token)
    session.commit()
    session.refresh(db_token)
    return db_token

def get_token_by_user_id(session: Session, user_id: int):
    token = session.exec(
        select(Token).where(Token.userID == user_id)
        ).first()
    return token

def update_token(session: Session, user_id: int, token_in: TokenUpdate):
    tmp = get_token_by_user_id(session, user_id)
    db_token = session.get(Token, tmp.id)
    if not db_token:
        raise ValueError("Token no encontrado")
    token_data = token_in.model_dump(exclude_unset=True)
    db_token.sqlmodel_update(token_data)
    session.add(db_token)
    session.commit()
    session.refresh(db_token)
    return db_token

def change_state_token(session: Session, token_id: int):
    token = session.get(Token, token_id)
    token.isValid = not token.isValid
    session.commit()
    session.refresh(token)
    return token