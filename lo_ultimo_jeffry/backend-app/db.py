import mysql.connector

# Conectar a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="senasoft"
)

cursor = db.cursor()


def crear_registro(nombre_usuario,telefono,correo):
    respuesta = False
    try:
        query = "INSERT INTO usuarios (nombre,correo,telefono) VALUES (%s, %s, %s)"
        values = (nombre_usuario,correo,telefono)
        cursor.execute(query,values)
        db.commit()
        respuesta = True
        return respuesta
    except:
        return respuesta

def leer_registros():
    try:
        query = "SELECT * FROM usuarios"
        cursor.execute(query)
        resultados = cursor.fetchall()
        return resultados
        
    except:
        return None



def actualizar_registro(id,nombre_usuario,correo,telefono):
    respuesta = False
    try:
        query = "UPDATE usuarios SET nombre = %s,correo = %s,telefono = %s WHERE id_usuario = %s"
        values = (id,nombre_usuario,correo,telefono)
        cursor.execute(query, values)
        db.commit()
        respuesta = True
        return respuesta
    except:
        return respuesta


def eliminar_registro(id):
    respuesta = False
    try:
        query = "DELETE FROM usuarios WHERE id_usuario = %s"
        values = (id,)
        cursor.execute(query, values)
        db.commit()
        respuesta = True
        return respuesta
    except:
        return respuesta


def top_clasificados():
    try:
        query = "SELECT categoria, num_analisis FROM clasificados ORDER BY num_analisis DESC LIMIT 3"
        cursor.execute(query)
        resultados = cursor.fetchall()
        return resultados
    except:
        return None
    
def aumentar_columna_insert(numero_actual,categoria):
    numero_incrementado = numero_actual +1
    try:
        query = "UPDATE clasificados SET num_analisis = %s WHERE categoria = %s LIMIT 1"
        values = (numero_incrementado,categoria)
        cursor.execute(query,values)
        db.commit()
        return True
    except:     
        return None

def aumentar_columna_select(categoria):
    try:
        query = "SELECT num_analisis FROM clasificados WHERE categoria = %s LIMIT 1"
        values = (categoria,)
        cursor.execute(query,values)
        resultado = cursor.fetchone()
        print(resultado)
        aumentar_columna_insert(resultado[0],categoria)
    except:
        return None 
