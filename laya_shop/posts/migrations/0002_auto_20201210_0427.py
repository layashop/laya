# Generated by Django 3.0.10 on 2020-12-10 04:27

from django.conf import settings
import django.contrib.postgres.indexes
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0001_initial'),
        ('business', '0002_auto_20201210_0427'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='business',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.Business'),
        ),
        migrations.AddField(
            model_name='post',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='currency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.Currency'),
        ),
        migrations.AddField(
            model_name='post',
            name='locations',
            field=models.ManyToManyField(related_name='posts', to='posts.Locations'),
        ),
        migrations.AddField(
            model_name='post',
            name='subcategories',
            field=models.ManyToManyField(related_name='posts', to='posts.SubCategory'),
        ),
        migrations.AddIndex(
            model_name='locations',
            index=django.contrib.postgres.indexes.HashIndex(fields=['name'], name='posts_locat_name_3fc01d_hash'),
        ),
        migrations.AddIndex(
            model_name='currency',
            index=django.contrib.postgres.indexes.HashIndex(fields=['iso_code'], name='posts_curre_iso_cod_5f819b_hash'),
        ),
        migrations.AddField(
            model_name='businessimagethumbnails',
            name='business_image',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='thumbs', to='posts.BusinessImage'),
        ),
        migrations.AddField(
            model_name='businessimage',
            name='business',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='business.Business'),
        ),
        migrations.AddField(
            model_name='businessimage',
            name='post',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='images', to='posts.Post'),
        ),
        migrations.AddField(
            model_name='additionalattributesvalue',
            name='post',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='additional_attributes', to='posts.Post'),
        ),
        migrations.AddField(
            model_name='additionalattributecategory',
            name='additional_attribute',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.AdditionalAttribute'),
        ),
        migrations.AddField(
            model_name='additionalattributecategory',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posts.Category'),
        ),
        migrations.AddField(
            model_name='additionalattribute',
            name='units',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='posts.Unit'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.HashIndex(fields=['title'], name='posts_post_title_9fc17e_hash'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['title', 'state'], name='posts_post_title_baee49_btree'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['title', 'state', 'delivery'], name='posts_post_title_a71ac7_btree'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.HashIndex(fields=['state'], name='posts_post_state_455cb2_hash'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.HashIndex(fields=['delivery'], name='posts_post_deliver_db33a8_hash'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.HashIndex(fields=['title_slug'], name='posts_post_title_s_b58cc1_hash'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.HashIndex(fields=['highlighted'], name='posts_post_highlig_38a86b_hash'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.GinIndex(fields=['tags'], name='posts_post_tags_13448a_gin'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['base_price'], name='posts_post_base_pr_fefcf5_btree'),
        ),
        migrations.AddIndex(
            model_name='post',
            index=django.contrib.postgres.indexes.BTreeIndex(fields=['created_at'], name='posts_post_created_e63c5c_btree'),
        ),
    ]
