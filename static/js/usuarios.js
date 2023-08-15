const btnAgg = document.getElementById('btnAgg');
const btnEdit = document.getElementById('boton-editar');
let globalID = null;

// Agrega un evento click al botón para mostrar el SweetAlert
btnAgg.addEventListener('click', function () {

  // Define el contenido del formulario que deseas mostrar en el SweetAlert
  fetch('/formulario')
  .then(response => response.json())
  .then(data => {
    
    // Mostramos el SweetAlert con el formulario que ahora incluye los mensajes flash
    Swal.fire({
      title: 'Agregar Nuevo Usuario',
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      html: data.formulario_html,
    });
  })
});

function mostrarFormularioEditar(id) {
  // Aquí puedes hacer una solicitud al servidor para obtener los datos del usuario por su ID
  console.log(id);
  fetch(`/usuarios/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la solicitud.");
      }
      return response.json();
    })
    .then(data => {
      // Rellenar los campos del formulario de edición con los datos del usuario
      document.getElementById('username').value = data.nombre_usuario;
      document.getElementById('email').value = data.correo;
      document.getElementById('password').value = data.contraseña;


      if(data.id === 1){
        document.getElementById('mi-combobox').value = "Admin";
      }else{
        document.getElementById('mi-combobox').value = "Normal";
      }
      
      // Mostrar el formulario de edición usando SweetAlert
      Swal.fire({
        title: 'Editar Usuario',
        html: document.getElementById('formularioEditar').innerHTML,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        allowOutsideClick: false,
        preConfirm: () => {
          enviarFormularioEdit();
        }
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos del usuario:', error);
    });
}


function editarUsuario() {
  const botonEditar = event.target;
  const txtID = botonEditar.previousElementSibling.value;
 
  console.log(txtID);
  setID(txtID);
  mostrarFormularioEditar(txtID);

  fetch('/formEdit')
  .then(response => response.json())
  .then(data => {
    
    // Mostramos el SweetAlert con el formulario que ahora incluye los mensajes flash
    Swal.fire({
      title: 'Editar datos',
      showCancelButton: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      html: data.formularioEdit_html,
    });
  })
}

function eliminarUsuario(){
  const botonEliminar = event.target;
  const txtID = botonEliminar.previousElementSibling.value;
  console.log(txtID);
  setID(txtID);
}

function enviarFormulario() {
  const user = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  var miCB = document.getElementById('mi-combobox').value;
  const mensajeDiv = document.getElementById('mensaje');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (user.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese el nombre de usuario*';
  }

  else if(email.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese el correo electrónico*';
  }

  else if (pass.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese la contraseña*';
  }
  else if(!emailRegex.test(email)) {
    mensajeDiv.innerHTML = 'El correo electrónico no es válido*';
  }
  // Validación para la contraseña (debe tener al menos 6 caracteres)
  else if(password.length < 6){
    mensajeDiv.innerHTML = 'La contraseña debe tener al menos 6 caracteres*';
  }else{

  fetch('/usuarios/nuevo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, email, pass, miCB })
  })
  .then(response => {
    if (response.ok) {
      // Respuesta exitosa, hacer algo con los datos recibidos
      return response.json();
    } else {
      // Respuesta no exitosa, manejar el error
      return response.json().then(data => {
        if(data.error.includes('Correo')){
        mensajeDiv.innerHTML = "El correo ya se encuentra en uso*";
        }else{
          mensajeDiv.innerHTML = "El nombre de usuario se encuentra en uso*";
        }
        throw new Error(data.error || 'Ha ocurrido un error en la solicitud.');
      });
    }
  })
  .then(data => {
    alert2(data.success, 'success');
    setTimeout(function() {
      location.reload();
    }, 3000);
  })
  .catch(error => {
    // Manejar el error en caso de respuesta no exitosa
    console.error('Error al obtener los datos:', error);
  });
  }
}

function enviarFormularioEdit() {
  const user = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  var miCB = document.getElementById('mi-combobox').value;
  const mensajeDiv = document.getElementById('mensajeEdit');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var id = getID();

  console.log("ID ENVIARFORM: "+id);




  if (user.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese el nombre de usuario*';
  }

  else if(email.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese el correo electrónico*';
  }

  else if (pass.trim() === "") {
    mensajeDiv.innerHTML = 'Ingrese la contraseña*';
  }
  else if(!emailRegex.test(email)) {
    mensajeDiv.innerHTML = 'El correo electrónico no es válido*';
  }
  // Validación para la contraseña (debe tener al menos 6 caracteres)
  else if(password.length < 6){
    mensajeDiv.innerHTML = 'La contraseña debe tener al menos 6 caracteres*';
  }else if(miCB === ""){
    mensajeDiv.innerHTML = 'Seleccione un tipo de usuario*';
  }else{

  fetch('/usuarios/editar', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user, email, pass, miCB, id })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      // Respuesta no exitosa, manejar el error
      return response.json().then(data => {
        if(data.error.includes('Correo')){
        mensajeDiv.innerHTML = "El correo ya se encuentra en uso*";
        }else{
          mensajeDiv.innerHTML = "El nombre de usuario se encuentra en uso*";
        }
        throw new Error(data.error || 'Ha ocurrido un error en la solicitud.');
      });
    }
  })
  .then(data => {
    alert2(data.success, 'success');
    setTimeout(function() {
      location.reload();
    }, 3000);
  })
  .catch(error => {
    

    console.error('Error al obtener los datos:', error);
  });
  }
}

function setID(id) {
  globalID = id;
  console.log("ID FUNCION: "+globalID);
  return id;
}

function getID(){
  return globalID;
}

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      document.querySelector('.eye-icon i').style.color = 'blue';
    } else {
      passwordInput.type = 'password';
      document.querySelector('.eye-icon i').style.color = 'gray';
    }
  }
  

  // Adjuntar evento click al botón de ojo
  const eyeIcon = document.querySelector('.eye-icon');
  eyeIcon.addEventListener('click', togglePasswordVisibility);

  function confirmBorrar() {
    const botonEditar = event.target;
    const id = botonEditar.previousElementSibling.value;
   
    console.log(id);
    setID(id);

    Swal.fire({
      title: 'Confirmar eliminar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitudEliminar();
      }else{
        
      }
    });

    // No enviamos el formulario aquí, ya que esperamos la confirmación del usuario
    return false;
  }

  function enviarSolicitudEliminar() {
    const id = getID();
    console.log("ID A ELIMINAR: "+id);
    fetch(`/usuarios/borrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id})
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario.');
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          title: data.success,
          icon: 'success'
      })
        setTimeout(function() {
          location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error al eliminar el usuario:', error);
        Swal.fire({
          title:'Error al eliminar el usuario.',
          icon:'error'
      })
    });
  }


    
