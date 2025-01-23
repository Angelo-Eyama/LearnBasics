from sqlmodel import SQLModel, select, Field, create_engine, Session
from sqlalchemy.exc import IntegrityError

#Conexion a la base de datos
DATABASE_URL = "mysql+mysqlconnector://root:@localhost/basic"  # Cambia `root` y la contraseña según tu configuración
engine = create_engine(DATABASE_URL)

#Funcion para obtener la sesion
def get_session() -> Session:
    with Session(engine) as session:
        yield session
        
#Funcion para crear la tabla
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
#Funcion que crea datos de prueba
def create_rows():
    from .models import User, Role, UserRole
    from datetime import datetime
    
    with Session(engine) as session:
        #Creamos roles
        admin_role = Role(role="Administrador", description="Administrador de la aplicacion, tiene acceso ilimitado a cualquier recurso")
        moderator_role = Role(role="Moderador", description="Moderador de la aplicacion, tiene acceso limitado a ciertos recursos")
        user_role = Role(role="Usuario", description="Usuario normal de la aplicacion")
        session.commit()
        
        try:
            #Creamos los usuarios
            user1 = User(
                username="admin", 
                password="password123", 
                firstName="Admin", 
                lastName="Admin", 
                email="admin@mail.com", 
                creationDate=datetime.now(),
                roles=[admin_role]
                )
            
            user2 = User(
                username="moderator", 
                password="password123", 
                firstName="Moderator", 
                lastName="Moderator", 
                email="moderator@mail.com" ,
                creationDate=datetime.now(),
                roles=[moderator_role]
                )
            
            user3 = User(
                username="user", 
                password="password123", 
                firstName="User", 
                lastName="User", 
                email="user@mail.com", 
                creationDate=datetime.now(),
                roles=[user_role]
                )
            #Añadimos los usuarios (e indirectamente los roles)
            session.add(user1)
            session.add(user2)
            session.add(user3)
            session.commit()
        except IntegrityError as e:
            print(f"Error en la creacion de datos de prueba. Lo mas probable es que los datos ya existan")
            session.rollback()
