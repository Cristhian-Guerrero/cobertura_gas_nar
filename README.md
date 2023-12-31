<img src="https://i.postimg.cc/fTbkxyVQ/Esquema-proyecto-gas-Narrr.jpg" >

# Proyecto Dashboard Estadístico

## Descripción
Este proyecto es una plataforma web que muestra un dashboard con datos estadísticos. La información se actualiza en tiempo real a través de una API desarrollada en FastAPI y consume datos de una base de datos PostgreSQL.

## Características
- **Dashboard Dinámico:** Visualiza datos estadísticos en un formato interactivo y fácil de entender.
- **API en FastAPI:** Backend rápido y eficiente para manejar las solicitudes de datos.
- **Base de Datos PostgreSQL:** Almacenamiento seguro y escalable para grandes volúmenes de datos.

## Tecnologías Utilizadas
- Frontend: Vite + React
- Backend: FastAPI
- Base de Datos: PostgreSQL

## Dockerización del Proyecto
El proyecto cuenta con un `Dockerfile` para facilitar su despliegue usando Docker. Sigue estos pasos para dockerizar el proyecto:
1. Construir la imagen Docker: `docker build -t nombre-de-tu-imagen .`
2. Ejecutar el contenedor: `docker run -p 8000:8000 nombre-de-tu-imagen`
3. Asegúrate de configurar las variables de entorno necesarias para la conexión a la base de datos en el contenedor.


## Instalación y Uso
Para poner en marcha el proyecto, sigue estos pasos:
1. Clonar el repositorio: `git clone [URL del repositorio]`.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Revisar y configurar las conexiones de la base de datos (actualmente configuradas para un entorno local).
4. Iniciar el servidor de FastAPI: `uvicorn main:app --reload`.
5. Abrir el dashboard en el navegador.
6. En caso de problemas con los `requirements` o las conexiones, revisar la documentación adicional proporcionada.

## Plan de Respaldo
Para garantizar la continuidad del proyecto, se incluye una versión de la base de datos en formato CSV. Esto permite importar los datos fácilmente en caso de necesidad. Las instrucciones para la importación de estos datos se encuentran en la sección correspondiente.

---
> CG
