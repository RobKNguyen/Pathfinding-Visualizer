from django.urls import path
from .views import index # DONT FORGET THIS

urlpatterns = [
    path('', index) # call main from views if /''
]