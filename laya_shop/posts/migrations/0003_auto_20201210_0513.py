# Generated by Django 3.0.10 on 2020-12-10 05:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_auto_20201210_0427'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='categorias',
            field=models.IntegerField(choices=[(1, 'Productos Ilegales'), (2, 'Estafa'), (3, 'Publicidad Enganosa'), (4, 'Roba mi propiedad Intelectual'), (5, 'Esta en contra de los TOS')], default=1, max_length=255),
        ),
    ]