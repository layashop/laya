from django.shortcuts import render, reverse, get_object_or_404
from django.views.generic import TemplateView, ListView, DetailView, CreateView, DeleteView
from django.views.generic.edit import UpdateView
from business.models import Business
from posts.models import Post, Category, SubCategory
from posts.models import BusinessImage
from .mixins import DashboardPermissionsMixin
from django.http import HttpResponseBadRequest, Http404, HttpResponseRedirect
from django.core.serializers import serialize
from json import dumps
from sorl.thumbnail import get_thumbnail
from posts.mixins import PostClassificationMixin

#FORMS
from .forms import PostForm

# Create your views here.


#LogicRequiredMixin verifica que el usuario este logeado, UserPassesTestMixin es una verificacion
#UserPasessTestMixin no verifica que el usuario este logeado, asi que primero va el LoginRequiredMixin


#El index del dashboard
class Index(DashboardPermissionsMixin, TemplateView):
    template_name = 'dashboard/index.html'
    def get_context_data(self, **kwargs):
        context = super(Index, self).get_context_data(**kwargs)
        context['business'] = get_object_or_404(Business, slug=self.kwargs['business_slug'])
        return context

index_view = Index.as_view()



#El listing de los posts ademas de la busqueda
class PostList(DashboardPermissionsMixin, ListView):
    model = Post
    template_name = 'dashboard/post_list.html'
    ordering = ['modified_at']
    paginate_by = 10
    def get_template_names(self):
        return {
            'gallery': 'dashboard/post_list_gallery.html'
        }.get(self.request.GET.get('view'), 'dashboard/post_list.html')


    # get_queryset se ejecuta antes de get_context_data
    def get_queryset(self):
        self.business = get_object_or_404(Business, slug=self.kwargs['business_slug'])
        q = {
            'business': self.business
        }
        if self.request.GET.get('search'):
            q['title__icontains'] = self.request.GET.get('search')


        return self.model.objects.filter(**q).prefetch_related('images', 'subcategories', 'subcategories__category')


    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        context['business'] = self.business
        if self.request.GET.get('search'):
            context['search'] = self.request.GET.get('search')
        context['total_posts_count'] = self.model.objects.filter(business=self.business).count()
        context['active_posts_count'] = self.model.objects.filter(business=self.business, status=Post.ACTIVE).count()
        context['inactive_posts_count'] = self.model.objects.filter(business=self.business, status=Post.INACTIVE).count()
        return context

post_list_view = PostList.as_view()

class PostCreate(PostClassificationMixin, DashboardPermissionsMixin, CreateView):
    model = Post
    template_name = 'dashboard/post_create.html'
    form_class = PostForm

    def get_context_data(self, **kwargs):
        context = super(PostCreate, self).get_context_data(**kwargs)
        context['business'] = get_object_or_404(Business, slug=self.kwargs['business_slug'])
        return context

    def get_success_url(self):
        #una vez termina de editar, redirigimos a index del dashboard
        return reverse('dashboard:post_list', args=(self.kwargs['business_slug'],))
    def form_valid(self, form):
        # import pdb; pdb.set_trace()
        business_slug = self.kwargs['business_slug']
        form.instance.business = get_object_or_404(Business, slug=business_slug)
        self.object = form.save()
        subcategories = self.request.POST.getlist('subcategories')
        if subcategories:
            try:#SUPER TODO HACER QUE ESTO SEA DE UN SOLO
                self.object.subcategories.set(SubCategory.objects.filter(pk__in=[int(i) for i in subcategories]))
            except ValueError as e:
                pass
        try:
            image_ids = [int(i) for i in self.request.POST.getlist('images')]
            images_qs = BusinessImage.objects.filter(business__slug=business_slug, pk__in=image_ids).update(post=self.object, is_valid=True)
        except ValueError as e:
            #Si hay un error no hacemos nada, se ignoran las imagenes xd
            print(e)
        return super(PostCreate, self).form_valid(form)

post_create_view = PostCreate.as_view()



#UpdateView maneja el post, verifica que sea valido el form y le hace update
class PostDetail(PostClassificationMixin, DashboardPermissionsMixin, UpdateView):
    model = Post
    template_name =  'dashboard/post_detail.html'
    form_class = PostForm
    def get_context_data(self, **kwargs):
        context = super(PostDetail, self).get_context_data(**kwargs)
        context['business'] = get_object_or_404(Business, slug=self.kwargs['business_slug'])
        context['post'] = self.get_object()
        # import pdb; pdb.set_trace()
        post_images = []
        for image in self.get_object().images.filter(is_valid=True): #is_valid=True
            thumbnail = get_thumbnail(image.image, "250x250", crop="center", quality=50).url
            # thumbnail = image.image.url
            post_images.append({'url': thumbnail, 'name': image.filename(), 'id': image.pk})

        context['selected_subcategories'] = dumps([dict(id=i.pk, category=i.category.pk) for i in self.get_object().subcategories.all().prefetch_related('category')])

        context['post_images'] = dumps(post_images)
        # import pdb; pdb.set_trace()
        # context['form'] = PostForm(instance=self.get_object())
        return context

    def form_valid(self, form):
        # import pdb; pdb.set_trace()
        business_slug = self.kwargs['business_slug']
        form.instance.business = get_object_or_404(Business, slug=business_slug)
        self.object = form.save()
        subcategories = self.request.POST.getlist('subcategories')
        if subcategories:
            try:
                self.object.subcategories.set(SubCategory.objects.filter(pk__in=[int(i) for i in subcategories]))
                self.object.subcategories.remove(*self.object.subcategories.exclude(pk__in=[int(i) for i in subcategories]))
            except ValueError as e:
                pass
        try:
            image_ids = [int(i) for i in self.request.POST.getlist('images')]
            BusinessImage.objects.filter(business__slug=business_slug, pk__in=image_ids).update(post=self.object, is_valid=True)
            BusinessImage.objects.filter(business__slug=business_slug).exclude(pk__in=image_ids).update(is_valid=False)
        except ValueError as e:
            #Si hay un error no hacemos nada, se ignoran las imagenes xd
            print(e)
        return super(PostDetail, self).form_valid(form)


    def get_success_url(self):
        #una vez termina de editar, redirigimos a index del dashboard
        # return reverse('dashboard:post_list', args=(self.kwargs['business_slug'],))
        return self.request.path_info


post_detail_view = PostDetail.as_view()

class PostDelete(DashboardPermissionsMixin, DeleteView):
    model = Post

    def get_success_url(self):
        return reverse("dashboard:post_list", kwargs={'business_slug': self.kwargs['business_slug']})


post_delete_view = PostDelete.as_view()
