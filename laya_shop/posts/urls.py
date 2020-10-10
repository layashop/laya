from django.urls import include, path
from .views import post_list_view
from django.views.generic.base import RedirectView

app_name="posts"

urlpatterns = [
    path('', RedirectView.as_view(pattern_name="posts:search")),
    path('search/', post_list_view, name="search")
]
