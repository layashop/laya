from sorl.thumbnail import get_thumbnail

class ThumbModel(object):

    THUMBS_SIZES = []
    THUMBS_FIELD = 'image'
    THUMBS_CROP = 'center'

    def __init__(self, *args, **kwargs):
        # import pdb; pdb.set_trace()
        image = getattr(self, self.THUMBS_FIELD)
        if image:
            for size in self.THUMBS_SIZES:
                setattr(self, 'thumbnail_{}'.format(size) , get_thumbnail(image, size, crop=self.THUMBS_CROP))

        return super(ThumbModel, self).__init__(*args, **kwargs)
