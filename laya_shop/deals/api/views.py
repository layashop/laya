from rest_framework.viewsets import ModelViewSet
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters

from deals.models import Deal
from .serializers import DealSerializer, DealBusinessSerializer, DealUserSerializer
from .filters import DealsFilters


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
        if serializer:
            return serializer
        return DealSerializer
