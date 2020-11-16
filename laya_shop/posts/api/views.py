from django.http import HttpResponseForbidden, JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import CreateView

from django.http import Http404, HttpResponse
from rest_framework import views, viewsets

from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .permissions import IsBusinessMember
from .filters import MultipleIdsFilterBackend
from posts.models import BusinessImage
from business.models import Business
from django_filters.rest_framework import DjangoFilterBackend
from posts.models import Post
from .serializers import PostChatThumbnail
# Create your views here.


class PostChatThumbnailViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostChatThumbnail
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [MultipleIdsFilterBackend, DjangoFilterBackend]
    filterset_fields = ['business_id']


class BusinessGetObject:
    def get_object(self):
        business_slug = self.request.POST.get('business') or self.request.GET.get('business') or None
        # import pdb; pdb.set_trace()
        if business_slug is None:
            return None
        try:
            return Business.objects.get(slug=business_slug)
        except Business.DoesNotExist:
            raise Http404


# Aqui se suben las imagenes desde el create view
class BusinessTemporalImageView(BusinessGetObject, views.APIView):
    permission_classes = (IsAuthenticated, IsBusinessMember)

    def post(self, request, format=None):
        business = self.get_object()
        if not business:
            return HttpResponseBadRequest()
        image = request.FILES.get('image')
        if not image:
            return HttpResponseBadRequest()
        instance = BusinessImage.objects.create(business=business, image=image)
        return JsonResponse(instance.pk, safe=False)


#Aqui es para que se borren las imagenes que no se quieren usar :v
class BusinessTemporalDetailView(views.APIView):
    permission_classes = (IsAuthenticated, IsBusinessMember)
    def delete(self, request, pk=None, format=None):
        delete_when_request = True
        # Creo que la mejor manera seria borrar el registro y LUEGO
        # buscar las imagenes huerfanas, pero por el momento lo dejo asi jeje
        temporal_image = get_object_or_404(BusinessImage, pk=pk)
        temporal_image.delete()
        print('Image deleted')
        return HttpResponse("Delete")
