from django.urls import path, include
from . views import *

urlpatterns = [
    path('', dashboard, name="dashboard"),
    path('new/', newWishList, name="newWishList"),
    path('list/<str:token>/', wishList, name="wishList"),
    path('list/<str:token>/adduser/<int:userid>/', addUserById, name="addUserById"),
    path('list/<str:token>/deleteuser/<int:userid>/', deleteUserById, name="deleteUserById"),
    path('list/<str:token>/unbook/<int:giftid>/', unbookById, name="unbookById"),
    path('list/<str:token>/book/<int:giftid>/', bookById, name="bookById"),
]