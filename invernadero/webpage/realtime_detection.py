import cv2
import os
import uuid
import time
from datetime import datetime
from ultralytics import YOLO
from .models import PlagaDeteccion
from django.conf import settings

# Cargar modelo YOLO
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'best.pt')
model = YOLO(model_path)

camera_url = "http://192.168.1.2:8080/video"

def start_realtime_detection():
    cap = cv2.VideoCapture(camera_url)
    
    capture_interval = 30  # segundos
    max_images_per_interval = 1
    saved_images_count = 0
    interval_start_time = time.time()
    current_date = datetime.now().strftime("%Y-%m-%d")
    album_dir = os.path.join(settings.MEDIA_ROOT, 'detections', f'album_{current_date}')
    os.makedirs(album_dir, exist_ok=True)

    confidence_threshold = 0.6  # umbral de confianza mínimo

    while True:
        ret, frame = cap.read()
        if not ret:
            print("No se puede acceder a la cámara.")
            break

        results = model(frame)
        annotated_frame = results[0].plot()

        # Filtrar cajas con confianza suficiente
        filtered_boxes = [box for box in results[0].boxes if box.conf >= confidence_threshold]

        if len(filtered_boxes) > 0:
            now = time.time()

            # Verificar cambio de día y actualizar carpeta
            new_date = datetime.now().strftime("%Y-%m-%d")
            if new_date != current_date:
                current_date = new_date
                album_dir = os.path.join(settings.MEDIA_ROOT, 'detections', f'album_{current_date}')
                os.makedirs(album_dir, exist_ok=True)
                saved_images_count = 0
                interval_start_time = now

            # Reiniciar contador si pasó intervalo
            if now - interval_start_time >= capture_interval:
                interval_start_time = now
                saved_images_count = 0

            # Guardar imagen si no supera límite por intervalo
            if saved_images_count < max_images_per_interval:
                saved_images_count += 1

                if not os.path.exists(album_dir):
                    os.makedirs(album_dir, exist_ok=True)

                filename = f"{uuid.uuid4()}_{datetime.now().strftime('%H%M%S')}.jpg"
                file_path = os.path.join(album_dir, filename)
                cv2.imwrite(file_path, annotated_frame)

                detected_classes = [results[0].names[int(box.cls)] for box in filtered_boxes]
                pest_types = ", ".join(set(detected_classes))

                PlagaDeteccion.objects.create(
                    imagen=f'detections/album_{current_date}/{filename}',
                    tipo_plaga=pest_types
                )

    cap.release()
