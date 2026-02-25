from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.dateparse import parse_date
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta

# مدل‌ها و ابزارهای کمکی
from .models import DailyMenu, UserMealSelection, DisabledDay, Feedback, Organization
from dashboard.utils.jalali import (
    jalali_month_to_gregorian_range,
    gregorian_to_jalali_str
)

# سریالایزرها
from .serializers import (
    DailyMenuSerializer,
    UserMealSelectionSerializer,
    FeedbackSerializer,
    UserProfileSerializer,
    OrganizationSerializer
)

User = get_user_model()

# ============================================================
# 🛠️ توابع کمکی (Helper Functions)
# ============================================================

def get_avatar_url(user):
    """ دریافت آدرس کامل تصویر پروفایل کاربر به صورت امن """
    try:
        if hasattr(user, 'avatar') and user.avatar:
            return user.avatar.url
    except ValueError:
        return None
    return None

# ============================================================
# 🔐 مدیریت هویت و دسترسی (Authentication)
# ============================================================

class RegisterView(APIView):
    """ ثبت‌نام کاربر جدید و اتصال مستقیم به یک سازمان (شعبه) """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        org_id = request.data.get('organization')

        if not username or not password or not org_id:
            return Response({"error": "نام کاربری، رمز عبور و انتخاب شعبه الزامی است"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "این نام کاربری قبلا ثبت شده است"}, status=400)

        try:
            user = User.objects.create_user(username=username, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.organization_id = org_id
            user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "ثبت نام موفقیت‌آمیز بود",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "is_staff": user.is_staff
                }
            }, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class LoginView(APIView):
    """ ورود کاربر و صدور توکن‌های JWT به همراه اطلاعات پایه """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "avatar": get_avatar_url(user),
                    "is_staff": user.is_staff
                }
            })
        return Response({"error": "نام کاربری یا رمز عبور اشتباه است"}, status=401)


class ResetPasswordView(APIView):
    """ بازنشانی رمز عبور توسط نام کاربری (ساده شده) """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        new_password = request.data.get('new_password')
        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()
            return Response({"message": "رمز عبور با موفقیت تغییر کرد"})
        except User.DoesNotExist:
            return Response({"error": "کاربری با این نام پیدا نشد"}, status=404)

# ============================================================
# 👤 مدیریت پروفایل (Profile Management)
# ============================================================

class UserProfileView(generics.RetrieveUpdateAPIView):
    """ مشاهده و ویرایش اطلاعات شخصی، نام کاربری و رمز عبور """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data

        # بررسی یکتا بودن نام کاربری جدید
        if 'username' in data and data['username'] != user.username:
            if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
                return Response({"error": "این نام کاربری قبلاً انتخاب شده است"}, status=400)
            user.username = data['username']

        # تغییر رمز عبور در صورت ارسال فیلد جدید
        if 'new_password' in data and data['new_password']:
            user.set_password(data['new_password'])
        
        user.save()
        return super().patch(request, *args, **kwargs)

# ============================================================
# 🍽️ منوی روزانه (Daily Menu)
# ============================================================

class DailyMenuListView(generics.ListAPIView):
    """ لیست تمام منوهای موجود فیلتر شده بر اساس سازمان کاربر """
    serializer_class = DailyMenuSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyMenu.objects.filter(organization=self.request.user.organization).order_by("-date")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class TodayMenuView(APIView):
    """ دریافت منوی اختصاصی شعبه کاربر برای تاریخ امروز """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        try:
            menu = DailyMenu.objects.get(date=today, organization=request.user.organization)
            serializer = DailyMenuSerializer(menu, context={"request": request})
            return Response(serializer.data)
        except DailyMenu.DoesNotExist:
            return Response({"message": "منوی امروز ثبت نشده است."}, status=404)


class MonthlyMenuStatusView(APIView):
    """ ارائه وضعیت تقویم ماهانه (روزهای فعال، تعطیل و انتخاب شده) """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        j_year = int(request.GET.get("year"))
        j_month = int(request.GET.get("month"))
        g_start, g_end, days_count = jalali_month_to_gregorian_range(j_year, j_month)

        menus = DailyMenu.objects.filter(date__range=(g_start, g_end))
        menus_map = {m.date: m for m in menus}
        
        selections = set(UserMealSelection.objects.filter(
            user=request.user, 
            menu__date__range=(g_start, g_end)
        ).values_list("menu__date", flat=True))

        disabled_days = DisabledDay.objects.filter(date__range=(g_start, g_end))
        disabled_map = {d.date: d.reason for d in disabled_days}

        result = {}
        for i in range(days_count):
            g_date = g_start + timedelta(days=i)
            j_date_str = gregorian_to_jalali_str(g_date)
            
            if g_date in disabled_map:
                result[j_date_str] = {"enabled": False, "reason": disabled_map[g_date]}
            elif g_date in menus_map:
                result[j_date_str] = {"enabled": True, "selected": g_date in selections}
            else:
                result[j_date_str] = {"enabled": False, "reason": "منویی ثبت نشده"}

        return Response({"calendar": "jalali", "days": result})

# ============================================================
# ✅ انتخاب غذا (Meal Selection)
# ============================================================

class UserMealSelectionCreateView(APIView):
    """ ثبت یا ویرایش انتخاب غذای کاربر برای یک تاریخ مشخص """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        menu_id = request.data.get("menu")
        food_id = request.data.get("food")

        try:
            menu = DailyMenu.objects.get(id=menu_id)
            UserMealSelection.objects.update_or_create(
                user=user, menu=menu,
                defaults={"selected_food_id": food_id}
            )
            return Response({"success": True})
        except DailyMenu.DoesNotExist:
            return Response({"error": "منو پیدا نشد"}, status=404)


class UserMealSelectionsListView(generics.ListAPIView):
    """ نمایش تاریخچه انتخاب‌های غذایی کاربر جاری """
    serializer_class = UserMealSelectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserMealSelection.objects.filter(user=self.request.user).select_related("menu", "selected_food").order_by("menu__date")


class UserMealSelectionDetailView(APIView):
    """ حذف یک انتخاب غذایی خاص توسط کاربر """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        selection = get_object_or_404(UserMealSelection, pk=pk, user=request.user)
        selection.delete()
        return Response({"detail": "حذف شد."}, status=status.HTTP_204_NO_CONTENT)

# ============================================================
# ⭐ بازخورد و امتیازدهی (Feedback)
# ============================================================

class PendingFeedbackListView(APIView):
    """ لیست غذاهایی که کاربر مصرف کرده اما هنوز امتیازی برای آن‌ها ثبت نکرده است """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        pending_list = UserMealSelection.objects.filter(
            user=request.user, menu__date__lte=today, feedbacks__isnull=True  
        ).select_related('selected_food', 'menu').order_by('-menu__date')

        data = []
        for item in pending_list:
            if item.selected_food:
                photo_url = request.build_absolute_uri(item.selected_food.photo.url) if item.selected_food.photo else None
                data.append({
                    "selection_id": item.id,
                    "food_name": item.selected_food.name,
                    "food_image": photo_url,
                    "date_str": item.menu.date.strftime("%Y-%m-%d")
                })
        return Response(data)


class FeedbackCreateView(generics.CreateAPIView):
    """ ثبت نظر و امتیاز جدید برای یک وعده غذایی مشخص """
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        selection_id = self.request.data.get('selection_id')
        selection = get_object_or_404(UserMealSelection, id=selection_id, user=self.request.user)
        
        if Feedback.objects.filter(selection=selection).exists():
            raise serializers.ValidationError({"detail": "قبلاً برای این وعده نظر ثبت شده است."})

        serializer.save(
            user=self.request.user, selection=selection,
            food=selection.selected_food,
            rating=self.request.data.get('rating'),
            comment=self.request.data.get('comment', '')
        )


class FoodRatingView(APIView):
    """ دریافت میانگین امتیازات و تعداد نظرات برای هر غذا (عمومی) """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ratings = Feedback.objects.values('food__id', 'food__name').annotate(
            avg_rating=Avg('rating'), total_votes=Count('id')
        ).order_by('-avg_rating')
        return Response(ratings)

# ============================================================
# 📊 گزارشات و مدیریت (Reports & Admin Tools)
# ============================================================

class DailyOrdersReport(APIView):
    """ گزارش تعداد سفارشات به تفکیک نوع غذا برای یک تاریخ خاص (ادمین) """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date = parse_date(request.GET.get("date"))
        qs = UserMealSelection.objects.filter(menu__date=date)
        foods = {}
        for item in qs:
            name = item.selected_food.name if item.selected_food else "—"
            foods[name] = foods.get(name, 0) + 1

        return Response({
            "total_orders": qs.count(),
            "foods": [{"name": k, "count": v} for k, v in foods.items()]
        })


class MonthlyOrdersStatus(APIView):
    """ لیست روزهایی از ماه که کاربر فعلی در آن‌ها سفارش ثبت کرده است """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_param = request.GET.get("date")
        if not date_param: return Response({"error": "تاریخ لازم است"}, status=400)
        date = parse_date(date_param)
        
        orders = UserMealSelection.objects.filter(
            user=request.user, menu__date__year=date.year, menu__date__month=date.month
        ).values_list('menu__date', flat=True).distinct()

        return Response({"days_with_orders": [d.strftime("%Y-%m-%d") for d in orders]})


class OrganizationListView(generics.ListAPIView):
    """ دریافت لیست تمام شعب جهت نمایش در منوهای انتخاب (مانند ثبت‌نام) """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]