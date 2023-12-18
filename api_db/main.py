from fastapi import FastAPI
from typing import List
import psycopg2
import json
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException





app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las origenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',  
        dbname='bd_gas_nar',  
        user='postgres',  
        password='1234'  # Reemplaza con tu contraseña
    )
    return conn

@app.get("/datos")
async def read_datos():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT "municipio" FROM gas_domicilario_nar')
                datos_brutos = cursor.fetchall()
                # Extrae los nombres de los municipios de la lista de tuplas
                nombres_municipios = [municipio[0] for municipio in datos_brutos]
                # Cuenta la frecuencia de cada municipio
                conteo_municipios = Counter(nombres_municipios)
                return conteo_municipios
    except psycopg2.Error as e:
        print("Ocurrió un error al conectarse a la base de datos:", e)
        return {"error": "No se pudo obtener los datos"}

@app.get("/estadisticas")
async def read_estadisticas():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Consulta para el número total de registros
                cursor.execute('SELECT COUNT(*) FROM gas_domicilario_nar')
                total_registros = cursor.fetchone()[0]

                # Consulta para el número de municipios únicos
                cursor.execute('SELECT COUNT(DISTINCT "municipio") FROM gas_domicilario_nar')
                numero_municipios = cursor.fetchone()[0]

                # Devuelve ambos resultados en un solo objeto JSON
                return {
                    "total_registros": total_registros,
                    "numero_municipios": numero_municipios
                }
    except psycopg2.Error as e:
        print("Ocurrió un error al conectarse a la base de datos:", e)
        return {"error": "No se pudo obtener las estadísticas"}



@app.get("/calificaciones")
async def read_calificaciones():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT "calificacion_servicio_gas", COUNT(*)
                FROM gas_domicilario_nar
                WHERE "calificacion_servicio_gas" > 0
                GROUP BY "calificacion_servicio_gas"
                """)
                resultados = cursor.fetchall()
                
                # Mapear los números a nombres
                nombres_calificaciones = {4: "excelente", 3: "bueno", 2: "regular", 1: "malo"}
                calificaciones = {nombres_calificaciones.get(calificacion[0], "desconocido"): calificacion[1] for calificacion in resultados}

                return calificaciones
    except psycopg2.Error as e:
        print("Ocurrió un error al conectarse a la base de datos:", e)
        return {"error": "No se pudo obtener las calificaciones"}
    
@app.get("/ahorro_gas")
async def read_ahorro_gas():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT "gasdo_ahorro_cilindros" FROM gas_domicilario_nar WHERE "gasdo_ahorro_cilindros" >= 0')
                datos_brutos = cursor.fetchall()
                # Transforma 1 en 'Sí' y 0 en 'No'
                conteo_ahorro = Counter(["Sí" if dato[0] == 1 else "No" for dato in datos_brutos])
                return conteo_ahorro
    except psycopg2.Error as e:
        print("Error al conectar a la BD:", e)
        return {"error": "No se pudieron obtener datos de ahorro"}

@app.get("/conformidad_instalacion")
async def read_conformidad_instalacion():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT "instalacion_conformidad_contra" FROM gas_domicilario_nar WHERE "instalacion_conformidad_contra" >= 0')
                datos_brutos = cursor.fetchall()
                # Transforma 1 en 'Conforme' y 0 en 'No conforme'
                conteo_conformidad = Counter(["Conforme" if dato[0] == 1 else "No conforme" for dato in datos_brutos])
                return conteo_conformidad
    except psycopg2.Error as e:
        print("Error al conectar a la BD:", e)
        return {"error": "No se pudieron obtener datos de conformidad"}

@app.get("/resumen_ahorro_conformidad")
async def read_resumen_ahorro_conformidad():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Obtener datos de ahorro
                cursor.execute('SELECT "gasdo_ahorro_cilindros" FROM gas_domicilario_nar WHERE "gasdo_ahorro_cilindros" > -2')
                datos_ahorro = cursor.fetchall()
                conteo_ahorro = Counter([dato[0] for dato in datos_ahorro])

                # Obtener datos de conformidad
                cursor.execute('SELECT "instalacion_conformidad_contra" FROM gas_domicilario_nar WHERE "instalacion_conformidad_contra" > -2')
                datos_conformidad = cursor.fetchall()
                conteo_conformidad = Counter([dato[0] for dato in datos_conformidad])

                # Preparar la respuesta
                respuesta = {
                    "ahorro": {"Sí": conteo_ahorro.get(1, 0), "No": conteo_ahorro.get(0, 0)},
                    "conformidad": {"Conforme": conteo_conformidad.get(1, 0), "No Conforme": conteo_conformidad.get(0, 0)}
                }

                return respuesta
    except psycopg2.Error as e:
        print("Ocurrió un error al conectarse a la base de datos:", e)
        return {"error": "No se pudieron obtener los datos"}

@app.post("/crear_registro")
async def crear_registro(nombre: str, telefono_1: str, telefono_2: str, municipio: str, instalacion_conformidad_contra: int, calificacion_servicio_gas: int, gasdo_ahorro_cilindros: int, estado: str, observacion: str, mail: str):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                INSERT INTO gas_domicilario_nar (nombre, telefono_1, telefono_2, municipio, instalacion_conformidad_contra, calificacion_servicio_gas, gasdo_ahorro_cilindros, estado, observacion, mail)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (nombre, telefono_1, telefono_2, municipio, instalacion_conformidad_contra, calificacion_servicio_gas, gasdo_ahorro_cilindros, estado, observacion, mail))
                conn.commit()
        return {"mensaje": "Registro creado con éxito"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar registro: {e}")

    
@app.put("/actualizar_registro/{id_registro}")
async def actualizar_registro(id_registro: int, nombre: str, telefono_1: str, telefono_2: str, municipio: str, instalacion_conformidad_contra: int, calificacion_servicio_gas: int, gasdo_ahorro_cilindros: int, estado: str, observacion: str, mail: str):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                UPDATE gas_domicilario_nar
                SET nombre = %s, telefono_1 = %s, telefono_2 = %s, municipio = %s, instalacion_conformidad_contra = %s, calificacion_servicio_gas = %s, gasdo_ahorro_cilindros = %s, estado = %s, observacion = %s, mail = %s
                WHERE Id = %s
                """, (nombre, telefono_1, telefono_2, municipio, instalacion_conformidad_contra, calificacion_servicio_gas, gasdo_ahorro_cilindros, estado, observacion, mail, id_registro))
                conn.commit()
        return {"mensaje": "Registro actualizado con éxito"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar registro: {e}")

@app.delete("/eliminar_registro/{id_registro}")
async def eliminar_registro(id_registro: int):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM gas_domicilario_nar WHERE Id = %s", (id_registro,))
                conn.commit()
        return {"mensaje": "Registro eliminado con éxito"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar registro: {e}")


