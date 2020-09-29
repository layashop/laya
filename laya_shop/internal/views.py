from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView
from posts.models import Category


class HomeView(TemplateView):
    template_name = 'pages/home.html'
    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['categories'] = Category.objects.all()[:6]
        return context

class ContactView(TemplateView):
    template_name = 'pages/contact.html'