from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from django.db.models.signals import post_save
from django.dispatch import receiver
from push_notifications.models import WebPushDevice

from deals.models import Deal
from .serializers import DealSerializer, DealBusinessSerializer, DealUserSerializer
from .filters import DealsFilters


@receiver(signal=post_save, sender=Deal)
def handler_signal(sender, **kwargs):
    print(kwargs)
    print("calledd")
    device = WebPushDevice.objects.all()
    device.send_message(
        message={"title": "You Got a new message", "body": "Message from"}
    )


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
