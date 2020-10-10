from channels.routing import URLRouter, ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from chat_app.urls import urlspatterns

websocket_application = ProtocolTypeRouter(
    {"websocket": AuthMiddlewareStack(URLRouter(urlspatterns))}
)
