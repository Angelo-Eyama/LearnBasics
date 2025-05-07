from datetime import timedelta, datetime, timezone
from pydantic import EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.controllers.users import authenticate, get_user_by_email, update_password
from app.api.controllers import token as token_controller
from app.core import security
from app.core.config import settings
from app.models import User
from app.schemas.utils import AccessToken, ErrorResponse, Message
from app.schemas.token import TokenUpdate
from app.schemas.user import UserUpdate

from app.api.deps import SessionDep

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    )

@router.post("/access-token",
            response_model=AccessToken,
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
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/password-recovery",
            summary="Solicitar recuperacion de contraseña",
            description="El usuario solicita recuperar su contraseña. Se enviara un correo electronico con el token de recuperacion.",
            responses={
                200: {
                    "model": Message,
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

    # Generar y guardar token en la base de datos
    token_data = TokenUpdate(
        userID= user.id,
        token= security.create_password_recovery_token(),
        expire_at= datetime.now(timezone.utc) + timedelta(minutes=settings.RECOVERY_TOKEN_EXPIRE_MINUTES),
        type= "recovery",
        isValid= True
    )
    # Verificar si el usuario ya tiene un token de recuperacion activo
    if token_controller.get_token_by_user_id(session, user.id):
        # print(f"El usuario {user.id, user.username} ya tiene un token de recuperacion activo")
        token = token_controller.update_token(session, user.id, token_data)
    else:
        token = token_controller.create_token(session, token_data)
    # TODO: Enviar correo electronico con el token de recuperacion
    if False:
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        subject = "Recuperacion de contraseña"
        body = f"Hola {user.username},\n\nPara recuperar tu contraseña, haz clic en el siguiente enlace:\n{reset_link}\n\nSi no solicitaste esta recuperacion, ignora este correo."
        # send_email(email)

    return {
        "message": f"Se ha enviado un correo electronico a {email} con el token de recuperacion.",
    }

@router.post("/password-reset",
            summary="Restablecer contraseña",
            description="El usuario introduce los datos de su nueva contraseña y el token de recuperacion.",
            responses={
                200: {
                    "model": Message,
                    "description": "Se ha actualizado la contraseña.",
                },
                400: {
                    "model": ErrorResponse,
                    "description": "El token es invalido o ha caducado.",
                },
            }
            )
def password_reset(token: str, new_password: str, session: SessionDep):
    '''
    Restablece la contraseña del usuario.
    '''
    # Verificar si el token es valido
    token_data = token_controller.get_token_by_token(session, token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token introducido no existe",
        )
    if not token_data.isValid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token ya no es valido",
        )
    if token_data.expire_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token ha caducado",
        )
    
    # Actualizar la contraseña del usuario
    user = session.get(User, token_data.userID)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario no existe",
        )

    update_password(session, user, new_password)
    # Invalidar el token
    token_controller.change_state_token(session, token_data.id)
    
    return {
        "message": f"Se ha actualizado la contraseña de {user.username}",
    }

@router.post("/verify-register-token",
            summary="Solicitar token de registro",
            description="El usuario solicita el token de verificacion y para poder verificar su cuenta.",
            responses={
                200: {
                    "model": Message,
                    "description": "Se ha enviado un correo electronico con el token de verificacion.",
                },
                400: {
                    "model": ErrorResponse,
                    "description": "El usuario no existe o el correo electronico no es valido.",
                },
            }
            )
def verify_register_token(email: EmailStr, session: SessionDep):
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

    # Generar y guardar token en la base de datos
    token_data = TokenUpdate(
        userID= user.id,
        token= security.create_password_recovery_token(),
        expire_at= datetime.now(timezone.utc) + timedelta(minutes=settings.RECOVERY_TOKEN_EXPIRE_MINUTES),
        type= "verify",
        isValid= True
    )
    # Verificar si el usuario ya tiene un token de verificacion activo
    db_token = token_controller.get_token_by_user_id(session, user.id)
    if db_token and any(token.type != token_data.type for token in db_token):
        token = token_controller.update_token(session, user.id, token_data)
    else:
        token = token_controller.create_token(session, token_data)
    # TODO: Enviar correo electronico con el token de verificacion
    if False:
        reset_link = f"{settings.FRONTEND_URL}/verify?token={token}"
        subject = "Confirmación de registro"
        body = f"Hola {user.username},\n\n Para confirmar tu registro, haz clic en el siguiente enlace:\n{reset_link}\n\nSi no solicitaste esta confirmacion, ignora este correo."
        # send_email(email)

    return {
        "message": f"Se ha enviado un correo electronico a {email} con el token de verificacion.",
    }

@router.post("/verify-account",
            summary="Verificar cuenta de usuario",
            description="El usuario introduce el token de verificacion y se le activa la cuenta.",
            responses={
                200: {
                    "model": Message,
                    "description": "Se ha activado la cuenta.",
                },
                400: {
                    "model": ErrorResponse,
                    "description": "El token es invalido o ha caducado.",
                },
            }
            )
def verify_account(session: SessionDep, token: str):
    '''
    Verifica el token de registro del usuario.
    '''
    # Verificar si el token es valido
    token_data = token_controller.get_token_by_token(session, token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token introducido no existe",
        )
    if not token_data.isValid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token ya no es valido",
        )
    if token_data.expire_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token ha caducado",
        )
    
    # Activar la cuenta del usuario
    user = session.get(User, token_data.userID)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario no existe",
        )

    user.active = True
    user.isVerified = True
    session.add(user)
    session.commit()
    session.refresh(user)

    # Invalidar el token
    token_controller.change_state_token(session, token_data.id)

    return {
        "message": f"Se ha activado la cuenta de {user.username}",
    }

