from django.db import models
from business.models import Business
from users.models import User
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.

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
