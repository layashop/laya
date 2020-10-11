# Generated by Django 3.0.10 on 2020-10-11 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0012_post_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='delivery',
            field=models.IntegerField(choices=[(1, 'Entrega a domicilio'), (2, 'Pick-up'), (3, 'Punto de encuentro')], default=1),
        ),
    ]
