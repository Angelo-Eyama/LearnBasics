from sqlmodel import SQLModel, select, Field, create_engine, Session

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