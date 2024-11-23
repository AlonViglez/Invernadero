from django.contrib import admin
from django.urls import path
from webpage.views import home,detect_objects
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta del administrador
    path('', home, name='home'), 
    path('detect/<int:image_id>/', detect_objects, name='detect_objects')     # Ruta para la página principal
]

# Configuración para servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
