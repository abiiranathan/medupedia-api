from django.contrib.auth.models import User
from django_restql.fields import DynamicSerializerMethodField
from django_restql.mixins import DynamicFieldsMixin
from rest_framework.authtoken.models import Token
from rest_framework.serializers import (
    HyperlinkedIdentityField, ModelSerializer)

from .models import Disease, Sign, Symptom


class SymptomSerializer(DynamicFieldsMixin, ModelSerializer):
    class Meta:
        fields = ('id',  'name', 'description')
        model = Symptom


class SignSerializer(DynamicFieldsMixin, ModelSerializer):
    class Meta:
        fields = ('id',  'name', 'description')
        model = Sign


class DiseaseSerializer(DynamicFieldsMixin, ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)
    signs = SignSerializer(many=True, read_only=True)

    class Meta:
        fields = ('id', 'name', 'symptoms', 'signs', 'about')
        model = Disease

    def get_symptoms(self, obj, query):
        symptoms = obj.symptoms.all()

        serializer = SymptomSerializer(
            symptoms,
            many=True,
            query=query,
            context=self.context
        )
        return serializer.data

    def get_signs(self, obj, query):
        signs = obj.signs.all()

        serializer = SignSerializer(
            signs,
            many=True,
            query=query,
            context=self.context
        )
        return serializer.data


class UserSerializer(ModelSerializer):
    token = DynamicSerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', "token"]
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def get_token(self, obj, query):
        try:
            return Token.objects.get(user=obj).key
        except Token.DoesNotExist:
            return None
        except Token.MultipleObjectsReturned:
            return Token.objects.filter(user=obj).first().key
        except:
            return None
