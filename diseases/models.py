from django.db import models


class Feature(models.Model):
    """Abstract model for signs and symptoms"""
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, default="")

    def __str__(self) -> str:
        return self.name

    class Meta:
        abstract = True
        ordering = ('name', )


class Symptom(Feature):
    """Model for disease symptoms"""


class Sign(Feature):
    """Model for disease signs"""


class Disease(models.Model):
    name = models.CharField(max_length=200, unique=True)
    symptoms = models.ManyToManyField(Symptom)
    signs = models.ManyToManyField(Sign)
    about = models.TextField(default="", blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ('name', )
