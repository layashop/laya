# Generated by Django 3.0.10 on 2020-10-05 08:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_delete_postimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('banner', models.ImageField(blank=True, null=True, upload_to='subcategories', verbose_name='Banner')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.Category')),
            ],
        ),
    ]
