from laya_shop.posts.models import Category, SubCategory

from .serializers import CategorySerializer, SubcategorySerializer
class PostClassificationMixin:
    def get_context_data(self, **kwargs):
        context = super(PostClassificationMixin, self).get_context_data(**kwargs)
        context["subcategories"] = SubcategorySerializer(SubCategory.objects.all(), many=True).data
        context['categories'] = CategorySerializer(
            Category.objects.all().prefetch_related("subcategories"), many=True).data

        return context
