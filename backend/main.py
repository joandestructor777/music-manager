from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from config.database import conectar_db
import os


app = FastAPI(
    title="Music Manager API",
    description="API REST para gestionar bandas y canciones",
    version="1.0.0"
)


# =========================
# CONFIGURACIÓN CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


router = APIRouter(prefix="/api")


# =========================
# MODELOS
# =========================

class Banda(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    genero: str = Field(min_length=1, max_length=100)
    descripcion: str = Field(min_length=1, max_length=500)


class BandaActualizar(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    genero: str = Field(min_length=1, max_length=100)
    descripcion: str = Field(min_length=1, max_length=500)


class Cancion(BaseModel):
    titulo: str = Field(min_length=1, max_length=150)
    duracion: str = Field(min_length=1, max_length=10)
    album: str = Field(min_length=1, max_length=150)
    banda_id: int


class Integrante(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    rol: str = Field(min_length=1, max_length=100)
    anio_ingreso: int | None = None
    banda_id: int


class IntegranteActualizar(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    rol: str = Field(min_length=1, max_length=100)
    anio_ingreso: int | None = None
    banda_id: int


# =========================
# INICIO
# =========================

@app.on_event("startup")
def inicializar_bd():
    try:
        conexion = conectar_db()
        cursor = conexion.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bandas (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                genero VARCHAR(50) NOT NULL,
                descripcion TEXT
            );
            CREATE TABLE IF NOT EXISTS canciones (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(150) NOT NULL,
                duracion VARCHAR(10),
                album VARCHAR(100),
                banda_id INTEGER NOT NULL REFERENCES bandas(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS integrantes (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                rol VARCHAR(100) NOT NULL,
                anio_ingreso INTEGER,
                banda_id INTEGER NOT NULL REFERENCES bandas(id) ON DELETE CASCADE
            );
        """)
        conexion.commit()
        cursor.execute("SELECT COUNT(*) FROM bandas;")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO bandas (nombre, genero, descripcion) VALUES
                ('Arctic Monkeys', 'Indie Rock', 'Banda británica de indie rock formada en Sheffield.'),
                ('Tame Impala', 'Psychedelic Rock', 'Proyecto musical australiano liderado por Kevin Parker.'),
                ('Pink Floyd', 'Rock Progresivo', 'Banda británica reconocida por su rock progresivo.');
            """)
            conexion.commit()
        cursor.close()
        conexion.close()
    except Exception as e:
        print("Aviso al inicializar base de datos:", e)



@app.get("/")
def inicio():
    directorio_frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
    index_path = os.path.join(directorio_frontend, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "mensaje": "¡Music Manager está funcionando!"
    }


# =========================
# BANDAS
# =========================

# GET - Obtener todas las bandas
@router.get("/bandas")
def obtener_bandas():

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, nombre, genero, descripcion
        FROM bandas
        ORDER BY id;
    """)

    bandas = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for banda in bandas:
        resultado.append({
            "id": banda[0],
            "nombre": banda[1],
            "genero": banda[2],
            "descripcion": banda[3]
        })

    return resultado


# POST - Crear una banda
@router.post("/bandas")
def crear_banda(banda: Banda):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO bandas (
            nombre,
            genero,
            descripcion
        )
        VALUES (%s, %s, %s)
        RETURNING id, nombre, genero, descripcion;
    """, (
        banda.nombre,
        banda.genero,
        banda.descripcion
    ))

    nueva_banda = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "id": nueva_banda[0],
        "nombre": nueva_banda[1],
        "genero": nueva_banda[2],
        "descripcion": nueva_banda[3]
    }


# GET - Obtener una banda por ID
@router.get("/bandas/{banda_id}")
def obtener_banda(banda_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, nombre, genero, descripcion
        FROM bandas
        WHERE id = %s;
    """, (banda_id,))

    banda = cursor.fetchone()

    cursor.close()
    conexion.close()

    if banda is None:
        raise HTTPException(
            status_code=404,
            detail="Banda no encontrada"
        )

    return {
        "id": banda[0],
        "nombre": banda[1],
        "genero": banda[2],
        "descripcion": banda[3]
    }


# PUT - Actualizar una banda
@router.put("/bandas/{banda_id}")
def actualizar_banda(
    banda_id: int,
    banda: BandaActualizar
):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE bandas
        SET nombre = %s,
            genero = %s,
            descripcion = %s
        WHERE id = %s
        RETURNING id, nombre, genero, descripcion;
    """, (
        banda.nombre,
        banda.genero,
        banda.descripcion,
        banda_id
    ))

    banda_actualizada = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    if banda_actualizada is None:
        raise HTTPException(
            status_code=404,
            detail="Banda no encontrada"
        )

    return {
        "id": banda_actualizada[0],
        "nombre": banda_actualizada[1],
        "genero": banda_actualizada[2],
        "descripcion": banda_actualizada[3]
    }


# DELETE - Eliminar una banda
@router.delete("/bandas/{banda_id}")
def eliminar_banda(banda_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    # Verificar que la banda exista
    cursor.execute("""
        SELECT id
        FROM bandas
        WHERE id = %s;
    """, (banda_id,))

    banda = cursor.fetchone()

    if banda is None:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=404,
            detail="Banda no encontrada"
        )

    # Verificar si tiene canciones asociadas
    cursor.execute("""
        SELECT COUNT(*)
        FROM canciones
        WHERE banda_id = %s;
    """, (banda_id,))

    cantidad_canciones = cursor.fetchone()[0]

    if cantidad_canciones > 0:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=409,
            detail="No se puede eliminar la banda porque tiene canciones asociadas"
        )

    # Eliminar banda
    cursor.execute("""
        DELETE FROM bandas
        WHERE id = %s
        RETURNING id;
    """, (banda_id,))

    banda_eliminada = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Banda eliminada correctamente",
        "id": banda_eliminada[0]
    }


# =========================
# CANCIONES
# =========================

# GET - Obtener todas las canciones
@router.get("/canciones")
def obtener_canciones():

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, titulo, duracion, album, banda_id
        FROM canciones
        ORDER BY id;
    """)

    canciones = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for cancion in canciones:
        resultado.append({
            "id": cancion[0],
            "titulo": cancion[1],
            "duracion": cancion[2],
            "album": cancion[3],
            "banda_id": cancion[4]
        })

    return resultado


# GET - Obtener una canción por ID
@router.get("/canciones/{cancion_id}")
def obtener_cancion(cancion_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, titulo, duracion, album, banda_id
        FROM canciones
        WHERE id = %s;
    """, (cancion_id,))

    cancion = cursor.fetchone()

    cursor.close()
    conexion.close()

    if cancion is None:
        raise HTTPException(
            status_code=404,
            detail="Canción no encontrada"
        )

    return {
        "id": cancion[0],
        "titulo": cancion[1],
        "duracion": cancion[2],
        "album": cancion[3],
        "banda_id": cancion[4]
    }


# POST - Crear una canción
@router.post("/canciones")
def crear_cancion(cancion: Cancion):

    conexion = conectar_db()
    cursor = conexion.cursor()

    # Verificar que la banda exista
    cursor.execute("""
        SELECT id
        FROM bandas
        WHERE id = %s;
    """, (cancion.banda_id,))

    banda = cursor.fetchone()

    if banda is None:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=404,
            detail="La banda indicada no existe"
        )

    cursor.execute("""
        INSERT INTO canciones (
            titulo,
            duracion,
            album,
            banda_id
        )
        VALUES (%s, %s, %s, %s)
        RETURNING id, titulo, duracion, album, banda_id;
    """, (
        cancion.titulo,
        cancion.duracion,
        cancion.album,
        cancion.banda_id
    ))

    nueva_cancion = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "id": nueva_cancion[0],
        "titulo": nueva_cancion[1],
        "duracion": nueva_cancion[2],
        "album": nueva_cancion[3],
        "banda_id": nueva_cancion[4]
    }


# PUT - Actualizar una canción
@router.put("/canciones/{cancion_id}")
def actualizar_cancion(
    cancion_id: int,
    cancion: Cancion
):

    conexion = conectar_db()
    cursor = conexion.cursor()

    # Verificar que la banda exista
    cursor.execute("""
        SELECT id
        FROM bandas
        WHERE id = %s;
    """, (cancion.banda_id,))

    banda = cursor.fetchone()

    if banda is None:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=404,
            detail="La banda indicada no existe"
        )

    cursor.execute("""
        UPDATE canciones
        SET titulo = %s,
            duracion = %s,
            album = %s,
            banda_id = %s
        WHERE id = %s
        RETURNING id, titulo, duracion, album, banda_id;
    """, (
        cancion.titulo,
        cancion.duracion,
        cancion.album,
        cancion.banda_id,
        cancion_id
    ))

    cancion_actualizada = cursor.fetchone()

    conexion.commit()

    cursor.close()
    conexion.close()

    if cancion_actualizada is None:
        raise HTTPException(
            status_code=404,
            detail="Canción no encontrada"
        )

    return {
        "id": cancion_actualizada[0],
        "titulo": cancion_actualizada[1],
        "duracion": cancion_actualizada[2],
        "album": cancion_actualizada[3],
        "banda_id": cancion_actualizada[4]
    }


# DELETE - Eliminar una canción
@router.delete("/canciones/{cancion_id}")
def eliminar_cancion(cancion_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        DELETE FROM canciones
        WHERE id = %s
        RETURNING id;
    """, (cancion_id,))

    cancion_eliminada = cursor.fetchone()

    if cancion_eliminada is None:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=404,
            detail="Canción no encontrada"
        )

    conexion.commit()

    cursor.close()
    conexion.close()

    return {
        "mensaje": "Canción eliminada correctamente",
        "id": cancion_eliminada[0]
    }


# =========================
# RELACIÓN BANDAS - CANCIONES
# =========================

@router.get("/bandas/{banda_id}/canciones")
def obtener_canciones_por_banda(banda_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    # Verificar que la banda exista
    cursor.execute("""
        SELECT id
        FROM bandas
        WHERE id = %s;
    """, (banda_id,))

    banda = cursor.fetchone()

    if banda is None:
        cursor.close()
        conexion.close()

        raise HTTPException(
            status_code=404,
            detail="Banda no encontrada"
        )

    cursor.execute("""
        SELECT canciones.id,
               canciones.titulo,
               canciones.duracion,
               canciones.album,
               bandas.nombre
        FROM canciones
        INNER JOIN bandas
        ON canciones.banda_id = bandas.id
        WHERE bandas.id = %s
        ORDER BY canciones.id;
    """, (banda_id,))

    canciones = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for cancion in canciones:
        resultado.append({
            "id": cancion[0],
            "titulo": cancion[1],
            "duracion": cancion[2],
            "album": cancion[3],
            "banda": cancion[4]
        })

    return resultado


# =========================
# INTEGRANTES
# =========================

# GET - Obtener todos los integrantes
@router.get("/integrantes")
def obtener_integrantes():

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, nombre, rol, anio_ingreso, banda_id
        FROM integrantes
        ORDER BY id;
    """)

    integrantes = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for integrante in integrantes:
        resultado.append({
            "id": integrante[0],
            "nombre": integrante[1],
            "rol": integrante[2],
            "anio_ingreso": integrante[3],
            "banda_id": integrante[4]
        })

    return resultado


# GET - Obtener un integrante por ID
@router.get("/integrantes/{integrante_id}")
def obtener_integrante(integrante_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id, nombre, rol, anio_ingreso, banda_id
        FROM integrantes
        WHERE id = %s;
    """, (integrante_id,))

    integrante = cursor.fetchone()

    cursor.close()
    conexion.close()

    if integrante is None:
        raise HTTPException(
            status_code=404,
            detail="Integrante no encontrado"
        )

    return {
        "id": integrante[0],
        "nombre": integrante[1],
        "rol": integrante[2],
        "anio_ingreso": integrante[3],
        "banda_id": integrante[4]
    }


# POST - Crear un integrante
@router.post("/integrantes")
def crear_integrante(integrante: Integrante):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id FROM bandas WHERE id = %s;
    """, (integrante.banda_id,))

    if cursor.fetchone() is None:
        cursor.close()
        conexion.close()
        raise HTTPException(
            status_code=404,
            detail="La banda indicada no existe"
        )

    cursor.execute("""
        INSERT INTO integrantes (nombre, rol, anio_ingreso, banda_id)
        VALUES (%s, %s, %s, %s)
        RETURNING id, nombre, rol, anio_ingreso, banda_id;
    """, (
        integrante.nombre,
        integrante.rol,
        integrante.anio_ingreso,
        integrante.banda_id
    ))

    nuevo = cursor.fetchone()

    conexion.commit()
    cursor.close()
    conexion.close()

    return {
        "id": nuevo[0],
        "nombre": nuevo[1],
        "rol": nuevo[2],
        "anio_ingreso": nuevo[3],
        "banda_id": nuevo[4]
    }


# PUT - Actualizar un integrante
@router.put("/integrantes/{integrante_id}")
def actualizar_integrante(integrante_id: int, integrante: IntegranteActualizar):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id FROM bandas WHERE id = %s;
    """, (integrante.banda_id,))

    if cursor.fetchone() is None:
        cursor.close()
        conexion.close()
        raise HTTPException(
            status_code=404,
            detail="La banda indicada no existe"
        )

    cursor.execute("""
        UPDATE integrantes
        SET nombre = %s,
            rol = %s,
            anio_ingreso = %s,
            banda_id = %s
        WHERE id = %s
        RETURNING id, nombre, rol, anio_ingreso, banda_id;
    """, (
        integrante.nombre,
        integrante.rol,
        integrante.anio_ingreso,
        integrante.banda_id,
        integrante_id
    ))

    actualizado = cursor.fetchone()

    conexion.commit()
    cursor.close()
    conexion.close()

    if actualizado is None:
        raise HTTPException(
            status_code=404,
            detail="Integrante no encontrado"
        )

    return {
        "id": actualizado[0],
        "nombre": actualizado[1],
        "rol": actualizado[2],
        "anio_ingreso": actualizado[3],
        "banda_id": actualizado[4]
    }


# DELETE - Eliminar un integrante
@router.delete("/integrantes/{integrante_id}")
def eliminar_integrante(integrante_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        DELETE FROM integrantes
        WHERE id = %s
        RETURNING id;
    """, (integrante_id,))

    eliminado = cursor.fetchone()

    if eliminado is None:
        cursor.close()
        conexion.close()
        raise HTTPException(
            status_code=404,
            detail="Integrante no encontrado"
        )

    conexion.commit()
    cursor.close()
    conexion.close()

    return {
        "mensaje": "Integrante eliminado correctamente",
        "id": eliminado[0]
    }


# GET - Obtener integrantes de una banda
@router.get("/bandas/{banda_id}/integrantes")
def obtener_integrantes_por_banda(banda_id: int):

    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id FROM bandas WHERE id = %s;
    """, (banda_id,))

    if cursor.fetchone() is None:
        cursor.close()
        conexion.close()
        raise HTTPException(
            status_code=404,
            detail="Banda no encontrada"
        )

    cursor.execute("""
        SELECT i.id, i.nombre, i.rol, i.anio_ingreso, b.nombre
        FROM integrantes i
        INNER JOIN bandas b ON i.banda_id = b.id
        WHERE b.id = %s
        ORDER BY i.id;
    """, (banda_id,))

    integrantes = cursor.fetchall()

    cursor.close()
    conexion.close()

    resultado = []

    for integrante in integrantes:
        resultado.append({
            "id": integrante[0],
            "nombre": integrante[1],
            "rol": integrante[2],
            "anio_ingreso": integrante[3],
            "banda": integrante[4]
        })

    return resultado


app.include_router(router)


import os
from fastapi.staticfiles import StaticFiles

directorio_frontend = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(directorio_frontend):
    app.mount("/", StaticFiles(directory=directorio_frontend, html=True), name="frontend")
