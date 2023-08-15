import mysql.connector

def connectionBD(): 
    miConexion = mysql.connector.connect(
        host='localhost',
        user='root',
        passwd='',
        db='sistema_biblioteca'
        )

    if miConexion:
        print("Conexion exitosa")
    else:
        print("Error en la conexion")
    return miConexion
