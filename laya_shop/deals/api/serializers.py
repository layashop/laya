from rest_framework import serializers
from users.api.serializers import SimpleUserSerializer
from business.models import Business
from deals.models import Deal


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = "__all__"


class DealSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=Deal.State)
    sent_by = serializers.ChoiceField(choices=Deal.SentBy)

    class Meta:
        model = Deal
        fields = [
            "history",
            "business",
            "user",
            "status",
            "expires_at",
            "created_at",
            "id",
            "sent_by",
        ]


class DealUserSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()
    status = serializers.ChoiceField(choices=Deal.State)
    sent_by = serializers.ChoiceField(choices=Deal.SentBy)

    class Meta:
        model = Deal
        fields = "__all__"


class DealBusinessSerializer(serializers.ModelSerializer):
    business = BusinessSerializer()
    status = serializers.ChoiceField(choices=Deal.State)
    sent_by = serializers.ChoiceField(choices=Deal.SentBy)

    class Meta:
        model = Deal
        fields = "__all__"
