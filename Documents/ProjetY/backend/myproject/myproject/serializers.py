from rest_framework import serializers
from .models import UserProfile, Validation
from .models import Company

class ValidationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Validation
        fields = ['is_validated']

class UserProfileSerializer(serializers.ModelSerializer):
    company = serializers.CharField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    id = serializers.IntegerField(source='user.id', read_only=True)
    validation = ValidationSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'company', 'validation']
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'