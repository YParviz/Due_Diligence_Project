from django.contrib import admin
from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('login/', views.ignore_login),  # Ignorer la route /login/
    path('admin/', admin.site.urls),
    path('api/users/', views.get_users, name='api_get_users'),
    path('api/validate/<int:user_id>/', views.validate_user, name='validate_user'),
    path('api/user-details/<int:user_id>/', views.get_user_details, name='get_user_details'),
    path('api/register/', views.register_user, name='register_user'),
    path('api/login/', views.login_user, name='login_user'),
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
    # Ajoutez une route pour obtenir les informations de l'utilisateur connecté
    path('api/user/', views.get_user, name='api_get_user'),
]
