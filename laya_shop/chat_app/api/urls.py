from django.urls import path
from rest_framework.routers import DefaultRouter
from laya_shop.chat_app.api.views import ChatRoomViewSet, ChatRoomMessagesViewSet
from push_notifications.api.rest_framework import WebPushDeviceViewSet


app_name = "chat_app"

router = DefaultRouter()
router.register(r"chat-room", ChatRoomViewSet)
router.register(r"chat-message", ChatRoomMessagesViewSet)
router.register(r"device", WebPushDeviceViewSet)


urlpatterns = router.urls
