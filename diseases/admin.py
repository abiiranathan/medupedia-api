from django.contrib import admin
from django.contrib.auth.models import Group

from .models import Disease, Symptom, Sign


@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    exclude = []
    model = Disease
    list_display = ['name']
    filter_horizontal = ['symptoms', 'signs']


@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    exclude = []
    model = Symptom
    list_display = ['name']


@admin.register(Sign)
class SignAdmin(admin.ModelAdmin):
    exclude = []
    model = Sign
    list_display = ['name']


admin.site.unregister(Group)

admin.site.site_header = 'Medupedia'
admin.site.site_title = 'Medupedia'
admin.site.index_title = 'Medupedia'
