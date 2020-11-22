from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from business.models import Business
from users.models import User

# Create your models here.


class Deal(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='deals')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='deals')
    history = JSONField(blank=False, null=False)

    class State(models.IntegerChoices):
        PENDING = 1, 'Pendiente'
        REJECTED = 2, 'rechazado'
        CANCELLED = 3, 'Cancelado'
        RESERVED = 4, 'Reservado'
        SETTLED = 5, 'Acordado'
        DELIVERY = 6, 'Delivery'
        DELIVERED = 7, 'Entregado'
        RETURNED = 8, 'Devuelto'

    status = models.IntegerField(choices=State.choices, default=State.PENDING)
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()

        super(Deal, self).save(*args, **kwargs)

