const btnAgg = document.getElementById('btnAgg');
const btnEdit = document.getElementById('boton-editar');
let globalID = null;
let globalCheck = false;

btnAgg.addEventListener('click', function () {

    // Define el contenido del formulario que deseas mostrar en el SweetAlert
    fetch('/formularioLibros')
    .then(response => response.json())
    .then(data => {
      
      // Mostramos el SweetAlert con el formulario que ahora incluye los mensajes flash
      Swal.fire({
        title: 'Agregar libro',
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        html: data.formulario_html,
      });
    })
  });

  function actualizarNombreArchivo(event) {
    const input = event.target;
    if (input.files.length > 0) {
      const nombreArchivo = input.files[0].name;
      const maxLength = 31;
      const textoCorto = nombreArchivo.length > maxLength ? nombreArchivo.substring(0, maxLength - 3) + '...' : nombreArchivo;
      document.getElementById("labelImagen").textContent = textoCorto;
    } else {
      document.getElementById("labelImagen").textContent = "Seleccione una imagen:";
    }
  }

  function actualizarGenero() {
    const genero = document.getElementById('genero').value;
    const subgenero = document.getElementById('subgenero');

  
    // Borra las opciones existentes del segundo select
    while (subgenero.firstChild) {
    subgenero.removeChild(subgenero.firstChild);
    }

    // Agrega las opciones según la selección en el primer select
    if (genero === 'narrativo') {
      agregarOpcion(subgenero, 'novela', 'Novela');
      agregarOpcion(subgenero, 'cuento', 'Cuento');
      agregarOpcion(subgenero, 'leyenda', 'Leyenda');
      agregarOpcion(subgenero, 'fabula', 'Fábula');
      agregarOpcion(subgenero, 'epopeya', 'Epopeya');
      agregarOpcion(subgenero, 'mito', 'Mito');
      agregarOpcion(subgenero, 'relato', 'Relato');
    } else if (genero === 'lirico') {
      agregarOpcion(subgenero, 'poema lirico', 'Poema lírico');
      agregarOpcion(subgenero, 'oda', 'Oda');
      agregarOpcion(subgenero, 'soneto', 'Soneto');
      agregarOpcion(subgenero, 'elegia', 'Elegía');
      agregarOpcion(subgenero, 'himno', 'Himno');
      agregarOpcion(subgenero, 'cancion', 'Canción');
    }else if (genero === 'dramatico') {
      agregarOpcion(subgenero, 'tragedia', 'Tragedia');
      agregarOpcion(subgenero, 'comedia', 'Comedia');
      agregarOpcion(subgenero, 'drama', 'Drama');
      agregarOpcion(subgenero, 'tragicomedia', 'Tragicomedia');
      agregarOpcion(subgenero, 'sainete', 'Sainete');
      agregarOpcion(subgenero, 'entremes', 'Entremés');
    }else if (genero === 'ensayistico') {
        agregarOpcion(subgenero, 'ensayo literario', 'Ensayo literario');
        agregarOpcion(subgenero, 'ensayo filosofico', 'Ensayo filosófico');
        agregarOpcion(subgenero, 'ensayo cientifico', 'Ensayo científico');
        agregarOpcion(subgenero, 'ensayo politico', 'Ensayo político');
    }else if (genero === 'epico') {
        agregarOpcion(subgenero, 'epopeya', 'Epopeya');
        agregarOpcion(subgenero, 'novela epica', 'Novela épica');
        agregarOpcion(subgenero, 'poema epico', 'Poema épico');

    }else if (genero === 'didactico') {
        agregarOpcion(subgenero, 'tratado', 'Tratado');
        agregarOpcion(subgenero, 'manual', 'Manual');agregarOpcion(subgenero, 'discurso', 'Discurso');
    }else if (genero === 'biografico') {
        agregarOpcion(subgenero, 'biografia', 'Biografía');
        agregarOpcion(subgenero, 'autobiografia', 'Autobiografía');
        agregarOpcion(subgenero, 'memorias', 'Memorias');
    }else if (genero === 'historico') {
        agregarOpcion(subgenero, 'cronica historica', 'Crónica histórica');
        agregarOpcion(subgenero, 'novela historica', 'Novela histórica');
        agregarOpcion(subgenero, 'ensayo historico', 'Ensayo histórico');
    }else if (genero === 'fantastico') {
        agregarOpcion(subgenero, 'ciencia ficcion', 'Ciencia ficción');
        agregarOpcion(subgenero, 'fantasia', 'Fantasía');
        agregarOpcion(subgenero, 'terror', 'Terror');
    } else {
      // Agrega una opción predeterminada para cuando no se ha seleccionado nada en el primer select
      agregarOpcion(subgenero, '', 'Seleccionar subgenero');
    }
  }
  
  function agregarOpcion(select, value, text) {
    const opcion = document.createElement('option');
    opcion.value = value;
    opcion.textContent = text;
    select.appendChild(opcion);
  }

  function eliminarLibro(id){
    console.log(id);

    fetch('/libros/borrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'id': id })
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

  function confirmBorrar() {
    const botonEliminar = event.target;
    const id = botonEliminar.previousElementSibling.value;
    console.log(id);
    Swal.fire({
      title: 'Confirmar eliminar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarLibro(id);
      }
    });

    // No enviamos el formulario aquí, ya que esperamos la confirmación del usuario
    return false;
  }

  function setID(id) {
    globalID = id;
    console.log("ID FUNCION: "+globalID);
    return id;
  }
  
  function getID(){
    return globalID;
  }

  function editarLibro() {
    const botonEditar = event.target;
    const id = botonEditar.previousElementSibling.value;
   
    console.log(id);
    setID(id);
    mostrarFormularioEditar(id);
  
    fetch('/formEditLibro')
    .then(response => response.json())
    .then(data => {
      
      // Mostramos el SweetAlert con el formulario que ahora incluye los mensajes flash
      Swal.fire({
        title: 'Editar libro',
        showCancelButton: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        html: data.formularioEditLibros_html,
      });
    })
  }

  function mostrarFormularioEditar(id) {
    // Aquí puedes hacer una solicitud al servidor para obtener los datos del usuario por su ID
    console.log(id);
    fetch(`/libros/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la solicitud.");
        }
        return response.json();
      })
      .then(data => {

        console.log(data.subgenero)
        console.log(data.portada)
        // Rellenar los campos del formulario de edición con los datos del usuario
        document.getElementById('titulo').value = data.titulo;
        document.getElementById('descripcion').value = data.descripcion;
        document.getElementById('autor').value = data.autor;
        document.getElementById('genero').value = data.genero;
        document.getElementById('subgenero').value = data.subgenero;
        document.getElementById('año').value = data.año;
        document.getElementById('imagen').value = data.portada;
        
        // Mostrar el formulario de edición usando SweetAlert
        Swal.fire({
          title: 'Editar Libro',
          html: document.getElementById('').innerHTML,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          allowOutsideClick: false,
          preConfirm: () => {
            validarFormularioEdit();
          }
        });
      })
      .catch(error => {
        console.error('Error al obtener los datos del libro:', error);
      });
  }

  function validarFormularioEdit() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const subgenero = document.getElementById('subgenero').value;
    const año = document.getElementById('año').value;
    var imagen = document.getElementById('imagen');
    const mensajeDiv = document.getElementById('mensaje');

    // console.log("GLOBALCHECK: " +globalCheck);
    // console.log("GLOBAL ID: "+getID());

  
    function validarAño(año) {
      return /^\d+$/.test(año); // Verifica si solo contiene dígitos
    }

  
    if (titulo.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el titulo del libro*';
    }
    else if(descripcion.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese una descripcion*';
    }
    else if(autor.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el nombre del autor*';
    }
    else if (genero.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el genero*';
    }
    else if (subgenero.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el subgenero*';
    }
    else if(año.trim() === ""){
      mensajeDiv.innerHTML = 'Ingrese el año*';
    }
    else if (!validarAño(año.trim())) {
      mensajeDiv.innerHTML = 'Ingrese un año válido*';
    }else{
      if(!globalCheck){
        if (!imagen.files || imagen.files.length === 0) {
          console.log("valida que no hay imagen");
          mensajeDiv.innerHTML = 'Seleccione una imagen de portada*';
        }else{
        console.log("crea dataform con imagen");
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('autor', autor);
        formData.append('genero', genero);
        formData.append('subgenero', subgenero);
        formData.append('año', año);
        formData.append('id', getID());
        console.log("Se agrega la portada a dataForm")
        formData.append('imagen', imagen.files[0]);
        enviarFormularioEditar(formData);
    }
  }else{
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('autor', autor);
    formData.append('genero', genero);
    formData.append('subgenero', subgenero);
    formData.append('año', año);
    formData.append('id', getID());
    enviarFormularioEditar(formData);
    }
  }
}
  
  function enviarFormularioEditar(formData){

    
    console.log(formData);
  
    fetch('/libros/editar', {
      method: 'PUT',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
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
      alert2(data.error, 'error');
      setTimeout(function() {
        location.reload();
      }, 3000);
      console.error('Error al obtener los datos:', error);
    });

  }

  function enviarFormulario() {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const autor = document.getElementById('autor').value;
    const genero = document.getElementById('genero').value;
    const subgenero = document.getElementById('subgenero').value;
    const año = document.getElementById('año').value;
    var imagen = document.getElementById('imagen');
    const mensajeDiv = document.getElementById('mensaje');

    console.log("GLOBALCHECK: " +globalCheck);

  
    function validarAño(año) {
      return /^\d+$/.test(año); // Verifica si solo contiene dígitos
    }

  
    if (titulo.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el titulo del libro*';
    }
    else if(descripcion.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese una descripcion*';
    }
    else if(autor.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el nombre del autor*';
    }
    else if (genero.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el genero*';
    }
    else if (subgenero.trim() === "") {
      mensajeDiv.innerHTML = 'Ingrese el subgenero*';
    }
    else if(año.trim() === ""){
      mensajeDiv.innerHTML = 'Ingrese el año*';
    }
    else if (!validarAño(año.trim())) {
      mensajeDiv.innerHTML = 'Ingrese un año válido*';
    }
    else if (!imagen.files || imagen.files.length === 0) {
      mensajeDiv.innerHTML = 'Seleccione una imagen de portada*';
    }
    else{

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('autor', autor);
    formData.append('genero', genero);
    formData.append('subgenero', subgenero);
    formData.append('año', año);
    formData.append('imagen', imagen.files[0]);


    console.log(formData);
  
    fetch('/libros/nuevo', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
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

  function checkbox(){
  var checkbox = document.getElementById('check');
  const imagenBoton = document.querySelector('.btn-file');
  const imagenInput = document.getElementById('imagen');
  const texto = document.getElementById('labelImagen')

  if (checkbox.checked) {
    globalCheck = true;
    console.log("CHECK");
    imagenBoton.style.display = 'none'; // Ocultar el botón
    imagenInput.disabled = true; // Deshabilitar el input de archivos
    texto.style.display = 'none'; // Ocultar el texto
  } else {
    console.log("UNCHECK");
    globalCheck = false;
    imagenBoton.style.display = 'block'; // Mostrar el botón
    imagenInput.disabled = false; // Habilitar el input de archivos
    texto.style.display = 'block'; // Mostrar el texto
  }
}