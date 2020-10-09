from django.shortcuts import render
from django.views.generic import ListView
from posts.models import Post
from posts.filters import PostFilter
# Create your views here.



class PostList(ListView):
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


    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        context['filter'] = PostFilter(self.request.GET, queryset=self.get_queryset())
        return context

post_list_view = PostList.as_view()