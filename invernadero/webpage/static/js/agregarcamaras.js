
    let camaras = [];

    // Cargar cámaras desde localStorage
    window.onload = function () {
        const storedCameras = JSON.parse(localStorage.getItem('camaras')) || [];
        if (storedCameras.length > 0) {
            camaras = storedCameras;
            storedCameras.forEach(function (ip, index) {
                mostrarCamara(ip, index);
            });
        }
    };

    function agregarCamara() {
        const ipInput = document.getElementById('ip-camara');
        const ip = ipInput.value.trim();

        if (!ip) {
            alert("Por favor ingresa una IP válida.");
            return;
        }

        // Añadir nueva cámara
        camaras.push(ip);
        localStorage.setItem('camaras', JSON.stringify(camaras));

        // Mostrarla en pantalla
        mostrarCamara(ip, camaras.length - 1);

        // Limpiar input
        ipInput.value = "";
    }

    function mostrarCamara(ip, index) {
        const camaraId = 'camara-' + index;

        const container = document.getElementById('lista-camaras');

        const cardHTML = `
            <div class="steps__card" id="${camaraId}-card">
                <h3>${ip}</h3>
                <img src="" alt="Transmisión en vivo" id="streaming-img-${camaraId}" class="post__image" />
                <br><br>
                <button class="button button--flex" onclick="actualizarCamara('${ip}', '${camaraId}')">
                    Actualizar Transmisión <i class="ri-refresh-line button__icon"></i>
                </button>
                <button class="button button--flex" onclick="mostrarModal(${index})" style="background-color: #e74c3c;">
                    Eliminar Cámara <i class="ri-delete-bin-line button__icon"></i>
                </button>
            </div>
        `;

        container.innerHTML += cardHTML;

        // Iniciar transmisión
        actualizarCamara(ip, camaraId);
    }

    function actualizarCamara(ip, camaraId) {
        const imgElement = document.getElementById(`streaming-img-${camaraId}`);
        if (imgElement) {
            imgElement.src = ip + "?" + new Date().getTime(); // Evitar caché
        }
    }

    function mostrarModal(index) {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'block';
        sessionStorage.setItem('cameraIndexToDelete', index);
    }

    function cerrarModal() {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'none';
    }

    function confirmarEliminacion(confirmar) {
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'none';

        if (confirmar) {
            const index = parseInt(sessionStorage.getItem('cameraIndexToDelete'));
            eliminarCamara(index);
        }
    }

    function eliminarCamara(index) {
        // Remover del array local
        camaras.splice(index, 1);

        // Actualizar localStorage
        localStorage.setItem('camaras', JSON.stringify(camaras));

        // Recargar la lista de cámaras
        const container = document.getElementById('lista-camaras');
        container.innerHTML = ""; // Limpiar contenedor
        camaras.forEach((ip, i) => mostrarCamara(ip, i));
    }
