# Generated by Django 3.0.10 on 2020-10-16 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0023_auto_20201015_2334'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='highlighted',
            field=models.BooleanField(default=False),
        ),
    ]
