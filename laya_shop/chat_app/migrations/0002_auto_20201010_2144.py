# Generated by Django 3.0.10 on 2020-10-10 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatroom',
            name='slug',
            field=models.SlugField(max_length=100, unique=True, verbose_name='Slug'),
        ),
    ]
