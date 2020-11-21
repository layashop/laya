from rest_framework.serializers import ModelSerializer

from users.api.serializers import SimpleUserSerializer
from business.models import Business
from chat_app.models import ChatRoom, ChatMessage


class BusinessSerializer(ModelSerializer):
    class Meta:
        model = Business
        fields = "__all__"


class ChatRoomSerializer(ModelSerializer):
    user = SimpleUserSerializer()
    business = BusinessSerializer()

    class Meta:
        model = ChatRoom
        fields = "__all__"


class ChatRoomUserSerializer(ModelSerializer):
    user = SimpleUserSerializer()

    class Meta:
        model = ChatRoom
        fields = "__all__"


class ChatRoomBusinessSerializer(ModelSerializer):
    business = BusinessSerializer()

    class Meta:
        model = ChatRoom
        fields = "__all__"


class ChatMessageSerializer(ModelSerializer):
    class Meta:
        fields = "__all__"
        model = ChatMessage
