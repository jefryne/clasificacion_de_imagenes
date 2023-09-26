from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import crear_registro, leer_registros,top_clasificados
from pydantic import BaseModel
import uvicorn


app = FastAPI()

class Registro(BaseModel):
    nombre_usuario: str
    correo: str
    telefono: str

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
def index(registro_js: Registro):

    response = crear_registro(registro_js.nombre_usuario,registro_js.telefono,registro_js.correo)
    if response != None:
        return {"registros": "exitoso"}
    else:
        return {"Error":"Ocurrio un error en la base de datos"}


@app.get("/usuarios")
def usuarios():
    registros = leer_registros()
    if registros != None:
        return {"registros": registros}
    else:
        return {"Error":"Ocurrio un error en la base de datos"}

@app.get("/top-clasificados")
def clasificados():
    analisis = top_clasificados()
    if analisis != None:
        return { "clasificados": analisis}
    else:
        return {"Error":"Ocurrio un error en la base de datos"}


