from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
# from django.views.decorators.vary import vary_on_cookie
from django.views.decorators.cache import cache_control

from rest_framework.viewsets import ModelViewSet

from .models import Disease, Sign, Symptom
from .serializers import (DiseaseSerializer, SignSerializer, SymptomSerializer,
                          UserSerializer)


class CacheMixin(object):
    @cache_control(max_age=3600)
    @method_decorator(cache_page(60*10))
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)


class DiseaseViewSet(CacheMixin, ModelViewSet):
    serializer_class = DiseaseSerializer
    queryset = Disease.objects.all()
    search_fields = ['name', 'about']


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
