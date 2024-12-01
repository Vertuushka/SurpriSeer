from django.shortcuts import render

# Create your views here.
def privacy(request):
    return render(request, 'privacy.html')

def tos(request):
    return render(request, 'tos.html')

def about(request):
    return render(request, 'about.html')