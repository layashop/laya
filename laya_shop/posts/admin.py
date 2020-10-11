from django.contrib import admin
from .models import Category, Post, SubCategory, Currency, Locations
# Register your models here.


class SubCategoryInline(admin.StackedInline):
    model = SubCategory
    extra = 2

class CategoryAdmin(admin.ModelAdmin):
    inlines = (SubCategoryInline, )

admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory)
admin.site.register(Post)
admin.site.register(Currency)
admin.site.register(Locations)
