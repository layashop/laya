from django.shortcuts import reverse, get_object_or_404
from django.db.models import Q
from django.utils import timezone
from django.views.generic import (
    TemplateView,
    ListView,
    DetailView,
    CreateView,
    DeleteView,
    UpdateView
)
from laya_shop.business.models import Business
from laya_shop.posts.models import Post, SubCategory
from laya_shop.deals.models import Deal
from laya_shop.posts.models import BusinessImage
from .mixins import DashboardBaseMixin
from laya_shop.posts.serializers import SubcategorySerializer
from json import dumps, loads
from laya_shop.posts.mixins import PostClassificationMixin


# FORMS
from .forms import PostForm


# LogicRequiredMixin verifica que el usuario este logeado, UserPassesTestMixin es una verificacion
# UserPasessTestMixin no verifica que el usuario este logeado, asi que primero va el LoginRequiredMixin




class Index(DashboardBaseMixin, TemplateView):
    template_name = "dashboard/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        base_deals = Deal.objects.filter(created_at__gte=timezone.now() - timezone.timedelta(days=30))

        STATUS_CODES = Deal.State

        ACTIVE_CODES = [STATUS_CODES.DELIVERY, STATUS_CODES.PENDING, STATUS_CODES.RESERVED]

        context['active_deals'] = Deal.objects.filter(
            business__slug=self.kwargs['business_slug'],
            status__in=ACTIVE_CODES
        ).count()
        return context


index_view = Index.as_view()


# El listing de los posts ademas de la busqueda
class PostList(DashboardBaseMixin, ListView):
    model = Post
    template_name = "dashboard/post_list.html"
    ordering = ["modified_at"]
    paginate_by = 10

    # get_queryset se ejecuta antes de get_context_data
    def get_queryset(self):
        self.business = get_object_or_404(Business, slug=self.kwargs["business_slug"])
        q = {"business": self.business}
        if self.request.GET.get("search"):
            q["title__icontains"] = self.request.GET.get("search")

        return self.model.objects.filter(**q).prefetch_related(
            "images", "subcategories", "subcategories__category"
        )

    def get_context_data(self, **kwargs):
        context = super(PostList, self).get_context_data(**kwargs)
        context["business"] = self.business
        if self.request.GET.get("search"):
            context["search"] = self.request.GET.get("search")

        context["total_posts_count"] = self.model.objects.filter(
            business=self.business
        ).count()

        context["active_posts_count"] = self.model.objects.filter(
            business=self.business, status=Post.ACTIVE
        ).count()

        context["inactive_posts_count"] = self.model.objects.filter(
            business=self.business, status=Post.INACTIVE
        ).count()

        return context


post_list_view = PostList.as_view()


class PostCreate(PostClassificationMixin, DashboardBaseMixin, CreateView):
    model = Post
    template_name = "dashboard/post_detail.html"
    form_class = PostForm

    def get_context_data(self, **kwargs):
        context = super(PostCreate, self).get_context_data(**kwargs)
        context["business"] = get_object_or_404(
            Business, slug=self.kwargs["business_slug"]
        )
        return context

    def get_success_url(self):
        # una vez termina de editar, redirigimos a index del dashboard
        return reverse("dashboard:post_list", args=(self.kwargs["business_slug"],))

    def form_valid(self, form):

        business_slug = self.kwargs["business_slug"]
        form.instance.business = get_object_or_404(Business, slug=business_slug)
        post = form.save(commit=False)
        subcategories = self.request.POST.getlist("subcategories")
        post.attributes = loads(self.request.POST.get("additionalParameters", "null"))
        post.save()
        # Ahora vamos con las queries que no actualizan a la instancia como tal
        if subcategories:
            try:
                post.subcategories.set(
                    SubCategory.objects.filter(pk__in=[int(i) for i in subcategories])
                )
            except ValueError as e:
                pass
        try:
            image_ids = [int(i) for i in self.request.POST.getlist("images")]
            images_qs = BusinessImage.objects.filter(
                business__slug=business_slug, pk__in=image_ids
            ).update(post=post, is_valid=True)
        except ValueError as e:
            # Si hay un error no hacemos nada, se ignoran las imagenes xd
            print(e)
        post.save()
        return super(PostCreate, self).form_valid(form)


post_create_view = PostCreate.as_view()


# UpdateView maneja el post, verifica que sea valido el form y le hace update
class PostDetail(PostClassificationMixin, DashboardBaseMixin, UpdateView):
    model = Post
    template_name = "dashboard/post_detail.html"
    form_class = PostForm

    def get_context_data(self, **kwargs):
        context = super(PostDetail, self).get_context_data(**kwargs)
        context["business"] = get_object_or_404(
            Business, slug=self.kwargs["business_slug"]
        )
        context["post"] = self.object
        post_images = []
        for image in self.object.images.filter(is_valid=True):  # is_valid=True
            post_images.append(
                {
                    "url": image.thumbnail_250x250.url,
                    "name": image.filename(),
                    "id": image.pk,
                }
            )

        context["selected_subcategories"] = SubcategorySerializer(
            self.object.subcategories.all(), many=True
        ).data
        context["post_images"] = dumps(post_images)
        context["is_updating"] = True
        return context

    def form_valid(self, form):
        business_slug = self.kwargs["business_slug"]
        post = form.save(commit=False)
        post.business = get_object_or_404(Business, slug=business_slug)
        subcategories = self.request.POST.getlist("subcategories")
        post.attributes = loads(self.request.POST.get("additionalParameters", "null"))
        post.tags = self.request.POST.getlist("tags", [])
        # import pdb; pdb.set_trace()
        if subcategories:
            try:
                post.subcategories.set(
                    SubCategory.objects.filter(pk__in=[int(i) for i in subcategories])
                )
                post.subcategories.remove(
                    *post.subcategories.exclude(pk__in=[int(i) for i in subcategories])
                )
            except ValueError as e:
                pass
        try:
            image_ids = [int(i) for i in self.request.POST.getlist("images")]
            BusinessImage.objects.filter(
                business__slug=business_slug, pk__in=image_ids
            ).update(post=post, is_valid=True)
            BusinessImage.objects.filter(
                business__slug=business_slug, post=post
            ).exclude(pk__in=image_ids).delete()
        except ValueError as e:
            # Si hay un error no hacemos nada, se ignoran las imagenes xd
            print(e)
        return super(PostDetail, self).form_valid(form)

    def get_success_url(self):
        return self.request.path_info


post_detail_view = PostDetail.as_view()


class PostDelete(DashboardBaseMixin, DeleteView):
    model = Post

    def get_success_url(self):
        return reverse(
            "dashboard:post_list",
            kwargs={"business_slug": self.kwargs["business_slug"]},
        )


post_delete_view = PostDelete.as_view()


class ChatApp(DashboardBaseMixin, TemplateView):
    template_name = "dashboard/chat_dashboard.html"

    def get_context_data(self, **kwargs):
        context = super(ChatApp, self).get_context_data(**kwargs)
        print(context.get("business").__dict__)
        return context


chat_app_view = ChatApp.as_view()


class DealsView(DashboardBaseMixin, TemplateView):
    template_name = "dashboard/deals.html"

    def get_context_data(self, **kwargs):
        context = super(DealsView, self).get_context_data(**kwargs)
        return context


deals_view = DealsView.as_view()


class ProfileUpdateView(DashboardBaseMixin, UpdateView):
    template_name = 'dashboard/profile_update.html'
    model = Business
    fields = ['address', 'description', 'profile_image']

    slug_url_kwarg = 'business_slug'
    slug_field = 'slug'

    def get_success_url(self):
        return self.request.path_info


profile_update_view = ProfileUpdateView.as_view()
