from rest_framework.serializers import ModelSerializer
from chat_app.models import ChatRoom, ChatMessage


class ChatRoomSerializer(ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = "__all__"


class ChatMessageSerializer(ModelSerializer):
    class Meta:
        fields = "__all__"
        model = ChatMessage