from django.contrib.auth.mixins import (
    UserPassesTestMixin,
    AccessMixin,
    LoginRequiredMixin,
)
from django.shortcuts import get_object_or_404
from laya_shop.business.models import Business
from laya_shop.posts.serializers import SubcategorySerializer, CurrencySerializer, CategorySerializer
from laya_shop.posts.models import Category, SubCategory, Currency
from django.core.cache import caches

cache = caches["default"]
DASHBOARD_BASE_MIXIN_CACHE_KEY = 'DASHBOARD_BASE_MIXIN'


class DashboardBaseMixin(LoginRequiredMixin, UserPassesTestMixin):

    """
    Este es un mixin que se encarga de leer el business_slug de la url, busca en la db si existe,
    si existe, se asigna a la propiedad business.
    Luego, se verifica que el usuario tenga permisos para acceder al dashboard del business
    btw, todavia no estamos manejando permisos por TIPO de usuario en un business, por el momento si es staff,
    tiene permiso total.

    Y por ultimo, se añade el business al context

    (las funciones abajo estan en ordenadas en el mismo orden en el que se van a ejecutar, asi es mas facil entender
    que pasa xd)
    """

    login_url = "account_login"

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.business = None

    def dispatch(self, request, *args, **kwargs):
        self.business = get_object_or_404(Business, slug=kwargs["business_slug"])
        return super().dispatch(request, *args, **kwargs)

    def test_func(self):
        return self.request.user.is_superuser or self.business.staff.filter(user=self.request.user).exists()

    def get_context_data(self, **kwargs):

        cached_data = cache.get(DASHBOARD_BASE_MIXIN_CACHE_KEY)
        if cached_data:
            return cached_data
        else:
            context = super().get_context_data(**kwargs)
            context["business"] = self.business

            subcategories = SubCategory.objects.all()
            context["subcategories"] = subcategories
            context["json_subcategories"] = SubcategorySerializer(subcategories, many=True).data

            categories = Category.objects.all()
            context["categories"] = categories
            context["json_categories"] = CategorySerializer(categories, many=True).data

            currencies = Currency.objects.all()
            context["json_currencies"] = CurrencySerializer(currencies, many=True).data
            cache.set(DASHBOARD_BASE_MIXIN_CACHE_KEY, context, 60 * 60)
            return context
