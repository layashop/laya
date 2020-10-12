from rest_framework.viewsets import ModelViewSet
from django_filters import rest_framework as filters
from chat_app.models import ChatRoom
from chat_app.api.serializers import ChatRoomSerializer
from chat_app.api.filters import ChatRoomFilters


class ChatRoomViewSet(ModelViewSet):
    model = ChatRoom
    serializar_class = ChatRoomSerializer
    queryset = ChatRoom.objects.all()
    filter_backends = filters.DjangoFilterBackend
    filter_class = ChatRoomFilters
