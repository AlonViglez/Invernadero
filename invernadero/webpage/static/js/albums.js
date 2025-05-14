$(document).ready(function () {
    // Cargar lista de álbumes
    function cargarAlbumes() {
        $.ajax({
            url: '/api/albumes/',
            success: function (data) {
                const select = $('#album-select');
                select.empty();
                data.albums.forEach(album => {
                    select.append(`<option value="${album}">${album}</option>`);
                });

                // Cargar primer álbum automáticamente
                if (data.albums.length > 0) {
                    cargarAlbum(data.albums[0]);
                }
            }
        });
    }

    // Cargar imágenes del álbum seleccionado
    function cargarAlbum(album) {
        $.ajax({
            url: '/api/cargar-album/',
            data: { album: album },
            success: function (data) {
                $('#album-gallery').html(data.html);
            }
        });
    }

    // Cargar álbumes al iniciar
    cargarAlbumes();

    // Manejar cambio de álbum
    $('#album-select').on('change', function () {
        const selectedAlbum = $(this).val();
        if (selectedAlbum) {
            cargarAlbum(selectedAlbum);
        }
    });
});