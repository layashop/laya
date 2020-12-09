from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django.db.models.signals import post_save
from django.dispatch import receiver
from push_notifications.models import WebPushDevice
import json
from laya_shop.deals.models import Deal
from .serializers import DealSerializer, DealBusinessSerializer, DealUserSerializer
from .filters import DealsFilters
from laya_shop.users.models import User


@receiver(signal=post_save, sender=Deal)
def handler_signal(sender, **kwargs):
    created = kwargs.get("created")
    deal = kwargs.get("instance")
    device = WebPushDevice.objects.all()
    message = {}
    if deal.sent_by == Deal.SentBy.BUSINESS:
        device.filter(user=deal.user)
        if created:
            message["message"] = "Tienes un nuevo Deal con " + deal.business.name
        else:
            message["message"] = "Se actualizo el Deal con " + deal.business.name

        if deal.status > Deal.State.SETTLED:
            deal_status = {6: "Delivery", 7: "Entregado"}.get(deal.status)
            message["message"] += " paso a " + deal_status
    else:
        users = deal.business.user.all()
        device.filter(user__pk__in=[user.id for user in users])

        if created:
            message["message"] = "Tienes un nuevo Deal con " + deal.user.name
        else:
            message["message"] = "Se actualizo el Deal con " + deal.user.nameStatus

    if created:
        message["title"] = "Nuevo Deal"
    else:
        message["title"] = "Se actualizo un acuerdo"
    response = device.send_message(json.dumps(message))
    print(response)


class DealViewSet(ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = DealsFilters

    def get_queryset(self):
        request_query_type = self.request.GET.get("type")
        print("query type ", request_query_type)
        related_name = {
            "user": "business",
            "business": "user",
        }.get(request_query_type)

        if related_name:
            return Deal.objects.select_related(related_name).all()
        return Deal.objects.select_related("user", "business").all()

    def get_serializer_class(self):
        request_query_type = self.request.GET.get("type")
        serializer = {
            "user": DealBusinessSerializer,
            "business": DealUserSerializer,
        }.get(request_query_type)
        print("serializer", serializer)
        if serializer:
            return serializer
        return DealSerializer
