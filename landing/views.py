from django.shortcuts import render

# Create your views here.
def homepage(request):
    return render(request, 'landing.html')

def under_development(request):
    return render(request, 'development.html')