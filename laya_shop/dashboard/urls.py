from django.urls import include, path
from .views import (
    index_view,
    post_list_view,
    post_detail_view,
    post_create_view,
    post_delete_view,
    chat_app_view,
    deals_view,
    profile_update_view
)


app_name = "dashboard"

urlpatterns = [
    path("", index_view, name="index"),
    path("posts", post_list_view, name="post_list"),
    path("posts/create", post_create_view, name="post_create"),
    path("posts/<int:pk>", post_detail_view, name="post_detail"),
    path("posts/<int:pk>/delete", post_delete_view, name="post_delete"),
    path("chat", chat_app_view, name="chat_app"),
    path("deals", deals_view, name="deals_list"),
    path("profile/", profile_update_view, name="profile_update")
]
