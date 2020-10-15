from django.urls import path
from chat_app.api.views import ChatRoomViewSet

app_name = "chat_app"

urlpatterns = [
    path("chat-room/", ChatRoomViewSet, name="chat_room_api"),
]