from django_filters import rest_framework as filters
from posts.models import Post


class PostFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr="icontains")
    category = filters.CharFilter(field_name="subcategories__category")

    class Meta:
        model = Post
        fields = [
            "title",
            "description",
            "subcategories",
            "id",
            "subcategories__category",
        ]
