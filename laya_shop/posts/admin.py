from django.contrib import admin
from .models import Category, Post, SubCategory, Currency, Locations, BusinessImage
# Register your models here.


class SubCategoryInline(admin.StackedInline):
    model = SubCategory
    extra = 2

class CategoryAdmin(admin.ModelAdmin):
    inlines = (SubCategoryInline, )

class BusinessImageInline(admin.StackedInline):
    model = BusinessImage
    extra = 2

class PostAdmin(admin.ModelAdmin):
    inlines = (BusinessImageInline, )


admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory)
admin.site.register(Post, PostAdmin)
admin.site.register(BusinessImage)
admin.site.register(Currency)
admin.site.register(Locations)
