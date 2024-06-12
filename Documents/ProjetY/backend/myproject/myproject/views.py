import os
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Analysis, UserProfile, Validation
from .serializers import AnalysisSerializer, CompanySerializer, UserProfileSerializer, ValidationSerializer
from rest_framework import status
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import login
from . import serializers
from django.http import HttpResponse
from django.contrib.auth.models import User

from django.http import HttpResponseNotFound
from django.http import JsonResponse
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from .models import Company
from rest_framework.parsers import MultiPartParser
from django.contrib.auth import logout
from django.http import HttpResponseBadRequest


def ignore_login(request):
    return HttpResponse(status=204)

from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    try:
        print("Received request for user list")
        users = UserProfile.objects.all()
        serializer = UserProfileSerializer(users, many=True)
        print(f"Returning {len(users)} users")
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_user_details(request, user_id):
    user = UserProfile.objects.filter(user_id=user_id).first()
    if user:
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    else:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET', 'PATCH', 'DELETE'])
def validate_user(request, user_id):
    if request.method == 'GET':
        validation = get_object_or_404(Validation, user_profile__user_id=user_id)
        serializer = ValidationSerializer(validation)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        validation = get_object_or_404(Validation, user_profile__user_id=user_id)
        is_validated = request.data.get('is_validated', False)
        validation.is_validated = is_validated
        validation.save()
        return Response({'message': 'Validation status updated successfully'})
    
    elif request.method == 'DELETE':
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        if request.path.endswith('/icon.ico'):
            return HttpResponseNotFound()

        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        company = request.data.get('company')

        if not all([username, email, password, company]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password)
        user_profile = UserProfile.objects.create(user=user, company=company)

        Validation.objects.create(user_profile=user_profile, is_validated=False)
        serializer = UserProfileSerializer(instance=user_profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        user_profile = UserProfile.objects.get(user=user)
        if not user_profile.validation.is_validated:
            return Response({'error': 'User not validated'}, status=status.HTTP_400_BAD_REQUEST)
        
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'isAdmin': user.is_superuser,
            'username': user.username
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    try:
        # Récupérer l'utilisateur connecté à partir de la requête
        user = request.user
        
        # Récupérer les informations de l'utilisateur
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Ajoutez d'autres champs d'informations de l'utilisateur si nécessaire
            'isAdmin': user.is_superuser
        }
        # Retourner les informations de l'utilisateur
        return Response(user_data)
    except Exception as e:
        # En cas d'erreur, renvoyer une réponse avec un message d'erreur
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_company(request):
    company_name = request.data.get('company')
    if not company_name:
        return Response({'error': 'Company name is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Retrieve the user from the request
        user = request.user
        
        # Create a new company associated with the current user
        company = Company.objects.create(name=company_name, user=user)
        
        # Create a corresponding Analysis record for the newly created company
        analysis = Analysis.objects.create(company=company, score=0, accuracy=0.0, risk=0.0, summary='')
        
        return Response({'message': 'Company created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_companies(request):
    user = request.user
    companies = Company.objects.filter(user=user)
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_analysis(request, company_id):
    user = request.user
    company = get_object_or_404(Company, id=company_id, user=user)
    analysis = get_object_or_404(Analysis, company=company)
    serializer = AnalysisSerializer(analysis)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_analysis(request, company_id):
    user = request.user
    company = get_object_or_404(Company, id=company_id, user=user)
    analysis = get_object_or_404(Analysis, company=company)
    serializer = AnalysisSerializer(analysis, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_company(request, company_id):
    try:
        company = get_object_or_404(Company, id=company_id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_company(request, company_id):
    try:
        company = get_object_or_404(Company, id=company_id)
        company.delete()
        return Response({'message': 'Company deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
@permission_classes([AllowAny])
def upload_document(request):
    try:
        company_id = request.data.get('company_id')
        company = get_object_or_404(Company, id=company_id)

        document = request.FILES['document']

        # Vérifiez que le fichier est un PDF
        if document.content_type != 'application/pdf':
            return HttpResponseBadRequest("Seuls les fichiers PDF sont acceptés.")

        # Définir le chemin de stockage
        upload_dir = os.path.join('media', 'documents', str(company_id))
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        document_path = os.path.join(upload_dir, document.name)

        with open(document_path, 'wb+') as destination:
            for chunk in document.chunks():
                destination.write(chunk)

        # Mettez à jour le statut de l'entreprise après le téléchargement du document
        company.status = 'Pending'  # Laissez ce statut à 'Pending' pour l'exemple
        company.document_status = 'Uploaded'  # Nouveau statut pour les documents
        company.save()

        return Response({'message': 'Document uploaded successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_document_status(request, company_id):
    try:
        company = get_object_or_404(Company, id=company_id)
        return Response({'status': company.status}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Assurez-vous que seuls les utilisateurs authentifiés peuvent accéder à cette vue
def update_user_details(request, user_id):
    try:
        # Récupérez l'utilisateur à mettre à jour
        user_profile = get_object_or_404(UserProfile, user_id=user_id)

        # Assurez-vous que l'utilisateur actuel met à jour ses propres détails
        if request.user != user_profile.user:
            return Response({'error': 'You do not have permission to update this user\'s details'}, status=status.HTTP_403_FORBIDDEN)

        # Serialisez les données de la demande
        serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
        if serializer.is_valid():
            # Enregistrez les modifications
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
