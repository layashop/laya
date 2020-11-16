from rest_framework import filters


class MultipleIdsFilterBackend(filters.BaseFilterBackend):
    """
    Simplemente filtra por varios id's
    """
    def filter_queryset(self, request, queryset, view):
        ids = request.GET.getlist('id')
        if len(ids) == 0:
            return queryset
        try:
            ids = [int(id) for id in ids]
            return queryset.filter(pk__in=ids)
        except TypeError:
            return queryset
