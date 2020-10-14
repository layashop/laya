from django_filters import rest_framework as filters
from posts.models import Post


class PostFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")
    category = filters.NumberFilter(method="filter_category")
    location = filters.NumberFilter(field_name='locations')
    # sort = filters.NumberFilter(method='filter_sort_by')
    sort = filters.OrderingFilter(
        fields=(
            ('-created_at', '1'),
            ('created_at', '2')
        )
    )

    def filter_category(self, queryset, name, value):
        print('HIIIIIIIIIIIIIIIIIII')
        return queryset.filter(subcategories__category_id=value).distinct()



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
        ]
