from django.urls import path
from .views import SimpleLoginView

urlpatterns = [
    path('simple-login/', SimpleLoginView.as_view(), name='simple-login'),
]
