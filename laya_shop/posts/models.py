from django.db import models
from business.models import Business
from users.models import User
from django.utils import timezone
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50)
    banner = models.ImageField(verbose_name='Banner', upload_to='categories', null=True, blank=True)

    def __str__(self):
        return self.name






class Post(models.Model):
    # BASICS
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(null=True)
    modified_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=200, null=True)

    price = models.FloatField()
    discount = models.PositiveIntegerField(null=True, blank=True)
    # <<<<<<<<<<<<<<<<

    # KARMA
    # karma_points = models.IntegerField(null=True)  # Maybe ?
    # <<<<<<<<<<<<<<<<

    # POST STATUS
    ACTIVE = 'AC'
    INACTIVE = 'IN'
    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive')
    ]
    status = models.CharField(
        max_length=2, choices=STATUS_CHOICES, default=ACTIVE)  # PARA MIENTRAS
    # <<<<<<<<<<<<<<<<

    # POST CLASSIFICATION
    ARTICLE = 'AR'
    SERVICE = 'SR'
    CLASSIFICATION_CHOICES = [
        (ARTICLE, 'Article'),
        (SERVICE, 'Service')
    ]
    classification = models.CharField(
        max_length=2, choices=CLASSIFICATION_CHOICES, default=ARTICLE)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    # tags = models.ManyToManyField(Tag, blank=True)
    # <<<<<<<<<<<<<<<<

    # ETC
    upvotes = models.IntegerField(default=0)
    # reports = models.ManyToManyField(
    #     User, through='Report', related_name='reports')  # Esta raro esto
    # departaments = models.ManyToManyField(Department, through='PostDepartment')
    last_confirmation = models.DateTimeField(null=True, blank=True)  # Boton de actualizado
    # <<<<<<<<<<<<<<<<
    def __str__(self):
        return self.title
    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
            self.modified_at = timezone.now()
        else:
            self.modified_at = timezone.now()

        super(Post, self).save(*args, **kwargs)


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='posts', null=True, blank=True)
    alternative_text = models.CharField(max_length=100)