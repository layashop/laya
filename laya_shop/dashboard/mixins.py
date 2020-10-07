from django.contrib.auth.mixins import UserPassesTestMixin, AccessMixin, LoginRequiredMixin


class DashboardPermissionsMixin(LoginRequiredMixin, UserPassesTestMixin ):
    login_url = 'account_login'
    def test_func(self):
        return self.request.user.is_superuser or self.request.user.business.filter(slug=self.kwargs['business_slug'])
        