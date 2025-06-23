const socket = io();
const mensaje = document.getElementById("mensaje");
const usuario = document.getElementById("usuario");

const enviarMensaje = () => {   
    if (mensaje.value != "") {        
        const message = {usuario:usuario.value, texto:mensaje.value};        
        socket.emit("message", message);
        mensaje.value = "";
    }
}

Swal.fire({
  title: "Ingrese su Nombre:",
  input: "text",
  inputAttributes: {
    autocapitalize: "off"
  },
  showCancelButton: true,
  confirmButtonText: "Enviar",
  showLoaderOnConfirm: true,
}).then((result) => {
  if (result.isConfirmed) {
    usuario.value = result.value; // Ingreso a mi campo oculto usuario el valor del Usuario ingresado
    socket.emit("nuevoUsuario", usuario.value);
  }
});

socket.on("nuevoUsuario", usuario => {
    Swal.fire({
        position: "top-end",
        title: usuario + " ha ingresado al Chat!",
        showConfirmButton: false,
        timer: 3000
    });
})

socket.on("messageLogs", mensajes => {
    if (usuario.value != "") {
        let contenidoHTML = `<table class="table">`;
    
        for (const mensaje of mensajes) {
            contenidoHTML += `<tr>
            <td><img src="https://pngmaterial.com/dvsxyz02/uploads/Avatar-Icon.png" alt="Usuario" width="32" /></td>
            <td width="100%"><p><span><b>${mensaje.usuario}</b></span><br />${mensaje.texto}</p></td>
            </tr>`;
        }
    
        contenidoHTML += `</table>`;
        document.getElementById("messageLogs").innerHTML = contenidoHTML;
    }
})
