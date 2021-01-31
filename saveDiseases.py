from configparser import ConfigParser
from diseases.models import Disease, Symptom

from django.db import transaction

config = ConfigParser(strict=False)
config.optionxform = str
config.read("diseases.ini")

with transaction.atomic():
    for symptom in config.sections():
        for ddx in config.options(symptom):
            d, _ = Disease.objects.get_or_create(name=ddx)
            s, _ = Symptom.objects.get_or_create(name=symptom)
            d.symptoms.add(s)
