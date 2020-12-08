from django.db import models
from django.utils.translation import gettext as _
from users.models import User
from django.utils import timezone
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
# Create your models here.


class Business(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    address = models.CharField(_("Dirección"), max_length=250, null=True, blank=True)
    description = models.CharField(_("Descripcion"), max_length=200, null=True, blank=True)
    cover_image = models.ImageField(_("Banner"), null=True, blank=True)

    profile_image = models.ImageField(_("Foto de perfil"), null=True, blank=True, help_text="Recomendamos que la imagen sea de relacion de aspecto 1:1")
    thumbnail_512x512 = ImageSpecField(
        source='profile_image', processors=[ResizeToFill(512, 512)], format='JPEG')
    thumbnail_256x256 = ImageSpecField(
        source='profile_image', processors=[ResizeToFill(256, 256)], format='JPEG')
    thumbnail_128x128 = ImageSpecField(
        source='profile_image', processors=[ResizeToFill(128, 128)], format='JPEG')
    thumbnail_64x64 = ImageSpecField(
        source='profile_image', processors=[ResizeToFill(64, 64)], format='JPEG')

    user = models.ManyToManyField(User, through="UserBusiness", related_name="business")
    created_at = models.DateTimeField(null=True, blank=True)
    slug = models.SlugField(null=False, blank=False, unique=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
        # else:
        #    self.modified_at = timezone.now()
        super(Business, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "bussiness"


class UserBusiness(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    ADMIN_ROLE = "AD"
    ROLE_CHOICES = [(ADMIN_ROLE, "Administrador")]
    role = models.CharField(max_length=2, choices=ROLE_CHOICES)


# ANALIZAR ESTA WEA
# class BusinessExtra(models.Model):
#     business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='extras')
#     FACEBOOK = 'FB'
#     INSTAGRAM = 'IG'
#     WHATSAPP = 'WA'
#     WEBSITE = 'WW'
#     LINKS_CHOICES = [
#         (FACEBOOK, 'Facebook'),
#         (INSTAGRAM, 'Instagram'),
#         (WHATSAPP, 'WhatsApp'),
#         (WEBSITE, 'Página web')
#     ]
#     link_type = models.CharField(max_length=2,choices=LINKS_CHOICES)
#     link = models.CharField(max_length=100)
