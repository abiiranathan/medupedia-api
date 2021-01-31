from diseases.models import Disease, Sign
import json
from django.db import transaction
from django.db.utils import IntegrityError

with transaction.atomic():
    with open("signs.json", 'rb') as f:
        data = json.load(f)

        for row in data:
            if row['disease']:
                d, _ = Disease.objects.get_or_create(name=row['disease'])

                try:
                    sign = Sign.objects.create(
                        name=row['name'], description=row['description'])
                except IntegrityError:
                    sign = Sign.objects.get(name=row['name'])

                d.signs.add(sign)
