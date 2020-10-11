from django.db import models
from django.contrib.postgres.fields import JSONField, ArrayField
from business.models import Business
from users.models import User
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
from .utils import business_directory_files
import os

from django.db.models.signals import post_delete
from django.dispatch import receiver
from laya_shop.utils.thumbnails import ThumbModel


class Category(models.Model):
    name = models.CharField(max_length=50)
    banner = models.ImageField(verbose_name='Banner', upload_to='categories', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    name = models.CharField(max_length=50)
    banner = models.ImageField(verbose_name="Banner", upload_to="subcategories", null=True, blank=True)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name = "Subcategory"
        verbose_name_plural = "Subcategories"


class Post(models.Model):
    # BASICS
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(null=True)
    modified_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=200, null=True)

    price = models.FloatField()
    discount = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(99)])
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

    CURRENCY_USD = 'USD'
    CURRENCY_NIO = 'NIO'
    CURRENCY_CHOICES = [
        (CURRENCY_NIO, 'Córdobas'),
        (CURRENCY_USD, 'Dólares')
    ]
    currency = models.CharField(max_length=3, default=CURRENCY_USD, choices=CURRENCY_CHOICES)

    class State(models.IntegerChoices):
        NEW = 1, 'Nuevo'
        USED = 2, 'Usado'
        BY_REQUEST = 3, 'Por pedido'

    state = models.IntegerField(choices=State.choices, default=State.NEW)

    class Delivery(models.IntegerChoices):
        Delivery = 1, 'Entrega a domicilio'
        PICK_UP = 2, 'Pick-up'
        MEETING = 3, 'Punto de encuentro'

    delivery = models.IntegerField(choices=Delivery.choices, default=Delivery.Delivery)

    classification = models.CharField(
        max_length=2, choices=CLASSIFICATION_CHOICES, default=ARTICLE)
    subcategories = models.ManyToManyField(SubCategory, related_name="posts")
    # tags = models.ManyToManyField(Tag, blank=True)
    # <<<<<<<<<<<<<<<<
    promo = models.CharField(max_length=150, null=True, blank=True)

    # ETC
    upvotes = models.IntegerField(default=0)
    # reports = models.ManyToManyField(
    #     User, through='Report', related_name='reports')  # Esta raro esto
    # departaments = models.ManyToManyField(Department, through='PostDepartment')
    last_confirmation = models.DateTimeField(null=True, blank=True)  # Boton de actualizado

    @property
    def final_price(self):
        if self.discount:
            return round(self.price - ( self.price * (self.discount / 100)), 2)
        return self.price

    @property
    def currency_symbol(self):
        return {
            self.CURRENCY_USD: '$',
            self.CURRENCY_NIO: 'C$'
        }[self.currency]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()
            self.modified_at = timezone.now()
        else:
            self.modified_at = timezone.now()

        super(Post, self).save(*args, **kwargs)


class Unit(models.Model):
    values = ArrayField(
        models.CharField(max_length=10)
    )


class AdditionalAttribute(models.Model):

    STRING = 'STRING'
    MEASURE = 'MEASURE'
    DIMENSION = 'DIMENSION'
    LIST = 'LIST'
    COLOR = 'COLOR'

    TYPE_CHOICES = [
        (STRING, 'String'),
        (MEASURE, 'Measure'),
        (DIMENSION, 'Dimension'),
        (LIST, 'List'),
        (COLOR, 'Color')
    ]

    label = models.CharField(max_length=40)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    units = models.ForeignKey(Unit, null=True, on_delete=models.SET_NULL)


class AdditionalAttributeCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    additional_attribute = models.ForeignKey(AdditionalAttribute, on_delete=models.CASCADE)


class AdditionalAttributesValue(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    value = JSONField()


class BusinessImage(models.Model, ThumbModel):
    THUMBS_SIZES = ["300", "350x350"]
    THUMBS_FIELD = 'image'
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
            return "%s" % self.pk


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

