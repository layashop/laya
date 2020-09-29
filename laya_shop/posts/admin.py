from django.contrib import admin
from .models import Category, Post, PostImage
# Register your models here.


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1

class PostAdmin(admin.ModelAdmin):
    inlines = (PostImageInline,)

admin.site.register(Category)
admin.site.register(Post, PostAdmin)