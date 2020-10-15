from posts.models import Category, SubCategory
from django.db.models import Prefetch
from json import dumps
from django.core.serializers.json import DjangoJSONEncoder
from .serializers import CategorySerializer, SubcategorySerializer
class PostClassificationMixin:
    def get_context_data(self, **kwargs):
        context = super(PostClassificationMixin, self).get_context_data(**kwargs)
        context["subcategories"] = SubcategorySerializer(SubCategory.objects.all(), many=True).data
        context['categories'] = CategorySerializer(
            Category.objects.all().prefetch_related("subcategories"), many=True).data

        return context
