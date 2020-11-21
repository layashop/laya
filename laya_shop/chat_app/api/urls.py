from django.urls import path
from rest_framework.routers import DefaultRouter
from chat_app.api.views import ChatRoomViewSet, ChatRoomMessagesViewSet


app_name = "chat_app"

router = DefaultRouter()
router.register(r"chat-room", ChatRoomViewSet)
router.register(r"chat-message", ChatRoomMessagesViewSet)


urlpatterns = router.urls
