from rest_framework.serializers import  ModelSerializer
from laya_shop.posts.models import Category, SubCategory


class SubcategorySerializer(ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ["id", "name"]


class CategorySerializer(ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ["id", "name", "subcategories"]
