from datetime import timedelta, datetime, timezone
from pydantic import EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.controllers.users import authenticate, get_user_by_email
from app.core import security
from app.core.config import settings
from app.schemas.utils import Token, ErrorResponse
from app.api.deps import SessionDep

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    )

@router.post("/access-token",
            response_model=Token,
            summary="Generar token de acceso",
            description="Solicita datos de inicio de sesion y genera un token de acceso para el usuario.",
            )
def login_for_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    '''
    Genera un token de acceso para el usuario.
    '''
    user = authenticate(session=session,  username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "roles": [role.name for role in user.roles]
            },
        expires_delta=access_token_expires
        )
    # TODO: Enviar el token por cookies
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/password-recovery",
            response_model=Token,
            summary="Solicitar recuperacion de contraseña",
            description="El usuario solicita recuperar su contraseña. Se enviara un correo electronico con el token de recuperacion.",
            responses={
                200: {
                    "model": Token,
                    "description": "Se ha enviado un correo electronico con el token de recuperacion.",
                },
                400: {
                    "model": ErrorResponse,
                    "description": "El usuario no existe o el correo electronico no es valido.",
                },
            }
            )
def password_recovery(email: EmailStr, session: SessionDep):
    user = get_user_by_email(session, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario no existe",
        )
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo",
        )
    # Generar token de recuperacion
    token = security.create_password_recovery_token()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=settings.PASSWORD_RECOVERY_TOKEN_EXPIRE_MINUTES)
    # Guardar token en la base de datos
    session.add(
        Token(
            userID=user.id,
            token=token,
            expire_at=expiration,
            type="recovery",
            isValid=True
        )
    )
    session.commit()
    # TODO: Enviar correo electronico con el token de recuperacion
    if False:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        subject = "Recuperacion de contraseña"
        body = f"Hola {user.username},\n\nPara recuperar tu contraseña, haz clic en el siguiente enlace:\n{reset_link}\n\nSi no solicitaste esta recuperacion, ignora este correo."
        # send_email(email)

    return {
        "message": "Se ha enviado un correo electronico con el token de recuperacion.",
        "token": token,
        "expire_at": expiration.isoformat()
    }

''' 
    FUNCIONES A IMPLEMENTAR EN UN FUTURO:
    * Recuperar contraseña
    * Cambiar contraseña
    * Reiniciar contraseña
    * Recuperar usuario y contraseña
'''
