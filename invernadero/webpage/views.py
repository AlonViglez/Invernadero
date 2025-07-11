from django.shortcuts import render, get_object_or_404, HttpResponse
from .models import Post, PostImage
from ultralytics import YOLO    
import os

import requests
from django.shortcuts import render, redirect
from .models import Post  # Asegúrate de que el modelo Post esté importado

from .models import PlagaDeteccion, Post

from django.http import JsonResponse
from django.template.loader import render_to_string
from .models import PlagaDeteccion
from django.db.models import Count
import os
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import json


def home(request):
    # Obtener los posts
    posts = Post.objects.prefetch_related("images").all()
    
    ultimas_detecciones = PlagaDeteccion.objects.all().order_by('-fecha_deteccion')[:5]
    
    
    # Define la clave de API y la URL de la API
    api_key = 'de7fd6782a3e06e4406140c46f91748d'
    ciudad = 'Manzanillo,MX'
    url = f'http://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={api_key}&units=metric&lang=es'

    try:
        # Realiza la solicitud a la API
        respuesta = requests.get(url)
        datos = respuesta.json()

        # Verifica si la respuesta fue exitosa
        if respuesta.status_code == 200:
            pronostico = {
                'ciudad': datos['name'],
                'temperatura': datos['main']['temp'],
                'humedad': datos['main']['humidity'],
                'descripcion': datos['weather'][0]['description'],
                'icono': datos['weather'][0]['icon'],
            }
        else:
            pronostico = None
    except Exception as e:
        pronostico = None

    # Devuelve la vista de inicio con los posts y el pronóstico del clima
    return render(request, 'home.html', {'posts': posts, 'pronostico': pronostico, 'ultimas_detecciones': ultimas_detecciones
    })
#encender bomba desde un boton
@csrf_exempt
def control_bomba(request):
    if request.method == 'POST':
        action = request.GET.get('action', '')
        device_id = "370039001547313036303933"
        token = "d3c822f9061123b3e8b44f59b308dfcf3039abb3"
        
        # Determinar el comando basado en la acción
        if action == "activar":
            comando = "ON"
            mensaje_accion = "encender"
        elif action == "desactivar":
            comando = "OFF"
            mensaje_accion = "apagar"
        else:
            return JsonResponse({
                'success': False,
                'message': f"Acción no válida: {action}"
            })
        
        print(f"Enviando comando: {comando} para {mensaje_accion} la bomba")
        
        # Enviar comando a Particle
        url = f"https://api.particle.io/v1/devices/{device_id}/activarbomba"
        data = {
            "access_token": token,
            "arg": comando
        }
        
        try:
            response = requests.post(url, data=data)
            response_data = response.json()
            
            print(f"Respuesta de Particle: {response_data}")
            
            if response.status_code == 200:
                return_value = response_data.get('return_value', -1)
                
                if return_value == 1:
                    estado_msg = "encendida"
                elif return_value == 0:
                    estado_msg = "apagada"
                else:
                    estado_msg = f"estado desconocido ({return_value})"
                
                return JsonResponse({
                    'success': True,
                    'message': f"Bomba {estado_msg} correctamente",
                    'comando_enviado': comando,
                    'return_value': return_value
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': f"La Bomba esta Desconectada: {response_data.get('error', 'Error desconocido')}"
                })
                
        except Exception as e:
            print(f"Error en la comunicación: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': f"Error de comunicación: {str(e)}"
            })
    
    return JsonResponse({
        'success': False,
        'message': "Método no permitido"
    })  
def detect_objects(request, image_id):
    # Ruta absoluta del modelo YOLO
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'best.pt')
    
    # Verifica si el modelo existe
    if not os.path.exists(model_path):
        return HttpResponse(f"El modelo en {model_path} no existe.", status=500)
    
    try:
        # Cargar el modelo YOLO
        model = YOLO(model_path)

        # Obtener la imagen seleccionada
        image_instance = get_object_or_404(PostImage, id=image_id)
        image_path = image_instance.image.path  # Ruta absoluta de la imagen

        # Verifica si la imagen existe
        if not os.path.exists(image_path):
            return HttpResponse(f"La imagen {image_path} no existe.", status=404)

        # Realizar la detección de objetos
        results = model(image_path)

        # Procesar resultados
        detections = []
        for r in results:
            for box in r.boxes:
                detections.append({
                    "class": model.names[int(box.cls[0])],
                    "confidence": float(box.conf[0]),
                    "coordinates": box.xyxy[0].tolist()
                })

        # Renderizar resultados en una plantilla
        return render(request, 'detection_results.html', {
            "image": image_instance,
            "detections": detections
        })
    
    except Exception as e:
        return HttpResponse(f"Error durante la detección: {str(e)}", status=500)






def deteccion_en_vivo(request):
    detecciones = PlagaDeteccion.objects.all().order_by('-fecha_deteccion')[:10]
    return render(request, 'detection_results.html', {'detecciones': detecciones})

def api_albumes(request):
    # Obtener todas las carpetas de álbumes en media/detections/
    album_dirs = os.listdir(os.path.join(settings.MEDIA_ROOT, 'detections'))
    albums = [album for album in album_dirs if album.startswith('album_')]
    return JsonResponse({'albums': albums})

def api_cargar_album(request):
    selected_album = request.GET.get('album')
    if selected_album:
        images = PlagaDeteccion.objects.filter(imagen__startswith=f'detections/{selected_album}/')
        context = {'images': images}
        html = render_to_string('album_partial.html', context)
        return JsonResponse({'html': html})
    return JsonResponse({'html': ''})