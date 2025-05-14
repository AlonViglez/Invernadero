// Scroll horizontal de la galería
function scrollGallery(px) {
    const gallery = document.getElementById('album-gallery');
    gallery.scrollBy({
        left: px,
        behavior: 'smooth'
    });
}