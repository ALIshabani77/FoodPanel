from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SimpleLoginSerializer

class SimpleLoginView(APIView):
    permission_classes = []  # همه می‌تونن وارد شن

    def post(self, request):
        serializer = SimpleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.create_or_get_user()

        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
            }
        }
        return Response(data, status=status.HTTP_200_OK)
