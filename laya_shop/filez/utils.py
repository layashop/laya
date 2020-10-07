from django.conf import settings

def business_directory_files(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return '{}/business/{}/{}'.format(settings.MEDIA_ROOT, instance.business.slug , filename)



# def BusinessTemporalImage