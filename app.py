from flask import Flask, jsonify, json
from config import config
from flask import render_template, request, redirect, session, url_for
from flask import flash, send_from_directory
from configDB import *
import os
from datetime import datetime


app = Flask(__name__)
app.secret_key = 'sss'

@app.route('/')
def inicioUsers():

    conexion=connectionBD()
    cursor=conexion.cursor()
    cursor.execute("SELECT * FROM `libros`")
    listaLibros=cursor.fetchall()
    conexion.commit()

    print("---------------------LIBROS INICIO-------------------")
    libros = listaLibros
    # print(libros[0])

    return render_template('sitio/index.html', libros=libros)



@app.route('/register', methods=['GET', 'POST'])
def registrarform():
    if request.method == 'POST':
        __user = request.form['Username']
        __email = request.form['Email']
        __password = request.form['Password']
        __id_rol = 2

        conexion_DB = connectionBD()
        cursor = conexion_DB.cursor(dictionary=True)

        try:
            # Verificar si el nombre de usuario o el correo electrónico ya existen
            sql = "SELECT * FROM usuarios WHERE nombre_usuario = %s OR correo = %s"
            cursor.execute(sql, (__user, __email))
            accounts = cursor.fetchall()
            # print("cursor: ", cursor.statement)
            # print("account: ", accounts)



            for account in accounts:
                if account['nombre_usuario'] == __user:
                    flash("El nombre de usuario ya está en uso","error")
                    return redirect(url_for('registrarform'))
                elif account['correo'] == __email:
                    flash("Correo ya registrado","error")
                    return redirect(url_for('registrarform'))

            # Insertar nuevo usuario en la base de datos
            sql = "INSERT INTO usuarios (nombre_usuario, correo, contraseña, id_rol) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (__user, __email, __password, __id_rol))
            conexion_DB.commit()

            flash("Registrado con éxito","success")
            return redirect(url_for('registrarform'))

        except mysql.connector.Error as e:
            error_message = "Error al insertar en la base de datos: " + str(e)
            return error_message

        finally:
            cursor.close()
            conexion_DB.close()

    else:
        # print("Entra else metodo post ")

        return render_template('auth/login.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        __correo = request.form['Email']
        __contraseña = request.form['Password']
        

        conexion_DB = connectionBD()
        cursor = conexion_DB.cursor(dictionary=True)

        sql = "SELECT * FROM usuarios WHERE correo= %s AND contraseña = %s"
        valores = (__correo, __contraseña)


        try:
            account = None
            cursor.execute(sql, valores)
            account = cursor.fetchone()

            if account:
                id_rol = account['id_rol']
                if id_rol == 1:
                    print("id rol:", id_rol)
                    session['rol'] = 1
                    return redirect(url_for('inicioAdmin'))
                elif id_rol == 2:
                    print("id rol:", id_rol)
                    session['rol'] = 2
                    return redirect(url_for('inicioUsers'))
            else:
                return render_template("auth/login.html",error=True)

            conexion_DB.commit()

        except mysql.connector.Error as error:
            # Manejo del error y mensaje de error al usuario
            print("Error al ejecutar la consulta:", error)
            conexion_DB.rollback()
            return render_template("auth/login.html", msg="Error en la base de datos: " + str(error))

        finally:
            cursor.close()
            conexion_DB.close()

    else:
        return render_template("auth/login.html")


@app.route('/admin')
def inicioAdmin():
    if 'rol' in session:
        if 'rol' in session and session['rol'] == 1:
            return render_template('admin/index.html', page_title="Dashboard")
        else:
            return render_template('auth/Error403.html')
    else:
        return render_template('auth/Error403.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/usuarios')
def adminUsuarios():
    if 'rol' in session:
        if 'rol' in session and session['rol'] == 1:
            print('rol: ',session['rol'])

            conexion_DB = connectionBD()
            cursor = conexion_DB.cursor(dictionary=True)
            # print("---------------------------------SELECCION USUARIOS ------------------------------------")
            cursor.execute("SELECT * FROM `usuarios`")
            usuarios=cursor.fetchall()
            conexion_DB.commit()
            # print(usuarios)

            return render_template('admin/usuarios.html',usuarios=usuarios, page_title="Usuarios")
        else:
            return render_template('auth/Error403.html')
    else:
        return render_template('auth/Error403.html')
    

@app.route('/usuarios/borrar', methods=['POST'])
def borrar_usuario():

    if not 'rol' in session:
        return render_template('auth/Error403.html')
    
    if request.method == 'POST' and session['rol'] == 1: 

        __data = request.get_json()
        __id = __data.get('id')


        conexion_DB = connectionBD()
        cursor=conexion_DB.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id=%s",(__id,))
        conexion_DB.commit()

        return jsonify({'success':'Se ha eliminado el usuario'})

    return redirect(url_for('adminUsuarios'))
    

@app.route('/formulario')
def mostrar_formulario():
    __formulario_html = render_template('auth/formulario.html')
    return jsonify({'formulario_html': __formulario_html})

@app.route('/formularioLibros')
def mostrar_formularioLibros():
    __formulario_html = render_template('auth/formularioLibros.html')
    return jsonify({'formulario_html': __formulario_html})

@app.route('/formEdit')
def formulario_editar():
    __formularioE_html = render_template('auth/formularioEdit.html')
    return jsonify({'formularioEdit_html': __formularioE_html})

@app.route('/formEditLibro')
def formulario_editar_libros():
    __formularioE_html = render_template('auth/formularioEditLibros.html')
    return jsonify({'formularioEditLibros_html': __formularioE_html})

    
@app.route('/usuarios/nuevo', methods=['POST'])
def crear_usuario():
    # print("FUNCION NUEVO USUARIO PYTHON")
    if request.method == 'POST':
        __data = request.get_json()
        __user = __data.get('user')
        __email = __data.get('email')
        __pass = __data.get('pass')
        __id_rol = __data.get('miCB')


        # print("--------------------------------DATOS DE JS---------------------------")
        # print("JSON: ",__data)
        # print("User: ", __user)
        # print("email: ", __email)
        # print("password: ", __pass)

        if not __user:
               return jsonify({'error': 'El nombre de usuario es obligatorio'}), 400
        if not __email:
            return jsonify({'error': 'El correo electrónico es obligatorio'}), 400
        if '@' not in __email or '.com' not in __email:
            return jsonify({'error': 'El correo electrónico no es válido'}), 400
        else:
            

            if(__id_rol == 'Admin'):
                __id_rol = 1
            else:
                __id_rol = 2

            # print("rol: ", __id_rol)


            conexion_DB = connectionBD()
            cursor = conexion_DB.cursor(dictionary=True)

            try:
                # Verificar si el nombre de usuario o el    correo electrónico ya existen
                sql = "SELECT * FROM usuarios WHERE nombre_usuario = %s OR correo = %s"
                cursor.execute(sql, (__user, __email))
                accounts = cursor.fetchall()
                # print("cursor: ", cursor.statement)
                # print("account: ", accounts)


                for account in accounts:
                    if account['nombre_usuario'] == __user:
                        error_data = {'error': 'El nombre de usuario ya está en uso'}
                        return jsonify(error_data), 400
                    elif account['correo'] == __email:
                        data = {'error': 'Correo ya registrado","error' }
                        return jsonify(data), 400

                # Insertar nuevo usuario en la base de datos
                sql = "INSERT INTO usuarios (nombre_usuario, correo, contraseña, id_rol) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (__user, __email, __pass,   __id_rol))
                conexion_DB.commit()

                return jsonify({'success': 'Registro exitoso'})

            except mysql.connector.Error as e:
                error_message = "Error al insertar en la base de datos: " + str(e)
                return error_message

            finally:
                cursor.close()
                conexion_DB.close()
    else:
        return jsonify({'error': 'Error de request'})


@app.route('/usuarios/<int:user_id>', methods=['GET'])
def obtener_usuario_por_id(user_id):

    conexion_DB = connectionBD()
    cursor = conexion_DB.cursor(dictionary=True)
    # Verificar si el nombre de usuario o el    correo electrónico ya existen
    sql = "SELECT * FROM usuarios WHERE id = %s"
    cursor.execute(sql, (user_id,))
    usuarios = cursor.fetchone()
    print("cursor: ", cursor.statement)
    print("usuarios: ", usuarios)

    usuario = {
        'id': usuarios['id_rol'],
        'nombre_usuario': usuarios['nombre_usuario'],
        'correo': usuarios['correo'],
        'contraseña': usuarios['contraseña'],
    }

    return jsonify(usuario)

@app.route('/libros/<int:libro_id>', methods=['GET'])
def obtener_libro_por_id(libro_id):
    conexion_DB = connectionBD()
    cursor = conexion_DB.cursor(dictionary=True)
    sql = "SELECT * FROM libros WHERE id = %s"
    cursor.execute(sql, (libro_id,))
    libro = cursor.fetchone()
    conexion_DB.close()

    if libro is None:
        return jsonify({'error': 'Libro no encontrado'}), 404

    libro_dict = {
        'id': libro_id,
        'titulo': libro['titulo'],
        'descripcion': libro['descripcion'],
        'genero': libro['genero'],
        'subgenero': libro['subgenero'],
        'autor': libro['autor'],
        'año': libro['año'],
        'portada': libro['portada'],
    }

    print("-------------------Libro obtener libro por id------------------------")
    print(libro_dict)

    return jsonify(libro_dict)

@app.route('/catalogo/libro/<int:id_libro>')
def mostrar_libro(id_libro):
    conexion_DB = connectionBD()
    cursor = conexion_DB.cursor(dictionary=True)
    sql = "SELECT * FROM libros WHERE id = %s"
    cursor.execute(sql, (id_libro,))
    libro = cursor.fetchone()
    conexion_DB.close()

    if libro is None:
        return jsonify({'error': 'Libro no encontrado'}), 404

    libro = {
        'id': id_libro,
        'titulo': libro['titulo'],
        'descripcion': libro['descripcion'],
        'genero': libro['genero'],
        'subgenero': libro['subgenero'],
        'autor': libro['autor'],
        'año': libro['año'],
        'portada': libro['portada'],
    }
 

    print("-------------------Libro mostrar libro------------------------")
    print(libro)

    return render_template('sitio/libro.html', libro=libro)
    
    

@app.route('/usuarios/editar', methods=['PUT'])
def editar_usuario():


    if request.method == 'PUT':
        if not 'rol' in session:
            return render_template('auth/Error403.html')
        if 'rol' in session and session['rol'] == 1: 
            __data = request.get_json()
            __user = __data.get('user')
            __email = __data.get('email')
            __pass = __data.get('pass')
            __id_rol = __data.get('miCB')
            __id = __data.get('id')


            # print("--------------------------------DATOS DE USUARIO---------------------------")
            # print("User: ", __user)
            # print("email: ", __email)
            # print("password: ", __pass)
            # print("Id_rol: ", __id_rol)
            # print("id: ", __id)

            if(__id_rol == 'Admin'):
                __id_rol = 1
            else:
                __id_rol = 2
            conexion_DB = connectionBD()
            cursor = conexion_DB.cursor(dictionary=True)

        try:
            # Verificar si el nombre de usuario o el    correo electrónico ya existen
            sql = "SELECT * FROM usuarios WHERE id = '%s'"
            cursor.execute(sql, (__id))
            usuarios = cursor.fetchall()

            cursor.execute('UPDATE usuarios SET nombre_usuario=%s, correo=%s, contraseña=%s, id_rol=%s WHERE id=%s',
                           (__user, __email, __pass, __id_rol, __id))
            conexion_DB.commit()
            return jsonify({'success': 'Usuario actualizado con éxito'}), 200
        except mysql.connector.Error as error:
            return jsonify({'error': 'Error al actualizar usuario', 'details': str(error)}), 500
        finally:
            cursor.close()
            conexion_DB.close()

  
    return jsonify({'error': 'Error de request'})

@app.route('/libros/editar', methods=['PUT'])
def editar_libro():


    if request.method == 'PUT':
        if not 'rol' in session:
            return render_template('auth/Error403.html')
        if 'rol' in session and session['rol'] == 1: 
            
            __portada = request.files.get('imagen')
            print("__portada: ", __portada)
            __titulo = request.form.get('titulo')
            __descripcion = request.form.get('descripcion')
            __autor = request.form.get('autor')
            __genero = request.form.get('genero')
            __subgenero = request.form.get('subgenero')
            __año = request.form.get('año')
            __id = request.form.get('id')


            print("--------------------------------DATOS DE USUARIO---------------------------")
            print("__portada: ", __portada)
            print("__titulo: ", __titulo)
            print("__descripcion: ", __descripcion)
            print("__autor: ", __autor)
            print("__genero: ", __genero)
            print("__subgenero: ", __subgenero)
            print("__año: ", __año)
            print("__id: ", __id)
            
            conexion_DB = connectionBD()
            cursor = conexion_DB.cursor(dictionary=True)

        try:
            # Verificar si el titulo ya existe
            sql = "SELECT * FROM libros WHERE id = %s"
            cursor.execute(sql, (__id,))
            libros = cursor.fetchall()
            print("_-------------------LIBRO--------------------")
            print(libros)
            __diccionarioLibro = libros[0]

            if __portada is not None:
                print("PORTADA NO NONE")

                if os.path.exists("static/imagenes/"+__diccionarioLibro['portada']):
                    os.unlink("static/imagenes/"+__diccionarioLibro['portada'])

                tiempo=datetime.now()
                horaActual=tiempo.strftime('%Y%H%M%S')

                if __portada.filename!="":
                    __nuevoNombre=horaActual+"_"+__portada.filename

                    __portada.save("static/imagenes/"+__nuevoNombre)


                cursor.execute('UPDATE libros SET portada=%s, titulo=%s, descripcion=%s, autor=%s, genero=%s,subgenero=%s, año=%s WHERE id=%s',(__nuevoNombre, __titulo, __descripcion, __autor, __genero, __subgenero, __año, __id))
                conexion_DB.commit()
                return jsonify({'success': 'Libro actualizado con éxito'}), 200
            else:
                print("PORTADA NONE")
                cursor.execute('UPDATE libros SET titulo=%s, descripcion=%s, autor=%s, genero=%s,subgenero=%s,año=%s  WHERE id=%s',(__titulo, __descripcion, __autor, __genero, __subgenero, __año, __id))
                conexion_DB.commit()
                return jsonify({'success': 'Libro actualizado con éxito'}), 200
        except mysql.connector.Error as error:
            return jsonify({'error': 'Error al actualizar libro', 'details': str(error)}), 500
        finally:
            cursor.close()
            conexion_DB.close()
            print("FINALLY")
  
    print("NO ENTRA A UNA VRG")
    return jsonify({'error': 'Error de request'})

@app.route('/libros')
def adminLibros():
    if 'rol' in session:
        if 'rol' in session and session['rol'] == 1:
            print('rol: ',session['rol'])

            conexion_DB = connectionBD()
            cursor = conexion_DB.cursor(dictionary=True)
            # print("---------------------------------SELECCION LIBROS ------------------------------------")
            cursor.execute("SELECT * FROM `libros`")
            libros=cursor.fetchall()
            conexion_DB.commit()
            # print(libros)

            return render_template('admin/libros.html',libros=libros, page_title="libros")
        else:
            return render_template('auth/Error403.html')
    else:
        return render_template('auth/Error403.html')

@app.route('/libros/nuevo', methods=['POST'])
def crear_libro():

    if not 'rol' in session:
        return redirect(url_for("adminLibros"))
    
    if request.method == 'POST':


        __portada = request.files.get('imagen')

        __titulo = request.form.get('titulo')
        __descripcion = request.form.get('descripcion')
        __autor = request.form.get('autor')
        __genero = request.form.get('genero')
        __subgenero = request.form.get('subgenero')
        __año = request.form.get('año')

        # print("<------REQUEST------->")
        # print(__nuevoNombre)
        # print("Titulo:",__titulo)
        # print("Portada:",__portada)
        # print("Descripcion:",__descripcion)
        # print("Autor:",__autor)
        # print("Genero:", __genero)
        # print("Subgenero:",__subgenero)
        # print("Año:",__año)


        tiempo=datetime.now()
        horaActual=tiempo.strftime('%Y%H%M%S')

        if __portada.filename!="":
            __nuevoNombre=horaActual+"_"+__portada.filename

            __portada.save("static/imagenes/"+__nuevoNombre)

        sql="INSERT INTO `libros` (`id`, `portada`, `titulo`,   `descripcion`, `autor`, `genero`, `subgenero`, `año`)     VALUES (NULL, %s, %s, %s, %s, %s, %s, %s);"
        datos=(__nuevoNombre,__titulo,__descripcion,__autor,    __genero,__subgenero,__año)

        conexion_DB = connectionBD()
        cursor=conexion_DB.cursor()
        cursor.execute(sql,datos)
        conexion_DB.commit()

        return jsonify({'success':'Se ha agregado el libro'})

        # print("<------Base de datos------->")
        # print(__nuevoNombre)
        # print(__titulo)
        # print(__descripcion)
        # print(__autor)
        # print(__genero)
        # print(__subgenero)
        # print(__año)

    return redirect(url_for("adminLibros"))

@app.route('/libros/borrar', methods=['POST'])
def borrar_libro():
    print("Python")

    if not 'rol' in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST' and session['rol'] == 1:
        
        __data = request.get_json()
        __id = __data.get('id')

        print("<------ID------->")
        print(__id)

        conexion_DB=connectionBD()
        cursor=conexion_DB.cursor()
        cursor.execute("SELECT portada FROM `libros` WHERE id=%s",(__id,))
        libros=cursor.fetchall()
        conexion_DB.commit()
        print(libros)

        if os.path.exists("static/imagenes/"+str(libros[0][0])):
            os.unlink("static/imagenes/"+str(libros[0][0]))

        conexion_DB=connectionBD()
        cursor=conexion_DB.cursor()
        cursor.execute("DELETE FROM libros WHERE id=%s",(__id,))
        conexion_DB.commit()

        return jsonify({'success':'Se ha eliminado el libro'})

    return redirect(url_for('adminLibros'))

if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run(host='0.0.0.0', port=5000)
