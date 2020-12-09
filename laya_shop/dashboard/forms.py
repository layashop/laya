from django.forms import ModelForm, CharField, Textarea, ModelChoiceField, CheckboxSelectMultiple, IntegerField

from laya_shop.posts.models import Post


class PostForm(ModelForm):
    description = CharField(widget=Textarea)
    images = CharField(required=True)

    def clean_images(self):
        data = self.cleaned_data['images']
        print('TIPO DE DATA EN CLEAN IMAGES', type(data))
        print('PASANDO POR CLEAN_IMAGES', data)
        return data

    class Meta:
        model = Post
        fields = ['title', 'description', 'status', 'description', 'price', 'promo', 'discount', 'currency', 'state',
                  'delivery', 'locations', 'attributes', 'tags', 'images']
        widgets = {
            'locations': CheckboxSelectMultiple()
        }
