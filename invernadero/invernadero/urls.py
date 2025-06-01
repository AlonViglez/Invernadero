from django.contrib import admin
from django.urls import path
from webpage.views import home,detect_objects
from django.conf import settings
from django.conf.urls.static import static
from webpage import views

urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta del administrador
    path('', home, name='home'), 
    path('detect/<int:image_id>/', detect_objects, name='detect_objects'),    # Ruta para la página principal
    path('control-bomba/', views.control_bomba, name='control_bomba'),  # Nueva ruta unificada
    path('deteccion-en-vivo/', views.deteccion_en_vivo, name='deteccion_en_vivo'),
    path('api/albumes/', views.api_albumes, name='api_albumes'),
    path('api/cargar-album/', views.api_cargar_album, name='api_cargar_album')
]

# Configuración para servir archivos multimedia en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
