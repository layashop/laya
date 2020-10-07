from django.urls import include, path
from .views import (
    index_view, 
    post_list_view, 
    post_detail_view, 
    post_create_view, 
    post_delete_view
)


app_name = "dashboard"

urlpatterns = [
    path('', index_view, name="index"),
    path('posts', post_list_view, name="post_list"),
    path('posts/create', post_create_view, name="post_create"),
    path('posts/<int:pk>', post_detail_view, name="post_detail"),
    path('posts/<int:pk>/delete', post_delete_view, name="post_delete")
] 
