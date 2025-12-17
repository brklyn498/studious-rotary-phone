"""
Filters for catalog app.
"""

from django_filters import rest_framework as filters
from .models import Product, Category, Brand


class ProductFilter(filters.FilterSet):
    """
    Filter for product listings.
    Supports filtering by category, brand, price range, stock status, and specs.
    """
    
    # Basic filters
    category = filters.CharFilter(field_name='category__slug')
    brand = filters.CharFilter(method='filter_brands')
    product_type = filters.ChoiceFilter(choices=Product.ProductType.choices)
    stock_status = filters.ChoiceFilter(choices=Product.StockStatus.choices)
    is_featured = filters.BooleanFilter()
    
    # Price range (USD)
    min_price = filters.NumberFilter(field_name='base_price_usd', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='base_price_usd', lookup_expr='lte')
    
    # Search
    search = filters.CharFilter(method='filter_search')
    
    # Technical specs (dynamic)
    spec_horsepower_min = filters.NumberFilter(method='filter_spec_range')
    spec_horsepower_max = filters.NumberFilter(method='filter_spec_range')
    spec_working_width_min = filters.NumberFilter(method='filter_spec_range')
    spec_working_width_max = filters.NumberFilter(method='filter_spec_range')
    
    class Meta:
        model = Product
        fields = [
            'category', 'brand', 'product_type', 'stock_status',
            'is_featured', 'min_price', 'max_price', 'search'
        ]
    
    def filter_brands(self, queryset, name, value):
        """Filter by multiple brands (comma-separated slugs)."""
        if not value:
            return queryset
        slugs = [s.strip() for s in value.split(',')]
        return queryset.filter(brand__slug__in=slugs)
    
    def filter_search(self, queryset, name, value):
        """
        Search in product name, SKU, and description.
        Simple implementation - in production use MeiliSearch.
        """
        if not value:
            return queryset
        return queryset.filter(
            models.Q(name_ru__icontains=value) |
            models.Q(name_uz__icontains=value) |
            models.Q(name_en__icontains=value) |
            models.Q(sku__icontains=value) |
            models.Q(short_description_ru__icontains=value)
        )
    
    def filter_spec_range(self, queryset, name, value):
        """
        Filter by specification range.
        Example: spec_horsepower_min=80 -> specifications__horsepower__value >= 80
        """
        if not value:
            return queryset
        
        # Parse filter name: spec_horsepower_min -> horsepower, min
        parts = name.replace('spec_', '').rsplit('_', 1)
        if len(parts) != 2:
            return queryset
        
        spec_key, bound = parts
        
        # JSONField filtering with PostgreSQL
        # For SQLite in dev, this may not work perfectly
        if bound == 'min':
            return queryset.filter(
                **{f'specifications__{spec_key}__value__gte': value}
            )
        elif bound == 'max':
            return queryset.filter(
                **{f'specifications__{spec_key}__value__lte': value}
            )
        
        return queryset


# Import models for Q objects
from django.db import models
