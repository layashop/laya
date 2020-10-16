from django.utils.decorators import method_decorator
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from django.views.decorators.cache import cache_page
from django.core.cache import caches
from .decorators import  cache_on_auth

from posts.filters import PostFilter
from posts.mixins import PostClassificationMixin
from posts.models import Post

cache = caches['default']

@method_decorator(cache_on_auth(60*60), name="dispatch")
class PostList(PostClassificationMixin, ListView):
    model = Post
    template_name = 'posts/search.html'

    paginate_by = 20

    def build_cache_key(self):
        cache_key = 'search_'
        for key, value in self.request.GET.items():
            cache_key += "%s%s_" % (key, value)
        return cache_key

    def get_queryset(self):
        cache_key = self.build_cache_key()
        cached_data = cache.get(cache_key)
        if cached_data:
            print("CACHEADO!")
            return cached_data
        else:
            print("NO CACHEADO!")
            queryset = self.model.objects.select_related('currency').prefetch_related('images')
            queryset = PostFilter(self.request.GET, queryset=queryset, request=self.request).qs
            cache.set(cache_key, queryset, 60*60)
            return queryset


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_cache_name'] = self.build_cache_key()
        return context

post_list_view = PostList.as_view()


# @method_decorator(cache_page(600), name="dispatch")
class PostDetail(DetailView):
    model = Post
    template_name = 'posts/detail.html'

    def get_object(self):
        queryset = Post.objects.select_related('business', 'currency').prefetch_related('locations', 'subcategories__category')
        return get_object_or_404(queryset, pk=self.kwargs['pk'])



post_detail_view = PostDetail.as_view()
