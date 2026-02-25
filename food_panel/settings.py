from pathlib import Path
from datetime import timedelta
import os

# =========================================================
# ⚙️ تنظیمات پایه
# =========================================================

# مسیر اصلی پروژه
BASE_DIR = Path(__file__).resolve().parent.parent

# 🚀 اصلاح مهم: تشخیص محیط (لوکال یا لیارا)
# ما فقط به متغیر محیطی که خود لیارا ست می‌کند اعتماد می‌کنیم.
# روی کامپیوتر شما این متغیر وجود ندارد، پس False می‌شود.
IS_LIARA = os.environ.get("LIARA") == "true"

# کلید امنیتی
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-my-local-dev-key-123")

# دیباگ
DEBUG = os.environ.get("DEBUG", "True") == "True"

ALLOWED_HOSTS = [
    "foodpanel.liara.run",
    "fadakfood.liara.run",
    "localhost",
    "127.0.0.1",
    "*"  # موقتاً برای رفع مشکلات دامنه
]


# =========================================================
# 📦 اپلیکیشن‌ها
# =========================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # پکیج‌های کمکی
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "jalali_date",

    # اپلیکیشن‌های من
    "dashboard",
]


# =========================================================
# 🛡️ میدل‌ور (Middleware)
# =========================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # 👈 حتماً باید بالا باشد
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "food_panel.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "food_panel.wsgi.application"


# =========================================================
# 🗄️ دیتابیس (هوشمند: لوکال vs لیارا)
# =========================================================

if IS_LIARA:
    # ☁️ تنظیمات لیارا (PostgreSQL)
    # این کد فقط وقتی روی سرور آپلود شود اجرا می‌شود
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("PGDATABASE", "postgres"),
            "USER": os.environ.get("PGUSER", "root"),
            "PASSWORD": os.environ.get("PGPASSWORD"),
            "HOST": os.environ.get("PGHOST", "foodpanel-db"),
            "PORT": os.environ.get("PGPORT", 5432),
        }
    }
else:
    # 💻 تنظیمات لوکال (SQLite)
    # این کد روی کامپیوتر شما اجرا می‌شود
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# =========================================================
# 🔐 اعتبارسنجی رمز عبور
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# =========================================================
# 🌍 زبان و زمان
# =========================================================

LANGUAGE_CODE = "fa"
TIME_ZONE = "Asia/Tehran"
USE_I18N = True
USE_TZ = True


# =========================================================
# 📂 فایل‌های استاتیک و مدیا
# =========================================================

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

MEDIA_URL = "/media/"

# 🚀 مسیر ذخیره فایل‌ها
if IS_LIARA:
    # روی سرور لیارا (دیسک متصل شده)
    MEDIA_ROOT = "/var/lib/liara/media"
else:
    # روی کامپیوتر شخصی
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# =========================================================
# 👤 مدل کاربر سفارشی
# =========================================================
AUTH_USER_MODEL = "dashboard.User"


# =========================================================
# 🔑 تنظیمات JWT و Rest Framework
# =========================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# =========================================================
# 🌐 تنظیمات CORS و CSRF
# =========================================================

CORS_ALLOW_ALL_ORIGINS = True

CSRF_TRUSTED_ORIGINS = [
    "https://foodpanel.liara.run",
    "https://fadakfood.liara.run",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]