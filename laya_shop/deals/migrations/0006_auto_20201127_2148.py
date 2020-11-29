# Generated by Django 3.0.10 on 2020-11-28 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deals', '0005_merge_20201122_1834'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deal',
            name='status',
            field=models.IntegerField(choices=[(1, 'Pendiente'), (2, 'Rechazado'), (3, 'Cancelado'), (4, 'Reservado'), (5, 'Acordado'), (6, 'En Delivery'), (7, 'Entregado'), (8, 'Devuelto'), (9, 'Cerrado')], default=1),
        ),
    ]
