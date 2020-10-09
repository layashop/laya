from django.db import models
from users.models import User
from django.utils import timezone
# Create your models here.


class Business(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    address = models.CharField(max_length=250, null=True, blank=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    cover_image = models.ImageField(null=True, blank=True)
    profile_image = models.ImageField(null=True, blank=True)
    user = models.ManyToManyField(User, through='UserBusiness', related_name='business')
    created_at = models.DateTimeField(null=True, blank=True)
    slug = models.SlugField(null=False, blank=False, unique=True)
    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
        #else:
        #    self.modified_at = timezone.now()
        super(Business, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'bussiness'


class UserBusiness(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    ADMIN_ROLE = 'AD'
    ROLE_CHOICES = [
        (ADMIN_ROLE, 'Administrador')
    ]
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



