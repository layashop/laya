from django.urls import re_path
from chat_app.ws_consumer import WSConsumer

app_name = "chat_app"

# URLS del WebSocket
urlspatterns = [re_path(r"ws/chat/(?P<emprendedor>\w+)/$", WSConsumer)]
