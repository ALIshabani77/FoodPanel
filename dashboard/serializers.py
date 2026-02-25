from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee, Food, DailyMenu, UserMealSelection,Feedback,Organization


User = get_user_model()


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'created_at']


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


class FoodSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = ['id', 'name', 'description', 'photo']

    def get_photo(self, obj):
        request = self.context.get('request')
        if obj.photo:
            photo_url = obj.photo.url
            if not photo_url.startswith('/media/'):
                photo_url = '/media' + photo_url
            if request:
                return request.build_absolute_uri(photo_url)
            return f"http://127.0.0.1:8000{photo_url}"
        return "http://127.0.0.1:8000/media/foods/default.jpg"


class DailyMenuSerializer(serializers.ModelSerializer):
    foods = FoodSerializer(many=True, read_only=True)

    class Meta:
        model = DailyMenu
        fields = ['id', 'date', 'foods']


class UserMealSelectionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    selected_food = FoodSerializer(read_only=True)
    menu = DailyMenuSerializer(read_only=True)  # ✅ اضافه شد

    class Meta:
        model = UserMealSelection
        fields = ['id', 'user', 'menu', 'selected_food', 'created_at']



# class FeedbackSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField(read_only=True)
#     selection = serializers.PrimaryKeyRelatedField(read_only=True)

#     class Meta:
#         model = Feedback
#         fields = ['id', 'user', 'selection', 'rating', 'comment', 'created_at']


class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'selection', 'food', 'rating', 'comment', 'created_at']
        # 🛡️ اضافه کردن این خط برای رفع ارور 400
        read_only_fields = ['selection', 'food']


class UserProfileSerializer(serializers.ModelSerializer):
    # ⭐ نمایش نام سازمان به صورت فقط خواندنی
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'organization', 'organization_name']
        read_only_fields = ['organization'] # شعبه از پروفایل قابل تغییر نباشد

        
# ⭐ سریالایزر سازمان برای نمایش در لیست‌ها
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']