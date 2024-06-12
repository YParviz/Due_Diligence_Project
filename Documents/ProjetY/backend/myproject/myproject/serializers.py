# serializers.py
from rest_framework import serializers
from .models import UserProfile, Validation, Company, Analysis

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

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = '__all__'

class CompanySerializer(serializers.ModelSerializer):
    analysis = AnalysisSerializer(read_only=True)

    class Meta:
        model = Company
        fields = '__all__'

