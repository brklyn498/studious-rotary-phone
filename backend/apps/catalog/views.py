"""
Views for catalog app.
"""

from rest_framework import viewsets, generics, status, throttling
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Brand, Product
from .serializers import (
    CategorySerializer, CategoryListSerializer,
    BrandSerializer, BrandListSerializer,
    ProductListSerializer, ProductDetailSerializer
)
from .filters import ProductFilter


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for product categories.
    
    GET /api/v1/categories/ - List all categories (tree structure)
    GET /api/v1/categories/{slug}/ - Category detail
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # For list, return only top-level categories (children are nested)
        if self.action == 'list':
            return queryset.filter(parent__isnull=True).order_by('order')
        return queryset
    
    @action(detail=False, methods=['get'])
    def flat(self, request):
        """
        Get flat list of all categories (for filters).
        GET /api/v1/categories/flat/
        """
        categories = Category.objects.filter(is_active=True).order_by('order')
        serializer = CategoryListSerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for brands/manufacturers.
    
    GET /api/v1/brands/ - List all brands
    GET /api/v1/brands/{slug}/ - Brand detail
    """
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'country']
    ordering_fields = ['name', 'country']
    ordering = ['name']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured brands.
        GET /api/v1/brands/featured/
        """
        brands = Brand.objects.filter(is_active=True, is_featured=True)
        serializer = BrandListSerializer(brands, many=True, context={'request': request})
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for products.
    
    GET /api/v1/products/ - List products with filtering
    GET /api/v1/products/{slug}/ - Product detail
    """
    queryset = Product.objects.filter(is_active=True).select_related('category', 'brand')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name_ru', 'name_en', 'sku', 'short_description_ru']
    ordering_fields = ['base_price_usd', 'created_at', 'name_ru', 'view_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Get product detail and increment view count."""
        instance = self.get_object()
        
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured products.
        GET /api/v1/products/featured/
        """
        products = self.get_queryset().filter(is_featured=True)[:12]
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """
        Get related products (same category).
        GET /api/v1/products/{slug}/related/
        """
        product = self.get_object()
        related = self.get_queryset().filter(
            category=product.category
        ).exclude(id=product.id)[:6]
        serializer = ProductListSerializer(related, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def compare(self, request):
        """
        Compare products by IDs.
        GET /api/v1/products/compare/?ids=1,2,3
        """
        ids = request.query_params.get('ids', '')
        if not ids:
            return Response({'error': 'Укажите параметр ids'}, status=400)
        
        try:
            product_ids = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            return Response({'error': 'Некорректный формат ids'}, status=400)
        
        if len(product_ids) > 4:
            return Response({'error': 'Максимум 4 товара для сравнения'}, status=400)
        
        products = self.get_queryset().filter(id__in=product_ids)
        serializer = ProductDetailSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class SearchView(generics.GenericAPIView):
    """
    Global search endpoint.
    GET /api/v1/search/?q=traktor
    
    NOTE: This is a simple implementation.
    In production, use MeiliSearch for better results.
    """
    permission_classes = [AllowAny]
    throttle_classes = [throttling.ScopedRateThrottle]
    throttle_scope = 'search'
    
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        # Security: Limit query length to prevent DoS via massive regex/filtering
        if len(query) > 100:
            query = query[:100]

        if not query or len(query) < 2:
            return Response({
                'products': [],
                'categories': [],
                'brands': []
            })
        
        # Search products
        products = Product.objects.filter(
            is_active=True
        ).filter(
            models.Q(name_ru__icontains=query) |
            models.Q(name_en__icontains=query) |
            models.Q(sku__icontains=query)
        )[:10]
        
        # Search categories
        categories = Category.objects.filter(
            is_active=True
        ).filter(
            models.Q(name_ru__icontains=query) |
            models.Q(name_en__icontains=query)
        )[:5]
        
        # Search brands
        brands = Brand.objects.filter(
            is_active=True
        ).filter(name__icontains=query)[:5]
        
        return Response({
            'products': ProductListSerializer(products, many=True, context={'request': request}).data,
            'categories': CategoryListSerializer(categories, many=True, context={'request': request}).data,
            'brands': BrandListSerializer(brands, many=True, context={'request': request}).data,
        })


# Import models for Q objects
from django.db import models
