from django.db import models

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50)
    banner = models.ImageField(verbose_name='Banner', upload_to='categories', null=True, blank=True)

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'categoria'
