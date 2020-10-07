from django.urls import include, path
from .views import HomeView, ContactView

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('contact', ContactView.as_view(), name="contact"),
    path('contacto', ContactView.as_view(), name="contact") # temporal xd
]
