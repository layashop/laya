from django.contrib import admin
from .models import Business, UserBusiness
# Register your models here.

class UserBusinessInline(admin.TabularInline):
    model = UserBusiness
    extra = 1

class BussinesAdmin(admin.ModelAdmin):
    inlines = (UserBusinessInline,)


admin.site.register(Business, BussinesAdmin)

