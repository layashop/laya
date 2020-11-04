from django.db import models
from business.models import Business
from users.models import User
from posts.models import Post

# Create your models here.
class ChatRoom(models.Model):
    slug = models.SlugField(verbose_name="Slug", max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    sender_name = models.CharField(max_length=50)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    send_verifier = models.UUIDField()
    message = models.TextField()
    send_date = models.DateField(null=True)


class Deal(models.Model):
    chat_message = models.OneToOneField(
        ChatMessage, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    business = models.ForeignKey(Business, on_delete=models.DO_NOTHING)
    quantity = models.IntegerField()
    total = models.FloatField()
    delivery = models.IntegerField(
        choices=Post.Delivery.choices, default=Post.Delivery.Delivery
    )
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    approved = models.BooleanField(default=False)
