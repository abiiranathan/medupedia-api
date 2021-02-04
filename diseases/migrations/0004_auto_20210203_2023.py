# Generated by Django 3.1.5 on 2021-02-03 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diseases', '0003_auto_20210129_1806'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='disease',
            options={'ordering': ('name', 'id')},
        ),
        migrations.AlterField(
            model_name='disease',
            name='signs',
            field=models.ManyToManyField(blank=True, to='diseases.Sign'),
        ),
        migrations.AlterField(
            model_name='disease',
            name='symptoms',
            field=models.ManyToManyField(blank=True, to='diseases.Symptom'),
        ),
    ]
