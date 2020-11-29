from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView

from django.core.cache import caches
from .decorators import cache_on_auth

from posts.filters import PostFilter
from posts.mixins import PostClassificationMixin
from posts.models import Post, Category, SubCategory

cache = caches['default']


@method_decorator(cache_on_auth(60 * 60), name="dispatch")
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
            cache.set(cache_key, queryset, 60 * 60)
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
        queryset = Post.objects.select_related('business', 'currency').prefetch_related('locations',
                                                                                        'subcategories__category')
        slug: str = self.kwargs['business_slug']
        slug = slug[1:] if slug.startswith('@') else slug
        return get_object_or_404(queryset, pk=self.kwargs['pk'], business__slug=slug)


post_detail_view = PostDetail.as_view()


class CategoryDetail(DetailView):
    model = Category
    template_name = "posts/classification_detail.html"
    slug_field = "slug"
    slug_url_kwarg = "slug"
    context_object_name = "category"

    def get_object(self, queryset=None):
        category = Category.objects.prefetch_related('subcategories')
        return get_object_or_404(category, slug=self.kwargs['slug'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['posts'] = Post.objects.select_related('business').prefetch_related('images').all()[:6]
        context['subcategories'] = self.object.subcategories.all()
        context['highlight'] = Post.objects.prefetch_related('images').filter(subcategories__category=self.object,
                                                                              highlighted=True).distinct()
        context['subcategories_list'] = [
            {'subcategory': subcategory, 'posts': Post.objects.prefetch_related('images').filter(subcategories=subcategory).exclude(id__in=context['highlight'])[:6] }
            for subcategory in context['subcategories'][:3]]
        return context


category_detail_view = CategoryDetail.as_view()
