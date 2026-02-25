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
#from dashboard.utils.calendar_service import get_month_holidays
from .models import DailyMenu, UserMealSelection, DisabledDay,Feedback,Organization
from datetime import timedelta
from dashboard.utils.jalali import (
    jalali_month_to_gregorian_range,
    gregorian_to_jalali_str
)



#from dashboard.utils.calendar_service import get_month_calendar

from .serializers import (
    DailyMenuSerializer,
    UserMealSelectionSerializer,
    FeedbackSerializer,
    UserProfileSerializer,
    OrganizationSerializer
)

User = get_user_model()

# ============================================================
# 🛠️ تابع کمکی امن برای آواتار
# ============================================================
def get_avatar_url(user):
    try:
        if hasattr(user, 'avatar') and user.avatar:
            return user.avatar.url
    except ValueError:
        return None
    return None

# ============================================================
# 🔐 Auth
# ============================================================

# 1️⃣ Register
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        org_id = request.data.get('organization') # ⭐ دریافت آیدی سازمان از فرانت

        if not username or not password or not org_id:
            return Response({"error": "نام کاربری، رمز عبور و انتخاب شعبه الزامی است"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "این نام کاربری قبلا ثبت شده است"}, status=400)

        try:
            # ایجاد یوزر
            user = User.objects.create_user(username=username, password=password)
            user.first_name = first_name
            user.last_name = last_name
            user.organization_id = org_id # ⭐ ذخیره مستقیم آیدی سازمان
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

# 2️⃣ Login
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            avatar_url = get_avatar_url(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "avatar": avatar_url,
                    "is_staff": user.is_staff   # ✅ اضافه شد
                }
            })
        else:
            return Response(
                {"error": "نام کاربری یا رمز عبور اشتباه است"},
                status=401
            )

# 3️⃣ Reset password
class ResetPasswordView(APIView):
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
# 👤 Profile
# ============================================================
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data

        # ⭐ بررسی و تغییر نام کاربری
        if 'username' in data and data['username'] != user.username:
            if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
                return Response({"error": "این نام کاربری قبلاً انتخاب شده است"}, status=400)
            user.username = data['username']

        # ⭐ تغییر رمز عبور در صورت ارسال
        if 'new_password' in data and data['new_password']:
            user.set_password(data['new_password'])
        
        user.save()
        # اجازه بده بقیه فیلدها (نام، آواتار) توسط متد اصلی آپدیت شوند
        return super().patch(request, *args, **kwargs)
# ============================================================
# 🍽️ Menu
# ============================================================

class DailyMenuListView(generics.ListAPIView):
    # queryset ثابت حذف شد تا فیلتر داینامیک اعمال شود
    serializer_class = DailyMenuSerializer
    permission_classes = [IsAuthenticated] # برای دسترسی به request.user الزامی است

    def get_queryset(self):
        # ⭐ فقط منوهای مربوط به شعبه خود کاربر را برگردان
        user = self.request.user
        return DailyMenu.objects.filter(organization=user.organization).order_by("-date")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
class TodayMenuView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        try:
            # ⭐ فیلتر بر اساس سازمان کاربر
            menu = DailyMenu.objects.get(date=today, organization=request.user.organization)
            serializer = DailyMenuSerializer(menu, context={"request": request})
            return Response(serializer.data)
        except DailyMenu.DoesNotExist:
            return Response({"message": "منوی امروز ثبت نشده است."}, status=404)

# ============================================================
# ✅ Food selection
# ============================================================

class UserMealSelectionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        menu_id = request.data.get("menu")
        food_id = request.data.get("food")

        try:
            menu = DailyMenu.objects.get(id=menu_id)
        except DailyMenu.DoesNotExist:
            return Response({"error": "menu not found"}, status=404)

        UserMealSelection.objects.update_or_create(
            user=user,
            menu=menu,
            defaults={"selected_food_id": food_id}
        )

        return Response({"success": True})

class UserMealSelectionsListView(generics.ListAPIView):
    serializer_class = UserMealSelectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            UserMealSelection.objects
            .filter(user=self.request.user)
            .select_related("menu", "selected_food")
            .order_by("menu__date")
        )

class UserMealSelectionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        selection = get_object_or_404(UserMealSelection, pk=pk, user=request.user)
        selection.delete()
        return Response({"detail": "حذف شد."}, status=status.HTTP_204_NO_CONTENT)

# ============================================================
# ⭐ Feedback
# ============================================================
class PendingFeedbackListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        # فیلتر کردن غذاهایی که کاربر خورده ولی هنوز براشون فیدبک (feedbacks) ثبت نکرده
        pending_list = UserMealSelection.objects.filter(
            user=request.user,
            menu__date__lte=today,
            feedbacks__isnull=True  
        ).select_related(
            'selected_food',
            'menu'
        ).order_by('-menu__date')

        data = []

        for item in pending_list:
            if item.selected_food:
                # 🛠️ اصلاح شده: تغییر image به photo مطابق با مدل شما
                food_photo_url = None
                if item.selected_food.photo:
                    food_photo_url = request.build_absolute_uri(item.selected_food.photo.url)

                data.append({
                    "selection_id": item.id,
                    "food_name": item.selected_food.name,
                    "food_image": food_photo_url,
                    "date": item.menu.date,
                    "date_str": item.menu.date.strftime("%Y-%m-%d")
                })

        return Response(data)


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        selection_id = self.request.data.get('selection_id')
        rating = self.request.data.get('rating')
        comment = self.request.data.get('comment', '')

        # 🔍 پیدا کردن سفارش کاربر (استفاده از get_object_or_404 برای امنیت بیشتر)
        selection = get_object_or_404(UserMealSelection, id=selection_id, user=self.request.user)

        # 🛑 چک کردن دوباره برای جلوگیری از ثبت نظر تکراری
        if Feedback.objects.filter(selection=selection).exists():
            raise serializers.ValidationError({"detail": "قبلاً برای این وعده نظر ثبت شده است."})

        # ✅ ذخیره با تزریق مقادیر استخراج شده
        serializer.save(
            user=self.request.user,
            selection=selection,
            food=selection.selected_food, # اتصال امتیاز به خود غذا
            rating=rating,
            comment=comment
        )

class FoodRatingView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        ratings = (
            Feedback.objects
            .values('food__id', 'food__name')
            .annotate(
                avg_rating=Avg('rating'),
                total_votes=Count('id')
            )
            .order_by('-avg_rating')
        )

        return Response(ratings)
# ============================================================
# 📊 Reports
# ============================================================

class DailyOrdersReport(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_str = request.GET.get("date")
        date = parse_date(date_str)

        qs = UserMealSelection.objects.filter(menu__date=date)
        total_orders = qs.count()

        foods = {}
        for item in qs:
            name = item.selected_food.name if item.selected_food else "—"
            foods[name] = foods.get(name, 0) + 1

        return Response({
            "date": date_str,
            "total_orders": total_orders,
            "foods": [{"name": k, "count": v} for k, v in foods.items()]
        })

class MonthlyOrdersStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_param = request.GET.get("date")
        if not date_param:
            return Response({"error": "تاریخ ارسال نشده است"}, status=400)
            
        date = parse_date(date_param)
        
        # ⭐ فیلتر بر اساس خود کاربر تا تداخلی با رزروهای شعب دیگر نداشته باشد
        orders = UserMealSelection.objects.filter(
            user=request.user, 
            menu__date__year=date.year,
            menu__date__month=date.month
        ).values_list('menu__date', flat=True).distinct()

        return Response({
            "days_with_orders": [d.strftime("%Y-%m-%d") for d in orders]
        })






# class CompanyCalendarStatusView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, date):
#         """
#         خروجی:
#         - is_holiday: تعطیل یا نه
#         - is_weekend: پنجشنبه یا جمعه
#         - reason: دلیل تعطیلی
#         """

#         try:
#             # تاریخ میلادی → شمسی
#             g_date = datetime.strptime(date, "%Y-%m-%d").date()
#             j_date = jdatetime.date.fromgregorian(date=g_date)

#             weekday = g_date.weekday()  # 0=دوشنبه ... 4=جمعه
#             is_weekend = weekday in (3, 4)  # پنجشنبه، جمعه

#             # 📡 درخواست به API تقویم
#             url = (
#                 f"https://pnldev.com/api/calender"
#                 f"?year={j_date.year}&month={j_date.month}&day={j_date.day}"
#             )

#             with urllib.request.urlopen(url, timeout=10) as response:
#                 data = json.loads(response.read().decode())

#             if not data.get("status"):
#                 return Response(
#                     {"error": "خطا در دریافت اطلاعات تقویم"},
#                     status=status.HTTP_502_BAD_GATEWAY,
#                 )

#             result = data["result"]

#             api_holiday = result.get("holiday", False)
#             events = result.get("event", [])

#             is_holiday = is_weekend or api_holiday

#             reason = []
#             if is_weekend:
#                 reason.append("تعطیل آخر هفته")
#             if api_holiday and events:
#                 reason.extend(events)

#             return Response(
#                 {
#                     "date": date,
#                     "jalali_date": f"{j_date.year}/{j_date.month}/{j_date.day}",
#                     "is_holiday": is_holiday,
#                     "is_weekend": is_weekend,
#                     "reason": reason,
#                 },
#                 status=status.HTTP_200_OK,
#             )

#         except ValueError:
#             return Response(
#                 {"error": "فرمت تاریخ نامعتبر است (YYYY-MM-DD)"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         except Exception as e:
#             return Response(
#                 {"error": "خطای سرور", "detail": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )





# class CalendarMonthView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, year, month):
#         holidays = get_month_holidays(year, month)

#         return Response({
#             "year": year,
#             "month": month,
#             "holidays": holidays,
#             "source": "pnldev"
#         })
    




# class MonthlyMenuStatusView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # ⬅️ ورودی شمسی
#         j_year = int(request.GET.get("year"))
#         j_month = int(request.GET.get("month"))

#         # ⬅️ تبدیل به بازه میلادی
#         g_start, g_end, days_count = jalali_month_to_gregorian_range(j_year, j_month)

#         menus = DailyMenu.objects.filter(
#             date__range=(g_start, g_end)
#         )
#         menus_map = {m.date: m for m in menus}

#         selections = set(
#             UserMealSelection.objects.filter(
#                 menu__date__range=(g_start, g_end)
#             ).values_list("menu__date", flat=True)
#         )

#         disabled_days = DisabledDay.objects.filter(
#             date__range=(g_start, g_end)
#         )
#         disabled_map = {d.date: d.reason for d in disabled_days}

#         result = {}

#         for i in range(days_count):
#             g_date = g_start + timedelta(days=i)
#             j_date_str = gregorian_to_jalali_str(g_date)

#             # پیش‌فرض
#             result[j_date_str] = {
#                 "enabled": False,
#                 "reason": "منویی ثبت نشده"
#             }

#             # بسته توسط ادمین
#             if g_date in disabled_map:
#                 result[j_date_str] = {
#                     "enabled": False,
#                     "reason": disabled_map[g_date]
#                 }
#                 continue

#             # منو دارد؟
#             if g_date in menus_map:
#                 if g_date in selections:
#                     result[j_date_str] = {
#                         "enabled": True
#                     }
#                 else:
#                     result[j_date_str] = {
#                         "enabled": False,
#                         "reason": "بدون انتخاب غذا"
#                     }

#         return Response({
#             "calendar": "jalali",
#             "year": j_year,
#             "month": j_month,
#             "days": result
#         })







class MonthlyMenuStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        j_year = int(request.GET.get("year"))
        j_month = int(request.GET.get("month"))

        g_start, g_end, days_count = jalali_month_to_gregorian_range(j_year, j_month)

        menus = DailyMenu.objects.filter(date__range=(g_start, g_end))
        menus_map = {m.date: m for m in menus}

        selections = set(
            UserMealSelection.objects.filter(
                user=request.user,
                menu__date__range=(g_start, g_end)
            ).values_list("menu__date", flat=True)
        )

        disabled_days = DisabledDay.objects.filter(date__range=(g_start, g_end))
        disabled_map = {d.date: d.reason for d in disabled_days}

        result = {}

        for i in range(days_count):
            g_date = g_start + timedelta(days=i)
            j_date_str = gregorian_to_jalali_str(g_date)

            # 1️⃣ پیش‌فرض: منویی ثبت نشده
            result[j_date_str] = {
                "enabled": False,
                "reason": "منویی ثبت نشده"
            }

            # 2️⃣ اگر توسط ادمین غیرفعال شده
            if g_date in disabled_map:
                result[j_date_str] = {
                    "enabled": False,
                    "reason": disabled_map[g_date]
                }
                continue

            # 3️⃣ اگر منو دارد → فعال
            if g_date in menus_map:
                result[j_date_str] = {
                    "enabled": True,
                    "selected": g_date in selections
                }

        return Response({
            "calendar": "jalali",
            "year": j_year,
            "month": j_month,
            "days": result
        })





# ۱. اضافه کردن API برای دریافت لیست سازمان‌ها (برای نمایش در فرم ثبت‌نام)
class OrganizationListView(generics.ListAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.AllowAny]