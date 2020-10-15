from django.urls import path, include
from .views import BusinessTemporalDetailView, BusinessTemporalImageView

app_name = "posts"
urlpatterns = [
    path("image/temp", BusinessTemporalImageView.as_view(), name="temp_image"),
    path(
        "image/temp/<pk>",
        BusinessTemporalDetailView.as_view(),
        name="temp_detail_image",
    ),
]
