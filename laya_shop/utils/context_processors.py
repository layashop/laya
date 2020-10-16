from django.conf import settings
from posts.models import Category

def settings_context(_request):
    """Settings available by default to the templates context."""
    # Note: we intentionally do NOT expose the entire settings
    # to prevent accidental leaking of sensitive information
    return {"DEBUG": settings.DEBUG, 'all_categories': Category.objects.all()}
