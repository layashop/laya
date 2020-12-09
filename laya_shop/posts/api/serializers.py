from rest_framework import serializers
from laya_shop.posts.models import Post, BusinessImage, Business, Report


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ["slug"]


class BusinessImageSerializer(serializers.ModelSerializer):
    sizes = serializers.SerializerMethodField("get_image_url")

    def get_image_url(self, obj):
        return obj.images_url()

    class Meta:
        model = BusinessImage
        fields = ["sizes"]


class PostChatThumbnail(serializers.ModelSerializer):
    images = BusinessImageSerializer(many=True)
    business = BusinessSerializer()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "final_price",
            "images",
            "business_id",
            "promo",
            "currency",
            "business",
        ]
        depth = 1


class ReportsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"
