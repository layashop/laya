from django.urls import include, path
from .views import BusinessTemporalImageView, BusinessTemporalDetailView


app_name = "filez"

urlpatterns = [
    path('post/temp/', BusinessTemporalImageView.as_view(), name="post_temp_image"),
    path('post/temp/<pk>', BusinessTemporalDetailView.as_view(), name="post_temp_detail_image")
] 
