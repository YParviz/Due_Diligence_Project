from django.contrib.auth.models import User
from .models import UserProfile

# Création de l'utilisateur
user = User.objects.create_user(username='example', email='example@example.com', password='password')

# Création du UserProfile associé
user_profile = UserProfile.objects.create(user=user, company='Example Company')
