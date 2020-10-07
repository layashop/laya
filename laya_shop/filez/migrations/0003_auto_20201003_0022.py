# Generated by Django 3.0.10 on 2020-10-03 06:22

from django.db import migrations, models
import django.db.models.deletion
import laya_shop.filez.utils


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0002_auto_20201001_0003'),
        ('filez', '0002_auto_20201002_2029'),
    ]

    operations = [
        migrations.CreateModel(
            name='BusinessImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=laya_shop.filez.utils.business_directory_files)),
                ('is_valid', models.BooleanField(default=False)),
                ('alternative', models.CharField(blank=True, max_length=200, null=True)),
                ('business', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.Business')),
            ],
        ),
        migrations.DeleteModel(
            name='BusinessTemporalImage',
        ),
    ]
