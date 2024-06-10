# models.py
from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.CharField(max_length=100)

    class Meta:
        app_label = 'myproject'

    def __str__(self):
        return self.user.username

class Validation(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='validation', null=True)
    is_validated = models.BooleanField(default=False)

    class Meta:
        app_label = 'myproject'

    def __str__(self):
        return f"{self.user_profile.user.username} - {'Validated' if self.is_validated else 'Pending'}"

@receiver(post_save, sender=UserProfile)
def create_validation(sender, instance, created, **kwargs):
    if created:
        Validation.objects.create(user_profile=instance)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        app_label = 'myproject'

    def __str__(self):
        return self.user.username

class Company(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='Pending')
    address = models.TextField(null=True, blank=True)
    document_status = models.CharField(max_length=50, default='Not Uploaded')  # Nouveau champ

    def __str__(self):
        return self.name

class Analysis(models.Model):
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='analysis')
    score = models.IntegerField()
    accuracy = models.FloatField()
    risk = models.FloatField()
    summary = models.TextField()
