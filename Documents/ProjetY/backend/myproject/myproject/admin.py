from django.contrib import admin
from .models import UserProfile, Admin, Validation

admin.site.register(UserProfile)
admin.site.register(Admin)
admin.site.register(Validation)
