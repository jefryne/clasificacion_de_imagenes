from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import crear_registro, leer_registros,top_clasificados
from pydantic import BaseModel
from db import aumentar_columna_select,eliminar_registro,consultar_accion
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


@app.get("/aumetar-categoria/{categoria}")
def aumentar_columna(categoria: str):
    aumentar_columna_select(categoria)
    return {"actualizado": "exitoxamente"}

@app.get("/eliminar-usuario/{id}")
def eliminar_columna(id: int):
    result = eliminar_registro(id)
    if(result != None):
        return {"eliminado": "exitoxamente"}
    else:
        return {"error": "error"}




@app.get("/consulta-registros/{valor}/{accion}")
def consultar_columna(valor: int, accion: str):
    repuesta = consultar_accion(valor,accion)
    if(repuesta != None):
        return repuesta
    else:
        return {"error": "no se devolvio ningun valor"}
    


# if __name__ == '__main__':
#     uvicorn.run('main:app', host='0.0.0.0', port=8000)
