from django.shortcuts import render, redirect
import secrets
from django.db.models import Q
import math
from . models import *
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    if request.method == "POST":
        title = request.POST.get('title')
        gifts = []
        for k, v in request.POST.items():
            if k.startswith('gift_'):
                gifts.append(v)
        color = int(request.POST.get('colorPicker'))
        invite_link = request.COOKIES.get('invite_link')
        try:
            wishlist = Wishlist.objects.get(code=invite_link)
            wishlist.name = title
            wishlist.color_scheme = color
            wishlist.save()
        except:
            wishlist = Wishlist.objects.create(name=title, user=request.user, code=invite_link, color_scheme=color)

    
        existing_items = GiftList.objects.filter(wishlist=wishlist)
        existing_values = set(item.name for item in existing_items)
        input_values = set(filter(lambda x: x.strip() != "", gifts))
        to_delete = existing_values - input_values
        GiftList.objects.filter(wishlist=wishlist, name__in=to_delete).delete()
        to_add = input_values - existing_values
        for value in to_add:
            GiftList.objects.create(wishlist=wishlist, name=value)

    own_wishlists = Wishlist.objects.filter(user=request.user)
    shared_wishlists = Wishlist.objects.filter(friend__friend=request.user)

    user_wishlists = own_wishlists.union(shared_wishlists)
    context = {
        'user_wishLists': user_wishlists
    }

    try:
        context['alert_content'] = request.session['alert_content']
    except:
        pass
    request.session.pop('alert_content', None)

    return render(request, 'dashboard.html', context)

@login_required
def newWishList(request):
    
    invite_token = secrets.token_urlsafe(5)

    context = {
        'invite_code':invite_token,
    }

    response = render(request, 'new.html', context)
    response.delete_cookie('invite_link')
    return response

@login_required
def wishList(request, token):
    context = {}
    is_friend_visitor = False
    try:
        wishlist = Wishlist.objects.get(code=token)
    except:
        context['error_content'] = "The wishlist you are trying to access doesn't exists"
        return render(request, 'error.html', context)
    if request.method == "POST":
        if wishlist.user == request.user:
            return redirect('wishList', token)
        
    if wishlist.user != request.user:
        try:
            is_inList = Friend.objects.get(wishlist=wishlist, friend=request.user)
            if not is_inList.is_allowed:
                request.session['alert_content'] = "Request is already sent. Wishlist's owner should approve your request before you can see this list"
                return redirect('dashboard')
            else:
                is_friend_visitor = True
        except:
            new_friend = Friend.objects.create(wishlist=wishlist, friend=request.user)
            request.session['alert_content'] = "Your request is sent"
            return redirect('dashboard')
    
    context["wishlist"] = wishlist

    try:
        friends = Friend.objects.filter(wishlist=wishlist)
        context["friends"] = friends
        print(friends)
    except:
        pass

    try:
        wishes = GiftList.objects.filter(wishlist=wishlist)
        context["gifts"] = wishes
    except:
        pass

    if is_friend_visitor:
        try:
            friend = Friend.objects.get(friend=request.user)
            context["friend"] = friend
        except:
            pass

    return render(request, 'editlist.html', context)

@login_required
def addUserById(request, token, userid):
    try:
        wishlist = Wishlist.objects.get(user=request.user, code=token)
        if request.user == wishlist.user:
            friend_user = User.objects.get(id=userid)
            friend = Friend.objects.get(wishlist=wishlist, friend=friend_user)
            friend.is_allowed = True
            friend.save()
    except:
        pass
    return redirect('wishList', token)

@login_required
def deleteUserById(request, token, userid):
    try:
        wishlist = Wishlist.objects.get(user=request.user, code=token)
        friend_user = User.objects.get(id=userid)
        if request.user == wishlist.user or request.user == friend_user:
            friend = Friend.objects.get(wishlist=wishlist, friend=friend_user)
            friend.delete()
            giftsOfUser = GiftList.objects.filter(booked_by=friend_user)
            for gift in giftsOfUser:
                gift.booked_by = None
                gift.save()
    except:
        pass
    return redirect('wishList', token)

@login_required
def unbookById(request, token, giftid):
    try:
        gift = GiftList.objects.get(id=giftid)
        if gift.booked_by == request.user:
            gift.booked_by = None
            gift.save()
    except:
        pass
    return redirect('wishList', token)

@login_required
def bookById(request, token, giftid):
    try:
        gift = GiftList.objects.get(id=giftid)
        wishlist = Wishlist.objects.get(code=token)
        friend_user = Friend.objects.get(wishlist=wishlist, friend=request.user)
        if gift.booked_by == None:
            gift.booked_by = request.user
            gift.save()
    except:
        pass
    return redirect('wishList', token)