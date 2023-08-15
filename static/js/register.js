function validationRegister() {
  const user = document.FormfillRegister.Username.value;
  const email = document.FormfillRegister.Email.value;
  const pass = document.FormfillRegister.Password.value;
  const confirmPass = document.FormfillRegister.CPassword.value;
  const result = document.getElementById('resultado');


  if (user === "") {
    text = "Enter Username";
    alert2(text, 'error')
    return false;
  } else if (user.length < 6) {
    text ="At least six letters";
    alert2(text, 'error')
    return false;
  } else if (email === "") {
    text = "Enter your Email";
    alert2(text, 'error')
    return false;
  }else if(!email == '@'){
    text = "Wrong email, @ is required";
    alert2(text, 'error')
    return false;
  } else if (pass === "") {
    text = "Enter your password";
    alert2(text, 'error')
    return false;
  } else if (confirmPass === "") {
    text = "Enter confirm password";
    alert2(text, 'error')
    return false;
  } else if (pass.length < 6) {
    text = "Password must be 6 characters";
    alert2(text, 'error')
    return false;
  } else if (confirmPass !== pass) {
    text = "Password doesn't match";
    alert2(text, 'error')
    return false;
  } else {
    return true;
  }
}


function validationLogin() {
  const pass = document.FormfillLogin.Password.value;
  const email = document.FormfillLogin.Email.value;

  if (email === "") {
    alert2('Ingresar correo','error')
    return false;
  }
  else if (pass === "") {
    alert2('Ingresar contraseña','error')
    return false;
  }

}

function elegir() {
  body = document.querySelector("body")


  body.classList.toggle("register");
}

function mostrarContenedorPorRuta() {
  // Obtener la ruta actual del navegador
  var path = window.location.pathname;

  // Obtener el body del documento
  var body = document.body;

  // Obtener el título de la página
  var titleElement = document.querySelector('head title');

  // Verificar la ruta actual y agregar o quitar la clase "register" en el body
  if (path === '/register') {
    body.classList.add('register');
    titleElement.textContent = 'Registro';
  } else {
    body.classList.remove('register');
    titleElement.textContent = 'Inicio de sesión';
  }
}