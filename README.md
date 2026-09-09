# 🎵 Music Manager

Aplicación web full-stack para la gestión de bandas y canciones.

## 📋 Descripción

Music Manager es una aplicación web desarrollada como proyecto académico de la asignatura de Ingeniería en Sistemas.

El sistema permite gestionar información de bandas musicales y las canciones asociadas a cada una de ellas mediante una API REST y una interfaz web.

## 🎯 Objetivo

Desarrollar e implementar una aplicación web full-stack utilizando servicios de infraestructura en la nube, integrando:

* Una API REST.
* Una base de datos PostgreSQL.
* Una interfaz web.
* Servicios de infraestructura cloud.
* Documentación técnica del proyecto.

## 🛠️ Tecnologías utilizadas

### Backend

* Python
* FastAPI
* Uvicorn
* Psycopg2
* Python-dotenv

### Base de datos

* PostgreSQL

### Frontend

* HTML5
* CSS3
* JavaScript

### Control de versiones

* Git
* GitHub

### Infraestructura cloud

* **Despliegue planeado:** AWS (Amazon Web Services)
  * **Frontend:** AWS Amplify / S3 Static Website Hosting
  * **Backend:** AWS App Runner (contenedor Docker con FastAPI)
  * **Base de datos:** PostgreSQL en la nube (Neon.tech / AWS RDS)
  * **CI/CD:** GitHub Actions / AWS Pipeline integration

## ⚙️ Funcionalidades

### Gestión de bandas

La aplicación permite:

* Registrar nuevas bandas.
* Consultar todas las bandas registradas.
* Consultar una banda específica.
* Actualizar la información de una banda.
* Eliminar una banda cuando no tenga canciones asociadas.

### Gestión de canciones

La aplicación permite:

* Registrar nuevas canciones.
* Consultar todas las canciones.
* Consultar una canción específica.
* Actualizar la información de una canción.
* Eliminar canciones.
* Consultar las canciones asociadas a una banda.

### Relación entre entidades

Una banda puede tener múltiples canciones asociadas.

La relación se representa mediante la clave foránea `banda_id` en la tabla `canciones`.

```text
Bandas
  │
  │ 1:N
  │
  ▼
Canciones
```

## 🗄️ Modelo de datos

El sistema utiliza dos entidades principales:

### Banda

| Campo       | Tipo    | Descripción             |
| ----------- | ------- | ----------------------- |
| id          | INTEGER | Identificador único     |
| nombre      | VARCHAR | Nombre de la banda      |
| genero      | VARCHAR | Género musical          |
| descripcion | VARCHAR | Descripción de la banda |

### Canción

| Campo    | Tipo    | Descripción                        |
| -------- | ------- | ---------------------------------- |
| id       | INTEGER | Identificador único                |
| titulo   | VARCHAR | Título de la canción               |
| duracion | VARCHAR | Duración de la canción             |
| album    | VARCHAR | Álbum al que pertenece             |
| banda_id | INTEGER | Identificador de la banda asociada |

## 🚀 Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/fernandopfomeque-ui/music_manager.git
cd music_manager
```

### 2. Configurar el backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activar el entorno virtual en Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Instalar las dependencias

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend` con las credenciales de conexión a PostgreSQL.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_manager
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

> ⚠️ El archivo `.env` no debe subirse a GitHub, ya que contiene información privada.

### 5. Configurar la base de datos

Crear la base de datos PostgreSQL y ejecutar los archivos:

```text
database/schema.sql
database/seed.sql
```

`schema.sql` contiene la estructura de las tablas y `seed.sql` contiene los datos iniciales.

### 6. Ejecutar el backend

Desde la carpeta `backend`:

```bash
uvicorn main:app --reload
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

La documentación interactiva de la API estará disponible en:

```text
http://127.0.0.1:8000/docs
```

### 7. Ejecutar el frontend

Abrir el archivo:

```text
frontend/index.html
```

en un navegador web.

El frontend se comunica con la API REST del backend para consultar y modificar las bandas y canciones.

## 🔌 API REST

La API proporciona diferentes endpoints para gestionar las bandas y canciones.

### Bandas

| Método | Endpoint                     | Descripción                        |
| ------ | ---------------------------- | ---------------------------------- |
| GET    | `/api/bandas`                | Obtener todas las bandas           |
| GET    | `/api/bandas/{id}`           | Obtener una banda específica       |
| POST   | `/api/bandas`                | Crear una nueva banda              |
| PUT    | `/api/bandas/{id}`           | Actualizar una banda               |
| DELETE | `/api/bandas/{id}`           | Eliminar una banda                 |
| GET    | `/api/bandas/{id}/canciones` | Obtener las canciones de una banda |

### Canciones

| Método | Endpoint              | Descripción                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/api/canciones`      | Obtener todas las canciones    |
| GET    | `/api/canciones/{id}` | Obtener una canción específica |
| POST   | `/api/canciones`      | Crear una nueva canción        |
| PUT    | `/api/canciones/{id}` | Actualizar una canción         |
| DELETE | `/api/canciones/{id}` | Eliminar una canción           |

### Ejemplo: crear una banda

Solicitud:

```http
POST /api/bandas
```

Cuerpo:

```json
{
  "nombre": "Metallica",
  "genero": "Heavy Metal",
  "descripcion": "Banda estadounidense de heavy metal."
}
```

### Ejemplo: crear una canción

Solicitud:

```http
POST /api/canciones
```

Cuerpo:

```json
{
  "titulo": "Enter Sandman",
  "duracion": "5:31",
  "album": "Metallica",
  "banda_id": 13
}
```

## 🧪 Pruebas realizadas

Durante el desarrollo se realizaron pruebas de los principales endpoints de la API mediante la documentación interactiva de FastAPI (Swagger).

Se verificaron:

* Creación de bandas.
* Consulta de bandas.
* Actualización de bandas.
* Eliminación de bandas.
* Creación de canciones.
* Consulta de canciones.
* Actualización de canciones.
* Eliminación de canciones.
* Consulta de canciones asociadas a una banda.
* Validación de identificadores inexistentes.
* Validación de relaciones entre bandas y canciones.
* Restricción de eliminación de bandas con canciones asociadas.

## 📁 Estructura del proyecto

```text
music_manager/
├── backend/
│   ├── main.py
│   ├── .env
│   ├── config/
│   │   └── database.py
│   ├── requirements.txt
│   ├── .gitignore
│   └── venv/
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

> Nota: `.env` y `venv/` son elementos utilizados localmente y no deben ser incluidos en el repositorio público.

## ☁️ Despliegue en la nube

Esta sección se completará durante la fase de despliegue del proyecto.

El objetivo es desplegar:

* Base de datos PostgreSQL.
* API REST.
* Aplicación frontend.
* Servicios de infraestructura necesarios.

### Proveedor cloud

* **Backend & API:** Render Cloud
* **Base de datos:** Neon Cloud (PostgreSQL 16)
* **Frontend:** GitHub Pages
* **DevOps / CI-CD:** GitHub Actions

### URL del backend

* [https://music-manager-api-ydwi.onrender.com/api](https://music-manager-api-ydwi.onrender.com/api)
* Documentación Swagger: [https://music-manager-api-ydwi.onrender.com/docs](https://music-manager-api-ydwi.onrender.com/docs)

### URL del frontend

* [https://joandestructor777.github.io/music_manager/](https://joandestructor777.github.io/music_manager/)

## 📚 Documentación

La documentación completa del proyecto incluirá:

* Documentación de la API REST.
* Modelo entidad-relación.
* Arquitectura de la aplicación.
* Guía de instalación.
* Guía de despliegue.
* Evidencias de funcionamiento.
* Capturas de pantalla.
* Video de sustentación.

## 👨‍💻 Autor

**Fernando Pérez**

Proyecto académico — Ingeniería en Sistemas
Fundación Universitaria Los Libertadores

## 📄 Licencia

Proyecto desarrollado con fines académicos.
