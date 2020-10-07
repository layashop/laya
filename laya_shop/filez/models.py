from django.db import models
# from business.models import Business
from posts.models import Post
from .utils import business_directory_files
import os
# Create your models here.
from django.db.models.signals import post_delete
from django.dispatch import receiver



class BusinessImage(models.Model):
    business = models.ForeignKey("business.Business", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=business_directory_files)
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.SET_NULL, related_name="images")
    is_valid = models.BooleanField(default=False)
    alternative = models.CharField(max_length=200, null=True, blank=True)
    def filename(self):
        return os.path.basename(self.image.name)
    def __str__(self):
        if self.post:
            return "%s %s" % (self.post, self.pk)
        else:
            return "%s" % (self.pk)

class BusinessImageThumbnails(models.Model):
    business_image = models.OneToOneField(BusinessImage, related_name="thumbs", on_delete=models.CASCADE)
    thumb_200x200 = models.ImageField()


@receiver(models.signals.post_delete, sender=BusinessImage)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `BusinessImage` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            print('removing image from filesystem')
            os.remove(instance.image.path)