# Generated by Django 3.0.10 on 2020-10-03 23:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_delete_postimage'),
        ('filez', '0003_auto_20201003_0022'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessimage',
            name='post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.Post'),
        ),
    ]
