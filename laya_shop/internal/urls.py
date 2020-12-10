from django.urls import include, path
from .views import HomeView, ContactView
from django.contrib.sitemaps.views import sitemap

from .sitemaps import PostsSitemap

sitemaps = {
    'posts': PostsSitemap
}

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    path('sitemap', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('contact', ContactView.as_view(), name="contact"),
    path('contacto', ContactView.as_view(), name="contact")
]
