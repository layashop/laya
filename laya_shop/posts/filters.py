from django_filters import rest_framework as filters
from posts.models import Post


class PostFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")
    category = filters.CharFilter(field_name="subcategories__category")
    location = filters.NumberFilter(field_name='locations')
    sort = filters.NumberFilter(method='sort_by')
    # 1 fecha mas reciente
    # 2 fecha mas antigua
    def sort_by(self, queryset, name, value):
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
            "subcategories__category",
            'state',

        ]
