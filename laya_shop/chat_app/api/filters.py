from django_filters import rest_framework as filters
from chat_app.models import ChatRoom


class ChatRoomFilters(filters.FilterSet):
    slug = filters.CharFilter(lookup_expr="iexact", field_name="slug")
    business_slug = filters.CharFilter(
        lookup_expr="iexact", field_name="business__slug"
    )
    user = filters.NumberFilter(lookup_expr="iexact", field_name="user__pk")


class ChatRoomMessageFilters(filters.FilterSet):
    slug = filters.CharFilter(lookup_expr="iexact", field_name="chat_room__slug")
