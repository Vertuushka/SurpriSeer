from django.urls import path, include
from . views import *

urlpatterns = [
    path('', dashboard, name="dashboard"),
    path('new/', newWishList, name="newWishList"),
]