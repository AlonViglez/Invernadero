from django.apps import AppConfig

import threading


class WebpageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webpage'



    def ready(self):
        from .realtime_detection import start_realtime_detection
        thread = threading.Thread(target=start_realtime_detection)
        thread.daemon = True
        thread.start()