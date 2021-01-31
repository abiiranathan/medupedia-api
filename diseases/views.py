from rest_framework.viewsets import ModelViewSet
from .models import Disease, Sign, Symptom

from .serializers import DiseaseSerializer, SignSerializer, SymptomSerializer, UserSerializer
from django.contrib.auth.models import User


class DiseaseViewSet(ModelViewSet):
    serializer_class = DiseaseSerializer
    queryset = Disease.objects.all()
    search_fields = ['name', 'about']


class SymptomViewSet(ModelViewSet):
    serializer_class = SymptomSerializer
    queryset = Symptom.objects.all()

    search_fields = ['name', 'description']


class SignViewSet(ModelViewSet):
    serializer_class = SignSerializer
    queryset = Sign.objects.all()

    search_fields = ['name', 'description']


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()

        if self.request.user.is_authenticated:
            return qs.filter(id=self.request.user.id)
        else:
            return qs.none()
