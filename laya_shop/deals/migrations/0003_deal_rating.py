# Generated by Django 3.0.10 on 2020-12-10 23:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deals', '0002_auto_20201210_0427'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='rating',
            field=models.IntegerField(null=True),
        ),
    ]