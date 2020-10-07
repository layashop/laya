from rest_framework.permissions import BasePermission


class IsBusinessMember(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.business.filter(slug=business.slug).exists()