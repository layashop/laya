from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView
from django.db.models import Q
from django.core.cache import caches
from .decorators import cache_on_auth

from laya_shop.posts.filters import PostFilter
from laya_shop.posts.mixins import PostClassificationMixin
from laya_shop.posts.models import Post, Category, SubCategory, Currency
from laya_shop.posts.serializers import CurrencySerializer

cache = caches["default"]


@method_decorator(cache_on_auth(60 * 60), name="dispatch")
class PostList(PostClassificationMixin, ListView):
    model = Post
    template_name = "posts/search.html"

    paginate_by = 20

    def build_cache_key(self):
        cache_key = "search_"
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
            queryset = self.model.objects.select_related("currency").prefetch_related(
                "images"
            )
            # queryset = PostFilter(
            #     self.request.GET, queryset=queryset, request=self.request
            # ).qs
            q_object = Q()
            query_keys = self.request.GET

            if query_keys.get("category"):
                if not self.request.GET.get("subcategory", [None])[0]:
                    q_object.add(
                        Q(
                            subcategories__category__pk=int(
                                query_keys.get("category")[0]
                            )
                        ),
                        "AND",
                    )

            if query_keys.get("subcategory"):
                q_object.add(
                    Q(subcategories__pk=int(query_keys.get("subcategory")[0])), "AND"
                )
            if query_keys.get("state"):
                q_object.add(Q(state=int(query_keys.get("state")[0])), "AND")
            if query_keys.get("delivery"):
                q_object.add(Q(delivery=int(query_keys.get("delivery")[0])), "AND")
            if query_keys.get("location"):
                q_object.add(Q(locations__pk=int(query_keys.get("location")[0])), "AND")
            if query_keys.get("lowPrice"):
                try:
                    print("Currency", self.request.GET.get("currency"))
                    currency = Currency.objects.get(
                        iso_code=self.request.GET.get("currency")
                        if self.request.GET.get("currency")
                        else "NIO"
                    )
                except Currency.DoesNotExist:
                    currency = None
                if currency is not None:
                    print("Adding Currency")
                    q_object.add(
                        Q(
                            base_price__gte=round(
                                float(query_keys.get("lowPrice")[0]) / currency.rate
                            )
                        ),
                        "AND",
                    )
                else:
                    q_object.add(
                        Q(
                            base_price__gte=float(query_keys.get("lowPrice")[0])
                            / currency.rate
                        ),
                        "AND",
                    )
            if query_keys.get("highPrice"):
                try:
                    currency = Currency.objects.get(
                        iso_code=self.request.GET.get("currency")
                        if self.request.GET.get("currency")
                        else "NIO"
                    )
                except Currency.DoesNotExist:
                    currency = None
                if currency is not None:
                    q_object.add(
                        Q(
                            base_price__lte=round(
                                float(query_keys.get("highPrice")[0]) / currency.rate
                            )
                        ),
                        "AND",
                    )
                else:
                    q_object.add(
                        Q(base_price__lte=float(query_keys.get("highPrice")[0])), "AND"
                    )
            if query_keys.get("tags"):
                q_object.add(Q(tags__contains=query_keys.get("tags")), "AND")
            if query_keys.get("search"):
                q_object.add(Q(title__icontains=query_keys.get("search")), "AND")
            queryset_optimizado = queryset.filter(q_object)
            if query_keys.get("sort"):
                sort_key = self.request.GET.get("sort")
                if sort_key[0] == "1":
                    queryset_optimizado = queryset_optimizado.order_by("-created_at")
                if sort_key == "2":
                    queryset_optimizado = queryset_optimizado.order_by("created_at")
                if sort_key == "3":
                    queryset_optimizado = queryset_optimizado.order_by("-base_price")
                if sort_key == "4":
                    queryset_optimizado = queryset_optimizado.order_by("base_price")
                # subcategories -> state -> delivery -> location -> lowPrice-> highPrice ->  tag -> title

            # sort

            cache.set(cache_key, queryset_optimizado, 60 * 60)
            print("QS", queryset_optimizado.explain())
            return queryset_optimizado

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_cache_name"] = self.build_cache_key()
        return context


post_list_view = PostList.as_view()


# @method_decorator(cache_page(600), name="dispatch")
class PostDetail(DetailView):
    model = Post
    template_name = "posts/detail.html"

    def get_object(self):
        queryset = Post.objects.select_related("business", "currency").prefetch_related(
            "locations", "subcategories__category"
        )
        slug: str = self.kwargs["business_slug"]
        slug = slug[1:] if slug.startswith("@") else slug
        return get_object_or_404(queryset, pk=self.kwargs["pk"], business__slug=slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        post = self.object
        context['currencies'] = CurrencySerializer(Currency.objects.all(), many=True).data
        # TODO: Mejorar esta wea
        context["related_posts"] = (
            Post.objects.select_related("business")
            .filter(subcategories__in=post.subcategories.all())
            .distinct()
            .exclude(pk=post.pk)[:4]
        )
        return context


post_detail_view = PostDetail.as_view()


class CategoryDetail(DetailView):
    model = Category
    template_name = "posts/classification_detail.html"
    slug_field = "slug"
    slug_url_kwarg = "slug"
    context_object_name = "category"

    def get_object(self, queryset=None):
        category = Category.objects.prefetch_related("subcategories")
        return get_object_or_404(category, slug=self.kwargs["slug"])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["posts"] = (
            Post.objects.select_related("business").prefetch_related("images").all()[:6]
        )
        context["subcategories"] = self.object.subcategories.all()
        context["highlight"] = (
            Post.objects.prefetch_related("images")
            .filter(subcategories__category=self.object, highlighted=True)
            .distinct()
        )
        context["subcategories_list"] = [
            {
                "subcategory": subcategory,
                "posts": Post.objects.prefetch_related("images")
                .filter(subcategories=subcategory)
                .exclude(id__in=context["highlight"])[:6],
            }
            for subcategory in context["subcategories"][:3]
        ]
        return context


category_detail_view = CategoryDetail.as_view()
