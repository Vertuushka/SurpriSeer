from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.homepage, name="homepage"),
    path('info/', include('info.urls')),
    path('dev/', views.under_development, name="under_development")
]