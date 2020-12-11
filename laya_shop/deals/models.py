from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from laya_shop.business.models import Business
from laya_shop.users.models import User
from django.contrib.postgres.indexes import HashIndex, BTreeIndex

# Create your models here.


class Deal(models.Model):
    business = models.ForeignKey(
        Business, on_delete=models.CASCADE, related_name="deals"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="deals")
    history = JSONField(blank=False, null=False)
    rating = models.IntegerField(null=True)

    class State(models.IntegerChoices):
        PENDING = 1, "Pendiente"
        REJECTED = 2, "Rechazado"
        CANCELLED = 3, "Cancelado"
        RESERVED = 4, "Reservado"
        SETTLED = 5, "Acordado"
        DELIVERY = 6, "En Delivery"
        DELIVERED = 7, "Entregado"
        RETURNED = 8, "Devuelto"
        CLOSED = 9, "Cerrado"

    class SentBy(models.IntegerChoices):
        USER = 1, "Usuario"
        BUSINESS = 2, "BUSINESS"

    sent_by = models.IntegerField(choices=SentBy.choices, default=SentBy.BUSINESS)
    status = models.IntegerField(choices=State.choices, default=State.PENDING)
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.created_at = timezone.now()

        super(Deal, self).save(*args, **kwargs)

    class Meta:
        indexes = [
            HashIndex(fields=["sent_by"]),
            HashIndex(fields=["status"]),
            HashIndex(fields=["created_at"]),
            BTreeIndex(fields=["created_at"]),
            BTreeIndex(fields=["status", "created_at"]),
        ]
