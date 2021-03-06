# Generated by Django 3.0.10 on 2020-12-10 04:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('business', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sender_name', models.CharField(max_length=50)),
                ('send_verifier', models.UUIDField(unique=True)),
                ('message', models.TextField()),
                ('send_date', models.DateTimeField(null=True)),
                ('seen', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=100, unique=True, verbose_name='Slug')),
            ],
        ),
        migrations.CreateModel(
            name='Deal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('total', models.FloatField()),
                ('delivery', models.IntegerField(choices=[(1, 'Entrega a domicilio'), (2, 'Pick-up'), (3, 'Punto de encuentro')], default=1)),
                ('approved', models.BooleanField(default=False)),
                ('business', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='business.Business')),
                ('chat_message', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='chat_app.ChatMessage')),
            ],
        ),
    ]
