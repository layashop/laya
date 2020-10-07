from django.forms import ModelForm, CharField, Textarea, ModelChoiceField
from django import forms
from posts.models import Post


class PostForm(ModelForm):
    description = CharField(widget=Textarea)
    class Meta:
        model = Post
        fields = ['title', 'description', 'status', 'description', 'price', 'promo', 'discount']
