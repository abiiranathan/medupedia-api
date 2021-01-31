from django.apps import AppConfig


class DiseasesConfig(AppConfig):
    name = 'diseases'

    def ready(self):
        import diseases.signals
