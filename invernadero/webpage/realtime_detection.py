import cv2
import os
import uuid
from datetime import datetime
from ultralytics import YOLO
from .models import PlagaDeteccion
from django.conf import settings

# Cargar modelo
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'best.pt')
model = YOLO(model_path)

camera_url = "http://192.168.1.6:8080/video"

def start_realtime_detection():
    cap = cv2.VideoCapture(camera_url)
    album_timestamp = None  # Para rastrear el último álbum creado

    while True:
        ret, frame = cap.read()
        if not ret:
            print("No se puede acceder a la cámara.")
            break

        results = model(frame)
        annotated_frame = results[0].plot()

        if len(results[0].boxes) > 0:
            # Genera un nuevo álbum 
            current_timestamp = int(datetime.now().timestamp())
            if album_timestamp is None or current_timestamp - album_timestamp >= 10:
                album_timestamp = current_timestamp
                album_dir = os.path.join(settings.MEDIA_ROOT, 'detections', f'album_{current_timestamp}')
                os.makedirs(album_dir, exist_ok=True)

            filename = f"{uuid.uuid4()}_{datetime.now().strftime('%H%M%S')}.jpg"
            file_path = os.path.join(album_dir, filename)
            cv2.imwrite(file_path, annotated_frame)

            detected_classes = [results[0].names[int(box.cls)] for box in results[0].boxes]
            pest_types = ", ".join(set(detected_classes))

            PlagaDeteccion.objects.create(
                imagen=f"detections/album_{current_timestamp}/{filename}",
                tipo_plaga=pest_types
            )

    cap.release()