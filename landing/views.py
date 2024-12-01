from django.shortcuts import render

# Create your views here.
def homepage(request):
    print("l page")
    return render(request, 'landing.html')