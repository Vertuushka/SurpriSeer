from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class Wishlist(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    code = models.CharField(max_length=255)
    color_scheme = models.SmallIntegerField(default=1)
    time_created = models.DateTimeField(default=datetime.now())

class GiftList(models.Model):
    name = models.CharField(max_length=255)
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, null=False)
    booked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, default=None)

class Friend(models.Model):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, null=False)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    is_allowed = models.BooleanField(default=False)

