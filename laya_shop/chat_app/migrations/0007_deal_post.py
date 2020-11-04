# Generated by Django 3.0.10 on 2020-10-28 05:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0024_post_highlighted'),
        ('chat_app', '0006_deal'),
    ]

    operations = [
        migrations.AddField(
            model_name='deal',
            name='post',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to='posts.Post'),
            preserve_default=False,
        ),
    ]
