# Generated by Django 3.0.10 on 2020-11-22 06:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deals', '0003_auto_20201121_2100'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='sent_by',
            field=models.IntegerField(choices=[(1, 'Usuario'), (2, 'BUSINESS')], default=2),
        ),
    ]