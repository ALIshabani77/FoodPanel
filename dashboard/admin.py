# from django.contrib import admin
# from .models import Food, DailyMenu, UserMealSelection

# @admin.register(Food)
# class FoodAdmin(admin.ModelAdmin):
#     list_display = ('id', 'name')

# @admin.register(DailyMenu)
# class DailyMenuAdmin(admin.ModelAdmin):
#     list_display = ('id', 'date')
#     filter_horizontal = ('foods',)  # برای انتخاب چند غذا راحت‌تر

# @admin.register(UserMealSelection)
# class UserMealSelectionAdmin(admin.ModelAdmin):
#     list_display = ('id', 'user', 'menu', 'selected_food', 'created_at')
#     list_filter = ('menu', 'user')






# from django.contrib import admin
# from .models import Food, DailyMenu, UserMealSelection,Feedback
# from jalali_date import date2jalali, datetime2jalali
# from jalali_date.admin import ModelAdminJalaliMixin


# # 🍽️ مدیریت مدل غذا
# @admin.register(Food)
# class FoodAdmin(admin.ModelAdmin):
#     list_display = ('id', 'name', 'description', 'photo_preview')
#     search_fields = ('name',)

#     def photo_preview(self, obj):
#         if obj.photo:
#             return f'<img src="{obj.photo.url}" width="60" style="border-radius:8px;">'
#         return '—'
#     photo_preview.allow_tags = True
#     photo_preview.short_description = 'تصویر'


# # 📅 مدیریت مدل DailyMenu با تاریخ شمسی
# @admin.register(DailyMenu)
# class DailyMenuAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
#     list_display = ('id', 'get_jalali_date',)
#     filter_horizontal = ('foods',)
#     ordering = ('-date',)

#     def get_jalali_date(self, obj):
#         return date2jalali(obj.date)
#     get_jalali_date.short_description = "تاریخ (شمسی)"


# # 🍛 مدیریت انتخاب غذای کاربر با تاریخ شمسی
# @admin.register(UserMealSelection)
# class UserMealSelectionAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
#     list_display = ('id', 'user', 'menu', 'selected_food', 'get_jalali_created_at')
#     list_filter = ('menu', 'user')
#     ordering = ('-created_at',)

#     def get_jalali_created_at(self, obj):
#         return datetime2jalali(obj.created_at).strftime('%Y/%m/%d - %H:%M')
#     get_jalali_created_at.short_description = "تاریخ ایجاد (شمسی)"




# @admin.register(Feedback)
# class FeedbackAdmin(admin.ModelAdmin):
#     list_display = ('user', 'food', 'rating', 'created_at')
#     list_filter = ('rating', 'created_at')
#     search_fields = ('user__username', 'food__name')


















from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Employee, Food, DailyMenu, UserMealSelection, Feedback ,DisabledDay, Organization
from jalali_date import date2jalali, datetime2jalali
from jalali_date.admin import ModelAdminJalaliMixin

# 👤 مدیریت مدل کاربر اختصاصی (Custom User)
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # نمایش فیلدها در لیست کاربران
    list_display = ('username', 'email', 'first_name', 'last_name', 'department', 'organization', 'is_staff')
    # فیلترها
    list_filter = ('is_staff', 'is_superuser',  'organization','department')
    # فیلدهای قابل جستجو
    search_fields = ('username', 'first_name', 'last_name', 'email', 'department')
    
    # اضافه کردن فیلد دپارتمان به فرم ویرایش کاربر در ادمین
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات سازمانی فدک', {'fields': ('organization','department', 'avatar')}),
    )
    # اضافه کردن فیلد دپارتمان به فرم ساخت کاربر جدید
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('اطلاعات سازمانی فدک', {'fields': ('first_name', 'last_name',  'organization','department', 'avatar')}),
    )

# 🍽️ مدیریت مدل غذا
@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'photo_preview')
    search_fields = ('name',)

    def photo_preview(self, obj):
        if obj.photo:
            return f'<img src="{obj.photo.url}" width="50" style="border-radius:5px;">'
        return '—'
    photo_preview.allow_tags = True
    photo_preview.short_description = 'تصویر'

@admin.register(DailyMenu)
class DailyMenuAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
    # ⭐ organization را فقط در list_display و list_filter قرار بده
    list_display = ('id', 'get_jalali_date', 'organization') 
    list_filter = ('organization', 'date')
    
    # ⭐ در اینجا فقط باید نام فیلد ManyToMany (یعنی foods) باشد
    filter_horizontal = ('foods',) 

    ordering = ('-date',)

    def get_jalali_date(self, obj):
        return date2jalali(obj.date)
    get_jalali_date.short_description = "تاریخ شمسی"

    # اعمال فیلتر برای ادمین‌های شعبه (Staff)
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(organization=request.user.organization)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')



# اصلاح سایر ادمین‌ها برای فیلتر کردن داده‌ها
class BranchBaseAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # ⭐ اگر ادمین معمولی (Staff) بود، فقط دیتای سازمان خودش را ببیند
        return qs.filter(organization=request.user.organization) if hasattr(qs.model, 'organization') else qs
# 🍛 مدیریت انتخاب‌های کاربر
@admin.register(UserMealSelection)
class UserMealSelectionAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
    list_display = ('user', 'get_menu_date', 'selected_food', 'get_created_at_jalali')
    list_filter = ('user', 'selected_food', 'menu__date')
    search_fields = ('user__username', 'selected_food__name')

    def get_menu_date(self, obj):
        return date2jalali(obj.menu.date)
    get_menu_date.short_description = "تاریخ وعده"

    def get_created_at_jalali(self, obj):
        return datetime2jalali(obj.created_at).strftime('%Y/%m/%d - %H:%M')
    get_created_at_jalali.short_description = "زمان ثبت"


    # ⭐ فیلتر سفارشات بر اساس سازمان کاربر
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user__organization=request.user.organization)

# ⭐ مدیریت بازخوردها
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'food', 'rating', 'get_created_jalali')
    list_filter = ('rating', 'food')
    
    def get_created_jalali(self, obj):
        return datetime2jalali(obj.created_at).strftime('%Y/%m/%d')
    get_created_jalali.short_description = "تاریخ ثبت"

# 👷 مدیریت مدل Employee (اگر جدا استفاده می‌شود)
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'created_at')





@admin.register(DisabledDay)
class DisabledDayAdmin(ModelAdminJalaliMixin, admin.ModelAdmin):
    list_display = ("date", "reason")
    search_fields = ("date", "reason")




