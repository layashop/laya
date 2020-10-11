from django.urls import re_path
from chat_app.ws_consumer import WSConsumer

app_name = "chat_app"

# URLS del WebSocket
urlspatterns = [
    re_path(r"ws/chat/(?P<emprendedor>\w+)/$", WSConsumer),
    re_path(r"ws/chat/(?P<emprendedor>\w+)/(?P<user_id>\w+)/$", WSConsumer),
]
# ws/chat/(?P<emprendedor>\w+)/
# ws/chat/lobby/ ws/chat/lobby/1/
# ws/chat/(?P<emprendedor>\w+)/(?P<user_id>\w+)/$'