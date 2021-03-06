from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, RedirectView, UpdateView, TemplateView

from laya_shop.posts.models import Currency
from laya_shop.posts.serializers import CurrencySerializer

User = get_user_model()


class UserDealView(LoginRequiredMixin, TemplateView):
    template_name = "users/deals.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


user_deal_view = UserDealView.as_view()


class UserDetailView(LoginRequiredMixin, DetailView):

    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, UpdateView):

    model = User
    fields = ["name"]

    def get_success_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})

    def get_object(self):
        return User.objects.get(username=self.request.user.username)

    def form_valid(self, form):
        messages.add_message(
            self.request, messages.INFO, _("Infos successfully updated")
        )
        return super().form_valid(form)


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):

    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


class UserChatPage(LoginRequiredMixin, TemplateView):
    template_name = "users/user_chat.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['currencies'] = CurrencySerializer(Currency.objects.all(), many=True).data
        context["business"] = dict()
        return context


user_chat_view = UserChatPage.as_view()


class UserDealsPage(LoginRequiredMixin, TemplateView):
    template_name = "users/deals.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['currencies'] = CurrencySerializer(Currency.objects.all(), many=True).data
        return context


user_deals_view = UserDealsPage.as_view()
