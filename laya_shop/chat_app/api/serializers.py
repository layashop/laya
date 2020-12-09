from rest_framework.serializers import ModelSerializer

from laya_shop.users.api.serializers import SimpleUserSerializer
from laya_shop.business.models import Business
from laya_shop.chat_app.models import ChatRoom, ChatMessage


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
