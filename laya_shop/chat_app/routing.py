from channels.routing import URLRouter, ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from laya_shop.chat_app.urls import urlspatterns


websocket_application = ProtocolTypeRouter(
    {"websocket": AuthMiddlewareStack(URLRouter(urlspatterns))}
)
