from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
# from django.views.decorators.vary import vary_on_cookie
from django.views.decorators.cache import cache_control
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from rest_framework.viewsets import ModelViewSet

from .models import Disease, Sign, Symptom
from .serializers import (DiseaseSerializer, SignSerializer, SymptomSerializer,
                          UserSerializer)


class CacheMixin(object):
    @cache_control(max_age=3600)
    @method_decorator(cache_page(60))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class DiseaseViewSet(CacheMixin, ModelViewSet):
    serializer_class = DiseaseSerializer
    queryset = Disease.objects.all()
    search_fields = ['name', 'about']

    def create(self, request, *args, **kwargs):
        symptoms = self.request.data.get('symptoms', [])
        signs = self.request.data.get("signs", [])

        validated_data = {
            "name": self.request.data.get("name"),
            "about": self.request.data.get("about")
        }

        with transaction.atomic():
            disease = Disease.objects.create(**validated_data)

            for symp in symptoms:
                symptom = get_object_or_404(Symptom, pk=symp['id'])
                disease.symptoms.add(symptom)

            for sn in signs:
                sign = get_object_or_404(Sign, pk=sn['id'])
                disease.signs.add(sign)

            serializer = DiseaseSerializer(
                disease, context={"request": request})
            headers = self.get_success_headers(data=serializer.data)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        disease = self.get_object()

        symptoms_list = self.request.data.get('symptoms', None)
        signs_list = self.request.data.get("signs", None)
        about = self.request.data.get("about", None)

        if about is not None and isinstance(about, str):
            disease.about = about

        if symptoms_list is not None and isinstance(symptoms_list, list):
            symptoms = [get_object_or_404(
                Symptom, pk=symptom["id"]) for symptom in symptoms_list]
            disease.symptoms.set(symptoms)

        if signs_list is not None and isinstance(signs_list, list):
            signs = [get_object_or_404(
                Sign, pk=sign["id"]) for sign in signs_list]
            disease.signs.set(signs)

        disease.save()

        serializer = DiseaseSerializer(
            disease, context={"request": request})
        headers = self.get_success_headers(data=serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK, headers=headers)

    def update(self, request, *args, **kwargs):
        disease = self.get_object()

        symptoms_list = self.request.data.get('symptoms', None)
        signs_list = self.request.data.get("signs", None)
        about = self.request.data.get("about", None)
        name = self.request.data.get("name", None)

        if name is not None and isinstance(name, str):
            disease.name = name

        if about is not None and isinstance(about, str):
            disease.about = about

        if symptoms_list is not None and isinstance(symptoms_list, list):
            symptoms = [get_object_or_404(
                Symptom, pk=symptom["id"]) for symptom in symptoms_list]
            disease.symptoms.set(symptoms)

        if signs_list is not None and isinstance(signs_list, list):
            signs = [get_object_or_404(
                Sign, pk=sign["id"]) for sign in signs_list]
            disease.signs.set(signs)

        disease.save()

        serializer = DiseaseSerializer(
            disease, context={"request": request})
        headers = self.get_success_headers(data=serializer.data)
        return Response(data=serializer.data, status=status.HTTP_200_OK, headers=headers)


class SymptomViewSet(CacheMixin, ModelViewSet):
    serializer_class = SymptomSerializer
    queryset = Symptom.objects.all()

    search_fields = ['name', 'description']


class SignViewSet(CacheMixin, ModelViewSet):
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
