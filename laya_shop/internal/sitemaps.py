from django.contrib.sitemaps import Sitemap
from laya_shop.posts.models import Post


class PostsSitemap(Sitemap):

    changefreq = "hourly"
    priority = 0.5

    def items(self):
        return Post.objects.all()

    def lastmod(self, obj):
        return obj.modified_at


