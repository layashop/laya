import django_filters
from posts.models import Post

class PostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = Post
        fields = ['title', 'description', 'subcategories', 'id', 'subcategories__category']