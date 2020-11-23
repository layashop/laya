from django_filters import rest_framework as filters


class DealsFilters(filters.FilterSet):
    business = filters.CharFilter(lookup_expr="iexact", field_name="business__pk")
    business_slug = filters.CharFilter(
        lookup_expr="iexact", field_name="business__slug"
    )
    user = filters.NumberFilter(lookup_expr="iexact", field_name="user__pk")