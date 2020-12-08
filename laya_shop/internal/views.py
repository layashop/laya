from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView
from laya_shop.posts.models import Category
from laya_shop.internal.models import HomeSlide


class HomeView(TemplateView):
    template_name = 'pages/home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['slides'] = HomeSlide.objects.all()
        context['categories'] = Category.objects.all()[:15]
        return context


class ContactView(TemplateView):
    template_name = 'pages/contact.html'
