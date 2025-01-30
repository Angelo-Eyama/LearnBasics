# Documentacion Backend

## Descripcion
Esta parte del proyecto representa el backend de la aplicacion **LearnBasics**. En este se encuentran los servicios que se encargan de la logica de negocio y la comunicacion con la base de datos.

## Tecnologías
- Para el desarrollo de esta parte se utiliza el framework de Pythoh, **FastApi**.
- Para la base de datos se utiliza **MySQL**, que se comunica con el backend a traves de la libreria **SQLModel**.
- Para la autenticacion se utiliza **JWT**.

## Instalacion
Lo primero es crear un entorno virtual de python con el siguiente comnando:

``` bash
python -m venv venv
```

Con el entorno listo, instalamos las dependencias del proyecto con el siguiente comando:

``` bash
pip install -r requirements.txt
```

Si todo ha salido bien, solo tenemos que correr el siguiente comando para iniciar el servidor:

``` bash
uvicorn app.main:app --reload
```
Accede a la url [http://localhost:8000/docs](http://localhost:8000/docs) para ver la documentacion de la API.



## Estructura

Actualmente, la estructura del proyecto es la siguiente:

``` textplain
.
├── app/
│   ├── __init__.py
│   ├── controllers/
│   │   ├── __init__.py
│   │   ├── comments.py
│   │   ├── notifications.py
│   │   ├── problems.py
│   │   ├── reports.py
│   │   ├── roles.py
│   │   ├── submissions.py
│   │   ├── test_cases.py
│   │   ├── users.py
│   ├── database.py
│   ├── db/
│   │   └── database.sql
│   ├── main.py
│   ├── models.py
│   ├── routers/
│   │   ├── coments.py
│   │   ├── notifications.py
│   │   ├── problems.py
│   │   ├── reports.py
│   │   ├── roles.py
│   │   ├── submissions.py
│   │   ├── test_cases.py
│   │   ├── users.py
│   ├── schemas.py
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   ├── test_users.py
│   ├── tests.py
├── .gitignore
├── requirements.txt
└── README.md
````

Aunque ahora mismo estoy intentando reestructurar el proyecto para que sea mas escalable y mantenible.
La estructura a la que aspiro es la siguiente:

``` textplain

.
├── app/
│   ├── __init__.py
│   ├── main.py                  # Punto de entrada de la aplicación
│   ├── core/                    # Configuraciones y utilidades generales
│   │   ├── __init__.py
│   │   ├── config.py            # Configuraciones (entorno, base de datos, etc.)
│   │   ├── security.py          # Lógica de autenticación y JWT
│   │   └── utils.py             # Funciones utilitarias
│   ├── models/                  # Modelos de la base de datos (SQLModel)
│   │   ├── __init__.py
│   │   ├── user.py              # Modelo de usuario
│   │   └── ...                  # Otros modelos
│   ├── schemas/                 # Esquemas Pydantic para validación de datos
│   │   ├── __init__.py
│   │   ├── user.py              # Esquemas relacionados con usuarios
│   │   └── ...                  # Otros esquemas
│   ├── api/                     # Endpoints de la API
│   │   ├── __init__.py
│   │   ├── v1/                  # Versión 1 de la API
│   │   │   ├── __init__.py
│   │   │   ├── routers/         # Rutas específicas
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py      # Rutas de autenticación (login, registro, etc.)
│   │   │   │   ├── users.py     # Rutas relacionados con usuarios
│   │   │   │   └── ...          # Otros rutas
│   │   │   └── routers.py       # Routers para agrupar rutas
│   ├── controllers/             # Controladores de cada modelo
│   │   ├── __init__.py
│   │   ├── user.py              # Controlador de usuario
│   │   └── ...                  # Otros controladores de modelos
│   ├── database/                # Configuración y conexión a la base de datos
│   │   ├── __init__.py
│   │   └── session.py           # Sesión de SQLModel
│   └── tests/                   # Pruebas unitarias e integración
│       ├── __init__.py
│       ├── test_auth.py         # Pruebas de autenticación
│       ├── test_users.py        # Pruebas de usuarios
│       └── ...                  # Otras pruebas
├── requirements.txt             # Dependencias del proyecto
├── .env                         # Variables de entorno
└── README.md                    # Documentación del proyecto
```