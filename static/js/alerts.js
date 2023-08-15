

// Swal.fire({
//     title: "hola"
//     // text:
//     // html:
//     // icon:
//     // confirmButtonText:
//     // footer:
//     //width: %
//     //padding:
//     // background:
//     // grow: row o colum o fullscreen
//     // backdrop: true o false oculta o no el fondo
//     // timer: duracion
//     // timerProgressBar: muestra duracion
//     // toas: true
//     // position: center, top, bottom, left, right, bottom-end(abajo-derecha), top-end(arriba-der)
//     // allowOutsideClick: permite o no clicks fuera
//     // allowEscapeKey:
//     // allowEnterKey:
//     // stopKeydownPropagation: usar false por defect

//     // input: text, select
//     // inputPlaceholder: 
//     // inputValue:
//     // inputOptions: recibir objetos {mexico: 'mexico'..etc}dictionario

//     // customClass:{
//     // container:
//     // popup:
//     // header:
//     // title:
//     // closeButton:
//     // icon:
//     // image:
//     // content:
//     // confirmButton
//     // cancelButton
//     // footer:
//     // }


//     // showConfirmButton: True false
//     //confirmButtonColor:  #RGB 
//     //confirmButtonAriaLabel: "Confirmar"

//     // showCancelButton:
//     // cancelButtonText:
//     // cancelButtonColor:
//     // cancelButtonAriaLabel: "Cancelar"

//     // buttonStyling: true false
//     // showCloseButton: true false
//     // closeButtonAriaLabel: "Cerrar"

//     // imageUrl: url
//     // imageWidth:
//     // imageHeight:
//     // imageAlt: texto alternativo

// });

function alert(title, text, type,timer,tiempo,position){
    Swal.fire({
        title,
        text,
        type,
        timer,
        tiempo,
        position
        
    })
}

function alert2(title, type){
        const Toast = Swal.mixin({

            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: type,
            title: title
          })
}

function confirmLogout() {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "{{ url_for('logout') }}";
    }
  });
}