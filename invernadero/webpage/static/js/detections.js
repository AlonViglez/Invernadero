$(document).ready(function() {
    const slider = $('.detections__slider');
    const cardWidth = $('.detections__card').outerWidth(true); // Ancho de cada tarjeta + márgenes
    let currentIndex = 0;

    function cargarDetecciones() {
        $.ajax({
            url: '/api/ultimas-detecciones/',
            success: function(data) {
                $('#detections-gallery .detections__row').html(data);
                slider.css('transform', `translateX(-${currentIndex * cardWidth}px)`);
            }
        });
    }

    cargarDetecciones(); // Carga inicial
    setInterval(cargarDetecciones, 10000); // Actualiza cada 10 segundos

    // Botones de navegación
    $('.detections__prev').on('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            slider.animate({ transform: `translateX(-${currentIndex * cardWidth}px)` }, 300);
        }
    });

    $('.detections__next').on('click', function() {
        const totalCards = $('.detections__card').length;
        if (currentIndex < totalCards - 4) { // Suponiendo 4 tarjetas visibles
            currentIndex++;
            slider.animate({ transform: `translateX(-${currentIndex * cardWidth}px)` }, 300);
        }
    });
});