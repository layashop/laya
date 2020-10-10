import django_filters
from posts.models import Post

class PostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(field_name='subcategories__category')
    class Meta:
        model = Post
        fields = ['title', 'description', 'subcategories', 'id', 'subcategories__category']
