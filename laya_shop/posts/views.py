from django.shortcuts import render, get_object_or_404
from json import dumps
from django.shortcuts import reverse
from django.views.generic import ListView, DetailView
from posts.models import Post
from django.db.models import Prefetch
from posts.filters import PostFilter
from posts.mixins import PostClassificationMixin
# Create your views here.
from posts.models import Locations


class PostList(PostClassificationMixin, ListView):
    model = Post
    template_name = 'posts/search.html'
    # ordering = ['modified_at']
    # filter
    paginate_by = 20
    # def get_template_names(self):
    #     return {
    #         'gallery': 'dashboard/post_list_gallery.html'
    #     }.get(self.request.GET.get('view'), 'dashboard/post_list.html')

    # get_queryset se ejecuta antes de get_context_data
    # def get_queryset(self):
    #     qs = self.model.objects.filter().prefetch_related('images')
    #     return PostFilter(self.request.GET, queryset=qs).qs

    # def get_queryset(self):
    #     return

    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        posts = PostFilter(self.request.GET, queryset=self.get_queryset().select_related('currency').prefetch_related('images', 'business'))
        context['filter'] = posts
        return context

post_list_view = PostList.as_view()



class PostDetail(DetailView):
    model = Post
    template_name = 'posts/detail.html'

    def get_object(self):
        queryset = Post.objects.select_related('business', 'currency').prefetch_related('locations', 'subcategories__category')
        return get_object_or_404(queryset, pk=self.kwargs['pk'])



post_detail_view = PostDetail.as_view()
