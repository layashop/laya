from django.utils.decorators import method_decorator
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from django.views.decorators.cache import cache_page
from django.core.cache import cache


from posts.filters import PostFilter
from posts.mixins import PostClassificationMixin
from posts.models import Post




# @method_decorator(cache_page(600), name="dispatch")
class PostList(PostClassificationMixin, ListView):
    model = Post
    template_name = 'posts/search.html'

    paginate_by = 20

    def get_queryset(self):
        cached = cache.get('pruebaaaaaaaaaa')
        if False:
            return cached
        else:
            queryset = self.model.objects.select_related('currency').prefetch_related('images')
            queryset = PostFilter(self.request.GET, queryset=queryset).qs
            # cache.set('pruebaaaaaaaaaa', queryset, 60)
            return queryset


post_list_view = PostList.as_view()


# @method_decorator(cache_page(600), name="dispatch")
class PostDetail(DetailView):
    model = Post
    template_name = 'posts/detail.html'

    def get_object(self):
        queryset = Post.objects.select_related('business', 'currency').prefetch_related('locations', 'subcategories__category')
        return get_object_or_404(queryset, pk=self.kwargs['pk'])



post_detail_view = PostDetail.as_view()
