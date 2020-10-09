from rest_framework.permissions import BasePermission


class IsBusinessMember(BasePermission):
    def has_permission(self, request, view):
        if not request.GET.get('business'):
            return False
        return request.user.is_superuser or request.user.business.filter(slug=request.GET.get('business')).exists()

