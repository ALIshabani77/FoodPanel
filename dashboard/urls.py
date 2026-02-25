from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ResetPasswordView,
    DailyMenuListView,
    TodayMenuView,
    UserMealSelectionCreateView,
    UserMealSelectionsListView,
    UserMealSelectionDetailView,
    PendingFeedbackListView,
    FeedbackCreateView,
    FoodRatingView,
    DailyOrdersReport,
    MonthlyOrdersStatus,
    UserProfileView,
    MonthlyMenuStatusView,
    OrganizationListView
    # CalendarMonthView
)

urlpatterns = [
    # --- احراز هویت (Auth) ---
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    
    # --- پروفایل کاربری ---
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    # --- منوی غذا ---
    path('menu/', DailyMenuListView.as_view(), name='daily-menu-list'),
    path('menu/today/', TodayMenuView.as_view(), name='today-menu'),
    path('menu/select/', UserMealSelectionCreateView.as_view(), name='select-food'),

    # --- انتخاب‌های کاربر ---
    # لیست انتخاب‌ها (همان آدرس قبلی بماند چون برای نمایش لیست است)
    path('user-selections/', UserMealSelectionsListView.as_view(), name='user-selections'),
    
    # ✅ اصلاح شده: تغییر آدرس حذف برای هماهنگی با فرانت‌اند
    # قبلاً: user-selections/<int:pk>/
    # الان: selection/<int:pk>/
    path('selection/<int:pk>/', UserMealSelectionDetailView.as_view(), name='delete-selection'),

    # --- گزارشات و داشبورد ---
    path('daily-orders-report/', DailyOrdersReport.as_view(), name='daily-orders-report'),
    path('monthly-orders-status/', MonthlyOrdersStatus.as_view(), name='monthly-orders-status'),
    
    # --- بازخورد و امتیاز ---
    path('feedback/pending/', PendingFeedbackListView.as_view(), name='feedback-pending'),
    path('feedback/create/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('food-ratings/', FoodRatingView.as_view(), name='food-ratings'),

    # path(
    #     "calendar/month/<int:year>/<int:month>/",
    #     CalendarMonthView.as_view()
    #     ),

    path(
    "menu/month-status/",
    MonthlyMenuStatusView.as_view(),
    name="menu-month-status"
),

    path('organizations/', OrganizationListView.as_view(), name='org-list')

]