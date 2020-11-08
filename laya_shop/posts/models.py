import datetime
from django.db import models
from random import randint
from django.contrib.postgres.fields import JSONField, ArrayField
from business.models import Business
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill
from users.models import User
from django.utils.text import slugify
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
from .utils import business_directory_files
import os


from django.dispatch import receiver

class Category(models.Model):
    name = models.CharField(max_length=50, null=False, blank=False, unique=True)
    banner = models.ImageField(verbose_name='Banner', upload_to='categories', null=True, blank=True)
    slug = models.SlugField(null=False, blank=True)

    thumbnail_640x100 = ImageSpecField(
        source='banner', processors=[ResizeToFill(640, 150)], format='JPEG', options={'quality': 80})
    thumbnail_768x200 = ImageSpecField(
        source='banner', processors=[ResizeToFill(768, 200)], format='JPEG', options={'quality': 80})
    thumbnail_1800x300 = ImageSpecField(
        source='banner', processors=[ResizeToFill(1800, 300)], format='JPEG', options={'quality': 80})
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Category, self).save(*args, **kwargs)


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    name = models.CharField(max_length=50)
    banner = models.ImageField(verbose_name="Banner", upload_to="subcategories", null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Subcategory"
        verbose_name_plural = "Subcategories"


class Currency(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    symbol = models.CharField(max_length=10, blank=False, null=False)
    rate = models.FloatField(blank=False, null=False)
    iso_code = models.CharField(max_length=5, blank=False, null=False)

    def __str__(self):
        return self.name


class Locations(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)

    def __str__(self):
        return self.name


def random_score():
    return randint(1, 5)


class Post(models.Model):

    def __init__(self, *args, **kwargs):
        super(Post, self).__init__(*args, **kwargs)

        #Para verificar si cambió el precio, si es asi, se realiza la actualizacion del campo base_price
        self.__original_price = self.price

    # BASICS
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(null=True)
    modified_at = models.DateTimeField(null=True)
    title = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=200, null=True)
    attributes = JSONField(null=True, blank=True)
    price = models.FloatField(null=False, blank=False)
    base_price = models.FloatField(null=False, blank=True)
    discount = models.PositiveIntegerField(null=True, blank=True,
                                           validators=[MinValueValidator(0), MaxValueValidator(99)])
    # <<<<<<<<<<<<<<<<
    highlighted = models.BooleanField(default=False)
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
    currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, blank=False)

    score = models.IntegerField(default=random_score)

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
    locations = models.ManyToManyField(Locations, related_name="posts")
    classification = models.CharField(
        max_length=2, choices=CLASSIFICATION_CHOICES, default=ARTICLE)

    subcategories = models.ManyToManyField(SubCategory, related_name="posts")
    tags = ArrayField(
        models.CharField(max_length=50), blank=True, null=True)
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
            return round(self.price - (self.price * (self.discount / 100)), 2)
        return self.price

    def __str__(self):
        return self.title

    @property
    def is_new(self):
        return self.created_at >= timezone.now() - datetime.timedelta(days=7)

    def save(self, *args, **kwargs):

        if not self.id:
            self.created_at = timezone.now()
            self.modified_at = timezone.now()
            self.base_price = round((self.price / self.currency.rate), 3)
        else:
            #Si cambió, recalcular
            if self.__original_price != self.price:
                self.base_price = round((self.price / self.currency.rate), 3)

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
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name="additional_attributes")
    value = JSONField()


class BusinessImage(models.Model):

    thumbnail_200x200 = ImageSpecField(
        source='image', processors=[ResizeToFill(200, 200)], format='JPEG', options={'quality': 80})
    thumbnail_250x250 = ImageSpecField(
        source='image', processors=[ResizeToFill(250, 250)], format='JPEG', options={'quality': 80})
    thumbnail_512x512 = ImageSpecField(
        source='image', processors=[ResizeToFill(512, 512)], format='JPEG', options={'quality': 80})
    # thumbnail_1000 = ImageSpecField(
    #     source='image', processors=[ResizeToFill(width=1000, upscale=False)], format='JPEG', options={'quality': 80})

    business = models.ForeignKey("business.Business", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=business_directory_files)
    post = models.ForeignKey(Post, null=True, blank=True, on_delete=models.SET_NULL, related_name="images")
    is_valid = models.BooleanField(default=False)
    alternative = models.CharField(max_length=200, null=True, blank=True)

    def filename(self):
        return os.path.basename(self.image.name)

    def images_url(self):
        return {
            '200x200': self.thumbnail_200x200.url,
            '250x250': self.thumbnail_250x250.url,
            '512x512': self.thumbnail_512x512.url
        }
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
