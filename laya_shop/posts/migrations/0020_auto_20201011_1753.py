# Generated by Django 3.0.10 on 2020-10-11 23:53

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0019_businessimage_attributes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='businessimage',
            name='attributes',
        ),
        migrations.AddField(
            model_name='post',
            name='attributes',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True),
        ),
    ]