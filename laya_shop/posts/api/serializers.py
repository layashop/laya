from rest_framework import serializers
from posts.models import Post, BusinessImage

class BusinessImageSerializer(serializers.ModelSerializer):
    sizes = serializers.SerializerMethodField('get_image_url')


    def get_image_url(self, obj):
        return obj.images_url()
    class Meta:
        model = BusinessImage
        fields = ['sizes']

class PostChatThumbnail(serializers.ModelSerializer):
    images = BusinessImageSerializer(many=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'final_price', 'images', 'business_id']
        depth = 1

