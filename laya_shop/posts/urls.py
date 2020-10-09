from django.urls import include, path
from .views import post_list_view

app_name="posts"

urlpatterns = [
    path("search", post_list_view, name="search")
]