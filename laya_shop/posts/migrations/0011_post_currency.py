# Generated by Django 3.0.10 on 2020-10-11 04:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0010_auto_20201010_2227'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='currency',
            field=models.CharField(choices=[('NIO', 'Córdobas'), ('USD', 'Dólares')], default='USD', max_length=3),
        ),
    ]
