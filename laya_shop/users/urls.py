from django.urls import path

from laya_shop.users.views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    user_deal_view,
    user_chat_view,
)

app_name = "users"
urlpatterns = [
    path("deals/", view=user_deal_view, name="deal"),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/chat/", view=user_chat_view, name="chats"),
    path("<str:username>/", view=user_detail_view, name="detail"),
]
