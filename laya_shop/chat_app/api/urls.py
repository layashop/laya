from django.urls import path
from rest_framework.routers import DefaultRouter
from chat_app.api.views import ChatRoomViewSet


app_name = "chat_app"

router = DefaultRouter()
router.register(r"chat-room", ChatRoomViewSet)

urlpatterns = router.urls