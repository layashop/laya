from rest_framework.serializers import  ModelSerializer
from laya_shop.posts.models import Category, SubCategory, Currency


class SubcategorySerializer(ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ["id", "name"]


class CategorySerializer(ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "subcategories"]



class CurrencySerializer(ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'
