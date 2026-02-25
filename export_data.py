import os
import django
import io
from django.core.management import call_command

# 🔥 مشخص کردن فایل تنظیمات جنگو
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "food_panel.settings")

django.setup()

out = io.StringIO()

# گرفتن خروجی دیتابیس بدون جدول‌های اضافی
call_command(
    "dumpdata",
    exclude=["auth.permission", "contenttypes"],
    stdout=out
)

data = out.getvalue()

# ذخیره‌ی فایل JSON با UTF-8
with open("data.json", "w", encoding="utf-8") as f:
    f.write(data)

print("✅ Export done! File created → data.json")
