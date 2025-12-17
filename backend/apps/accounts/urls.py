"""
URL patterns for accounts app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegionViewSet,
    UserProfileView,
    UserRegistrationView,
    BusinessProfileView,
    INNVerificationView,
)

router = DefaultRouter()
router.register('regions', RegionViewSet, basename='region')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Authentication
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/verify-inn/', INNVerificationView.as_view(), name='verify_inn'),
    
    # User profile
    path('users/me/', UserProfileView.as_view(), name='user_profile'),
    path('users/me/business/', BusinessProfileView.as_view(), name='business_profile'),
]
