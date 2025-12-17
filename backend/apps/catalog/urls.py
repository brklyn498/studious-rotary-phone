"""
URL patterns for catalog app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    BrandViewSet,
    ProductViewSet,
    SearchView,
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('brands', BrandViewSet, basename='brand')
router.register('products', ProductViewSet, basename='product')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Search
    path('search/', SearchView.as_view(), name='search'),
]
