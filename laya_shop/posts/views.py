from django.shortcuts import render
from json import dumps
from django.shortcuts import reverse
from django.views.generic import ListView, DetailView
from posts.models import Post
from posts.filters import PostFilter
from posts.mixins import PostClassificationMixin
# Create your views here.



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


    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        posts = PostFilter(self.request.GET, queryset=self.get_queryset().prefetch_related('images', 'business'))
        context['filter'] = posts
        temp = []
    #     {
    #   id: 1,
    #   link: 'https://react-select.com/home',
    #   thumbnail: 'https://img.apmcdn.org/5fa5db97b1120778b49f1b4488f613caf31e4ec4/uncropped/5355be-splendid-table-honey-filipfoto-istock-gettyimagesplus-505523726-lede-0.jpg',
    #   title: 'Miel',
    #   price: 120.45,
    #   discount: 20,
    #   discountedPrice: 96.36,
    #   promotion: false,
    #   new: true,
    #   description: 'Lorem impsum lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elit',
    #   user: 'Jose Pereira S.A.',
    #   state: 1,
    # }
        for post in posts.qs:
            temp.append(
                dict(
                    id=post.pk,
                    link=reverse('posts:detail', args=(post.pk,)),
                    thumbnail=post.images.first().image.url,
                    title=post.title,
                    price=post.price,
                    discount=post.discount,
                    discountedPrice=post.final_price,
                    promotion=post.promo,
                    description=post.description,
                    user=post.business.name,
                    state=1
                )
            )
        context['json_products'] = dumps(temp)
        return context

post_list_view = PostList.as_view()



class PostDetail(DetailView):
    model = Post
    template_name = 'posts/detail.html'


post_detail_view = PostDetail.as_view()
