from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model







class Organization(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام شعبه/دفتر")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.PROTECT, # جلوگیری از حذف سازمان در صورت داشتن کاربر
        null=True, 
        blank=True, 
        related_name="users",
        verbose_name="سازمان"
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    


class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    




# مدل غذا
class Food(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام غذا")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات غذا")
    photo = models.ImageField(upload_to='foods/', blank=True, null=True, verbose_name="عکس غذا")
    

    def __str__(self):
        return self.name


# مدل منوی روزانه
# در فایل models.py
class DailyMenu(models.Model):
    # ⭐ تغییر اصلی: حذف unique=True
    date = models.DateField(verbose_name="تاریخ") 
    foods = models.ManyToManyField(Food, related_name='menus', verbose_name="غذاهای این روز")
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        verbose_name="سازمان"
    )

    class Meta:
        # این خط درست است و باعث می‌شود (تاریخ + سازمان) با هم یکتا باشند
        unique_together = ('date', 'organization')
        verbose_name = "منوی روزانه"
        verbose_name_plural = "منوهای روزانه"

    def __str__(self):
        org_name = self.organization.name if self.organization else "بدون سازمان"
        return f"منوی {org_name} - {self.date}"
    
    
# مدل انتخاب غذای کاربر
class UserMealSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
    menu = models.ForeignKey(DailyMenu, on_delete=models.CASCADE, verbose_name="Daily Menu")
    selected_food = models.ForeignKey(Food, on_delete=models.CASCADE, verbose_name="Selected Food")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")

    class Meta:
        unique_together = ('user', 'menu')
        verbose_name = "Meal Selection"
        verbose_name_plural = "Meal Selections"

    def __str__(self):
        return f"{self.user.username} - {self.menu.date} → {self.selected_food.name}"





User = get_user_model()

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedbacks")
    selection = models.ForeignKey(UserMealSelection, on_delete=models.CASCADE, related_name="feedbacks")
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name="feedbacks", null=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "selection")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} → {self.food.name} ({self.rating}⭐)"




class DisabledDay(models.Model):
    date = models.DateField(unique=True, verbose_name="تاریخ")
    reason = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="دلیل غیرفعال بودن"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.date} ❌"
    




