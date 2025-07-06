function iniciarTransmision() {
    document.getElementById('boton-iniciar').style.display = 'none';
    document.getElementById('camara-container').style.display = 'block';
    const imgElement = document.getElementById('streaming-img');
    imgElement.src = "http://192.168.1.2:8080/video?" + new Date().getTime();
}

function detenerTransmision() {
    document.getElementById('boton-iniciar').style.display = 'block';
    document.getElementById('camara-container').style.display = 'none';
    document.getElementById('streaming-img2').src = "";
}


