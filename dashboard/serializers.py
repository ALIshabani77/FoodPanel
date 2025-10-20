from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()

class SimpleLoginSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def create_or_get_user(self):
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        username = f"{first_name.lower()}_{last_name.lower()}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'first_name': first_name, 'last_name': last_name}
        )
        return user
