from django.core.cache import caches
from posts.models import Category, SubCategory

cache = caches['default']

BASE_NAME = "POSTS__"

CATEGORIES_KEY = BASE_NAME + "CATEGORIES"
SUBCATEGORIES_KEY = BASE_NAME + "SUBCATEGORIES"

DEFAULT_CACHE_TIME = 60 * 60 #una hora

def classification_context(_request):
    """Settings available by default to the templates context."""
    context = {}

    categories_cache = cache.get(CATEGORIES_KEY)
    context[CATEGORIES_KEY] = categories_cache if categories_cache else Category.objects.all()
    if not categories_cache:
        cache.set(CATEGORIES_KEY, context[CATEGORIES_KEY], DEFAULT_CACHE_TIME)

    subcategories_cache = cache.get(SUBCATEGORIES_KEY)
    context[SUBCATEGORIES_KEY] = subcategories_cache if subcategories_cache else SubCategory.objects.all()
    if not subcategories_cache:
        cache.set(SUBCATEGORIES_KEY, context[SUBCATEGORIES_KEY], DEFAULT_CACHE_TIME)

    return context

def search_context(request):
    search = request.GET.get('search')
    if search:
        return {'SEARCH': search}
    return {}
