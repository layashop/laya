from rest_framework import serializers
from deals.models import Deal


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = ['history', 'business', 'user', 'status', 'expires_at', 'created_at', 'id', 'sent_by']
