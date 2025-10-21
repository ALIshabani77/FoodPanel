from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SimpleLoginSerializer
from rest_framework.decorators import api_view
from .models import Employee
from .serializers import EmployeeSerializer

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
    




@api_view(['POST'])
def simple_login(request):
    """
    دریافت first_name و last_name
    اگر کاربر وجود نداشت، بساز
    و اطلاعاتش رو برگردون
    """
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')

    if not first_name or not last_name:
        return Response({'error': 'نام و نام خانوادگی الزامی است.'}, status=status.HTTP_400_BAD_REQUEST)

    employee, created = Employee.objects.get_or_create(
        first_name=first_name,
        last_name=last_name
    )

    serializer = EmployeeSerializer(employee)
    return Response({'user': serializer.data}, status=status.HTTP_200_OK)

