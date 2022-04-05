from django.urls import path

from .views import home, results, upload

urlpatterns = [
    path('', home, name='home'),
    path('results/<str:task_id>/', results, name='results'),
    path('upload/', upload, name='upload'),
]
