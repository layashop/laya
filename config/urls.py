from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views import defaults as default_views
from django.views.generic import RedirectView
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    # path("", TemplateView.as_view(template_name="pages/home.html"), name="home"),
    # path(
    #     "about/", TemplateView.as_view(template_name="pages/about.html"), name="about"
    # ),
    # Django Admin, use {% url 'admin:index' %}
    path(settings.ADMIN_URL, admin.site.urls),
    # User management
    path("search", RedirectView.as_view(pattern_name="posts:search", permanent=True)),
    path("", include("laya_shop.posts.urls", namespace="posts")),
    path("accounts/", include("allauth.urls")),
    path("profile/", include("laya_shop.users.urls")),
    path(
        "<str:business_slug>/dashboard/",
        include("laya_shop.dashboard.urls", namespace="dashboard"),
    ),
    path("", include("laya_shop.internal.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns = [
    # API base url
    # path("api/", include("config.api_router")),
    path("api/posts/", include("laya_shop.posts.api.urls", namespace="api_posts")),
    path(
        "api/chat-app/",
        include(
            "laya_shop.chat_app.api.urls",
        ),
    ),
    path("api/deals/", include("laya_shop.deals.api.urls", namespace="api_chat_app")),
    # DRF auth token
    path("auth-token/", obtain_auth_token),
] + urlpatterns

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
