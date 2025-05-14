from django.db import models

# Create your models here.
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(verbose_name="Descripción")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")

    def __str__(self):
        return self.title

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="post_images/")
    caption = models.CharField(max_length=200, verbose_name="Título de la imagen", blank=True, null=True)

    def __str__(self):
        return f"{self.caption or 'Imagen de ' + self.post.title}"









class PlagaDeteccion(models.Model):
    imagen = models.ImageField(upload_to='detections/')
    tipo_plaga = models.CharField(max_length=255)
    fecha_deteccion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_plaga} - {self.fecha_deteccion}"