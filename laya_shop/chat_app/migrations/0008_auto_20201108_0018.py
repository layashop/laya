# Generated by Django 3.0.10 on 2020-11-08 00:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0007_deal_post'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chatmessage',
            name='send_date',
            field=models.DateTimeField(null=True),
        ),
    ]
