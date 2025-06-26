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

Luego activamos el entorno virtual con el siguiente comando:

``` bash
source venv/bin/activate # Linux
.\venv\Scripts\activate # Windows
```

Con el entorno listo, instalamos las dependencias del proyecto con el siguiente comando:

``` bash
pip install -r requirements.txt
```

Si todo ha salido bien, debes tener ya instalada la libreria alembic, que se encargara de gestionar las migraciones de la base de datos. Para crear la base de datos y las tablas, solo tenemos que correr el siguiente comando:
``` bash
    (Asegurate de tener el motor de base de datos corriendo)
    alembic upgrade head
```

Necesitas un archivo .env en la raiz del proyecto con las siguientes variables de entorno, en el proyecto hay uno de ejemplo.
Ejecuta:
``` bash
cp .env.example .env
```
Modifica el archivo .env con tus credenciales de la base de datos y cambia los datos de la aplicacion si lo deseas.

Ahora solo tenemos que correr el siguiente comando para iniciar el servidor:

``` bash
uvicorn app.main:app --reload
```
o si prefieres
``` bash
fastapi dev app/main.py
```
Accede a la url [http://localhost:8000/docs](http://localhost:8000/docs) para ver la documentacion de la API.
