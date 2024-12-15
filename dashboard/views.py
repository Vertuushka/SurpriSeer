from django.shortcuts import render
import secrets
from django.db.models import Q
import math
from . models import *


# Create your views here.
def dashboard(request):
    if request.method == "POST":
        title = request.POST.get('title')
        gifts = []
        for k, v in request.POST.items():
            if k.startswith('gift_'):
                gifts.append(v)
        gifts.pop()
        try:
            color = int(request.POST.get('colorPicker'))
        except:
            color = 1
        invite_link = request.COOKIES.get('invite_link')
        new_list = Wishlist.objects.create(name=title, user=request.user, code=invite_link)
        for gift in gifts:
            GiftList.objects.create(name=gift, wishlist=new_list)
    
    user_wishLists = wishlists = Wishlist.objects.filter(
        Q(user=request.user) | Q(friends=request.user)
    )

    rows = range(math.ceil(user_wishLists.count() / 3))
    
    context = {
        'user_wishLists':zip(rows, user_wishLists)
    }

    return render(request, 'dashboard.html', context)

def newWishList(request):
    
    invite_token = secrets.token_urlsafe(5)

    context = {
        'invite_code':invite_token,
    }

    response = render(request, 'new.html', context)
    response.delete_cookie('invite_link')
    return response