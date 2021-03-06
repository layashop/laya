from django_filters import rest_framework as filters


class DealsFilters(filters.FilterSet):
    business = filters.NumberFilter(lookup_expr="exact", field_name="business__pk")
    business_slug = filters.CharFilter(
        lookup_expr="iexact", field_name="business__slug"
    )
    user = filters.NumberFilter(lookup_expr="exact", field_name="user__pk")
