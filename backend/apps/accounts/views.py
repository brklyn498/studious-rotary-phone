"""
Views for accounts app.
"""

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone

from .models import User, Region, BusinessProfile
from .serializers import (
    UserSerializer, UserCreateSerializer, RegionSerializer,
    BusinessProfileSerializer, INNVerificationSerializer
)


class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for Uzbekistan regions.
    """
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all regions without pagination
    
    def get_queryset(self):
        return Region.objects.all().order_by('name_ru')


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for current user profile.
    GET /api/v1/users/me/ - Get profile
    PATCH /api/v1/users/me/ - Update profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    POST /api/v1/auth/register/
    """
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Регистрация успешна!',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class BusinessProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for business profile.
    GET /api/v1/users/me/business/ - Get business profile
    POST /api/v1/users/me/business/ - Create/update business profile
    """
    serializer_class = BusinessProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        profile, created = BusinessProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'inn': '',
                'company_name': '',
                'legal_address': ''
            }
        )
        return profile


class INNVerificationView(generics.GenericAPIView):
    """
    API endpoint for INN verification via Soliq.uz.
    POST /api/v1/auth/verify-inn/
    
    NOTE: This is a MOCK implementation for development.
    In production, this would call the real Soliq.uz API.
    """
    serializer_class = INNVerificationSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        inn = serializer.validated_data['inn']
        
        # MOCK: Simulate Soliq.uz API response
        # In production, call real API here
        mock_response = self._mock_soliq_verification(inn)
        
        if mock_response is None:
            return Response({
                'error': 'ИНН не найден в системе Soliq.uz'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Update or create business profile
        profile, created = BusinessProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'inn': inn,
                'company_name': mock_response['company_name'],
                'legal_address': mock_response['legal_address'],
                'vat_payer': mock_response['vat_payer'],
                'verified_at': timezone.now(),
                'verification_data': mock_response
            }
        )
        
        # Update user type to business
        request.user.user_type = User.UserType.BUSINESS
        request.user.save()
        
        return Response({
            'message': 'Верификация успешна!',
            'profile': BusinessProfileSerializer(profile).data
        })
    
    def _mock_soliq_verification(self, inn: str):
        """
        MOCK implementation of Soliq.uz API.
        Returns fake company data for testing.
        """
        # Mock data for demo purposes
        mock_companies = {
            '123456789': {
                'inn': '123456789',
                'company_name': 'ООО "АгроТех Ферма"',
                'legal_address': 'г. Ташкент, Мирзо-Улугбекский район, ул. Буюк Ипак Йули, 15',
                'vat_payer': True,
                'status': 'active'
            },
            '987654321': {
                'inn': '987654321',
                'company_name': 'ЧП "Фермерское хозяйство Навои"',
                'legal_address': 'Навоийская область, г. Навои, ул. Галаба, 42',
                'vat_payer': False,
                'status': 'active'
            },
        }
        
        # Return mock data if INN matches, otherwise return generic data
        if inn in mock_companies:
            return mock_companies[inn]
        
        # For any other INN, generate fake data
        return {
            'inn': inn,
            'company_name': f'ООО "Тест Компания {inn[:4]}"',
            'legal_address': 'г. Ташкент, тестовый адрес',
            'vat_payer': False,
            'status': 'active'
        }
