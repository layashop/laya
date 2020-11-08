from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register(r'preview', views.PostChatThumbnailViewSet)

app_name = "posts"
urlpatterns = [
    path("image/temp", views.BusinessTemporalImageView.as_view(), name="temp_image"),
    path(
        "image/temp/<pk>",
        views.BusinessTemporalDetailView.as_view(),
        name="temp_detail_image",
    ),
    path('', include(router.urls))
]
