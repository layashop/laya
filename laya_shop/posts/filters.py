from django_filters import rest_framework as filters
from posts.models import Post, Currency

DEFAULT_CURRENCY_ISO_CODE = "NIO"

class PostFilter(filters.FilterSet):
    search = filters.CharFilter(field_name='title', lookup_expr="icontains")
    category = filters.NumberFilter(method="filter_category")
    location = filters.NumberFilter(field_name='locations')
    state = filters.NumberFilter()
    tags = filters.CharFilter(lookup_expr='icontains')
    subcategory = filters.NumberFilter(field_name='subcategories')
    lowPrice = filters.NumberFilter(method='filter_base_price')
    highPrice = filters.NumberFilter(method='filter_base_price')
    # sort = filters.NumberFilter(method='filter_sort_by')
    sort = filters.OrderingFilter(
        fields=(
            ('-created_at', '1'),
            ('created_at', '2')
        )
    )

    def filter_category(self, queryset, name, value):
        return queryset.filter(subcategories__category_id=value).distinct()

    def filter_base_price(self, queryset, name, value):
        currency_iso = self.request.GET.get('currency')
        op = {
            'lowPrice': 'base_price__gte',
            'highPrice': 'base_price__lte'
        }.get(name, None)

        try:
            currency = Currency.objects.get(iso_code=currency_iso if currency_iso else DEFAULT_CURRENCY_ISO_CODE)
        except Currency.DoesNotExist:
            currency = None

        if currency and op:
            return queryset.filter(**{
                op: round((float(value) / currency.rate), 1)
            })
        return queryset


    def filter_sort_by(self, queryset, name, value):
        # import pdb; pdb.set_trace()
        return {
            1: queryset.order_by('-created_at'),
            2: queryset.order_by('created_at')
        }.get(value, queryset)

    class Meta:
        model = Post
        fields = [
            "title",
            "description",
            "subcategories",
            "id",
            'state',
            'delivery',
            'tags'
        ]
