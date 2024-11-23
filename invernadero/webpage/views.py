from django.shortcuts import render, get_object_or_404, HttpResponse
from .models import Post, PostImage
from ultralytics import YOLO
import os

def home(request):
    posts = Post.objects.prefetch_related("images").all()
    return render(request, 'home.html', {"posts": posts})


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
