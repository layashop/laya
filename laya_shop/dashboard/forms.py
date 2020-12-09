from django.forms import ModelForm, CharField, Textarea, ModelChoiceField, CheckboxSelectMultiple

from laya_shop.posts.models import Post


class PostForm(ModelForm):
    description = CharField(widget=Textarea)
    class Meta:
        model = Post
        fields = ['title', 'description', 'status', 'description', 'price', 'promo', 'discount', 'currency', 'state',
                  'delivery', 'locations', 'attributes', 'tags']
        widgets = {
            'locations': CheckboxSelectMultiple()
        }
