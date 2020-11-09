from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin
from django_filters import rest_framework as filters
from chat_app.models import ChatRoom, ChatMessage
from chat_app.api.serializers import (
    ChatRoomSerializer,
    ChatRoomUserSerializer,
    ChatRoomBusinessSerializer,
    ChatMessageSerializer,
)
from chat_app.api.filters import ChatRoomFilters, ChatRoomMessageFilters


class ChatRoomViewSet(ModelViewSet):
    serializer_class = ChatRoomSerializer
    queryset = ChatRoom.objects.select_related("user").all()
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = ChatRoomFilters

    def get_queryset(self):
        request_query_type = self.request.GET.get("type")
        print(request_query_type)
        related_name = {
            "user": "business",
            "business": "user",
        }.get(request_query_type)

        if related_name:
            return ChatRoom.objects.select_related(related_name).all()
        return ChatRoom.objects.select_related("user", "business").all()

    def get_serializer_class(self):
        request_query_type = self.request.GET.get("type")
        serializer = {
            "user": ChatRoomBusinessSerializer,
            "business": ChatRoomUserSerializer,
        }.get(request_query_type)
        if serializer:
            return serializer
        return ChatRoomSerializer


class ChatRoomMessagesViewSet(ListModelMixin, GenericViewSet):
    serializer_class = ChatMessageSerializer
    queryset = ChatMessage.objects.all().order_by("send_date")
    filter_backends = [filters.DjangoFilterBackend]
    filter_class = ChatRoomMessageFilters
