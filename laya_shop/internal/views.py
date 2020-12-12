# Create your views here.
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView
from laya_shop.posts.models import Category, Post
from laya_shop.internal.models import HomeSlide


@method_decorator(cache_page(60*15), name='dispatch')
class HomeView(TemplateView):
    template_name = 'pages/home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['slides'] = HomeSlide.objects.all()
        # TODO: Componer esto por que en la documentacion dice que es ineficiente
        context['featured'] = Post.objects.filter(highlighted=True).order_by('?')[:3]
        context['categories'] = Category.objects.all()[:15]
        return context


class ContactView(TemplateView):
    template_name = 'pages/contact.html'
