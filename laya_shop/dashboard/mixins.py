from django.contrib.auth.mixins import (
    UserPassesTestMixin,
    AccessMixin,
    LoginRequiredMixin,
)
from django.shortcuts import get_object_or_404
from laya_shop.business.models import Business
from django.core.serializers import serialize


class DashboardPermissionsMixin(UserPassesTestMixin):
    login_url = "account_login"

    def test_func(self):
        return self.request.user.is_superuser or self.request.user.business.filter(
            slug=self.kwargs["business_slug"]
        )


class DashboardContextMixin:
    def get_context_data(self, **kwargs):
        context = super(DashboardContextMixin, self).get_context_data(**kwargs)
        context["business"] = get_object_or_404(
            Business, slug=self.kwargs["business_slug"]
        )
        #  No me devuelve el Id ._.
        # context["business_json"] = serialize(
        #     "json", [context["business"]], fields=("id", "slug")
        # )
        return context


class DashboardBaseMixin(LoginRequiredMixin, DashboardPermissionsMixin, DashboardContextMixin):
    pass
