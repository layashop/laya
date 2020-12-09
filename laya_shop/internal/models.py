from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
# Create your models here.


class HomeSlide(models.Model):
    # TODO: reparar el height en mobile
    image = models.ImageField(upload_to='index_slides')
    text = models.CharField(max_length=100, blank=True, null=True)
    link = models.CharField(max_length=255, blank=True, null=True)

    thumbnail_1900x500 = ImageSpecField(
        source='image', processors=[ResizeToFill(1900, 500)], format='JPEG', options={'quality': 80})
    thumbnail_1200x315 = ImageSpecField(
        source='image', processors=[ResizeToFill(1200, 315)], format='JPEG', options={'quality': 80})
    thumbnail_900x236 = ImageSpecField(
            source='image', processors=[ResizeToFill(1200, 315)], format='JPEG', options={'quality': 80})
    thumbnail_600x157 = ImageSpecField(
        source='image', processors=[ResizeToFill(1200, 315)], format='JPEG', options={'quality': 80})
