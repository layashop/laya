from django.views.decorators.cache import cache_page
from functools import wraps


#https://stackoverflow.com/questions/11661503/django-caching-for-authenticated-users-only
#Nada mas que hay una parte que usa """assigned=available_attrs(view_func)"""
#Eso ya no es necesario
def cache_on_auth(timeout):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            return cache_page(timeout, key_prefix="_auth_%s_" % request.user.is_authenticated )(view_func)(request, *args, **kwargs)
        return _wrapped_view
    return decorator
