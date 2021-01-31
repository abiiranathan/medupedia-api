from django.contrib.auth.models import User
from django_restql.fields import DynamicSerializerMethodField
from django_restql.mixins import DynamicFieldsMixin
from rest_framework.authtoken.models import Token
from rest_framework.serializers import (HyperlinkedIdentityField,
                                        HyperlinkedModelSerializer)

from .models import Disease, Sign, Symptom


class SymptomSerializer(DynamicFieldsMixin, HyperlinkedModelSerializer):
    url = HyperlinkedIdentityField(view_name="diseases:symptoms-detail")

    class Meta:
        fields = ('id', 'url', 'name', 'description')
        model = Symptom


class SignSerializer(DynamicFieldsMixin, HyperlinkedModelSerializer):
    url = HyperlinkedIdentityField(view_name="diseases:signs-detail")

    class Meta:
        fields = ('id', 'url', 'name', 'description')
        model = Sign


class DiseaseSerializer(DynamicFieldsMixin, HyperlinkedModelSerializer):
    symptoms = SymptomSerializer(many=True)
    signs = SignSerializer(many=True)
    url = HyperlinkedIdentityField(view_name="diseases:diseases-detail")

    class Meta:
        fields = ('id', 'url', 'name', 'symptoms', 'signs', 'about')
        model = Disease

    def create(self, validated_data):
        symptoms = validated_data.pop('symptoms', [])
        signs = validated_data.pop("signs", [])

        disease = Disease.objects.create(**validated_data)

        for symp in symptoms:
            symptom = Symptom.objects.create(**symp)
            disease.symptoms.add(symptom)

        for sn in signs:
            sign = Sign.objects.create(**sn)
            disease.signs.add(sign)

        return disease

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


class UserSerializer(HyperlinkedModelSerializer):
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
