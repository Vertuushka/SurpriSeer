from django.urls import path, include
from . import views

urlpatterns = [
    path('privacy/', views.privacy, name="privacy"),
    path('tos/', views.tos, name="tos"),
]