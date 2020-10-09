from posts.models import Category, SubCategory
from json import dumps

class PostClassificationMixin:
    def get_context_data(self, **kwargs):
        context = super(PostClassificationMixin, self).get_context_data(**kwargs)
        categories = []
        for category in Category.objects.all().prefetch_related('subcategories'):
            categories.append(
                dict(
                    id=category.pk,
                    name=category.name,
                    subcategories=[
                        dict(
                            id=i.pk,
                            name=i.name
                        ) for i in category.subcategories.all()
                    ]
                )
            )
        context['json_categories'] = dumps(categories)
        # context['categories'] =  dumps([i for i in Category.objects.values('id', 'name')])
        context['subcategories'] = dumps([i for i in SubCategory.objects.values('id', 'name', 'category')])
        return context
