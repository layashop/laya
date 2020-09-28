from django.urls import include, path
from .views import HomeView, ContactView
urlpatterns = [
    path('', HomeView.as_view(), name="home")
]
