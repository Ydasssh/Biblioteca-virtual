import mysql.connector

def connectionBD(): 
    miConexion = mysql.connector.connect(
        host='sql10.freesqldatabase.com',
        user='sql10639823',
        passwd='V3IbVxEfT1',
        db='sql10639823'
        )

    if miConexion:
        print("Conexion exitosa")
    else:
        print("Error en la conexion")
    return miConexion
