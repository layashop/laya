from django.urls import path, re_path
from .views import post_list_view, post_detail_view, category_detail_view
from django.views.generic.base import RedirectView

app_name = "posts"

urlpatterns = [
    path('posts/', RedirectView.as_view(pattern_name="posts:search")),
    path('posts/search/', post_list_view, name="search"),
    path('category/<slug>/', category_detail_view, name="category_detail"),
    re_path(r'^(?P<business_slug>[-_\w]+)/(?P<pk>\d+)-(?P<post_slug>[(\w)|(\-)]*)/$', post_detail_view, name="detail"),
    path('<business_slug>/<pk>', post_detail_view, name="detail_only_pk"),

]
