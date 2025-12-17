"""
Serializers for catalog app.
"""

from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, ProductDocument


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for categories."""
    
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'slug', 'name', 'name_ru', 'name_uz', 'name_en',
            'description', 'image', 'icon',
            'parent', 'children', 'product_count',
            'is_active', 'order'
        ]
    
    def get_name(self, obj):
        lang = self._get_language()
        return obj.get_name(lang)
    
    def get_description(self, obj):
        lang = self._get_language()
        return getattr(obj, f'description_{lang}', obj.description_ru)
    
    def get_children(self, obj):
        # Only include for top-level categories
        if obj.parent is None:
            children = obj.children.filter(is_active=True)
            return CategorySerializer(children, many=True, context=self.context).data
        return []
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def _get_language(self):
        request = self.context.get('request')
        if request:
            return request.headers.get('Accept-Language', 'ru')[:2]
        return 'ru'


class CategoryListSerializer(serializers.ModelSerializer):
    """Lightweight category serializer for listings."""
    
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'slug', 'name', 'icon', 'image']
    
    def get_name(self, obj):
        request = self.context.get('request')
        lang = 'ru'
        if request:
            lang = request.headers.get('Accept-Language', 'ru')[:2]
        return obj.get_name(lang)


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for brands."""
    
    description = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = [
            'id', 'slug', 'name', 'country', 'logo',
            'description', 'website', 'is_verified', 'is_featured',
            'product_count'
        ]
    
    def get_description(self, obj):
        request = self.context.get('request')
        lang = 'ru'
        if request:
            lang = request.headers.get('Accept-Language', 'ru')[:2]
        return getattr(obj, f'description_{lang}', obj.description_ru)
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class BrandListSerializer(serializers.ModelSerializer):
    """Lightweight brand serializer for filters."""
    
    class Meta:
        model = Brand
        fields = ['id', 'slug', 'name', 'logo', 'country']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for product images."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order', 'is_schematic']


class ProductDocumentSerializer(serializers.ModelSerializer):
    """Serializer for product documents."""
    
    class Meta:
        model = ProductDocument
        fields = ['id', 'doc_type', 'title', 'file', 'language']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Lightweight product serializer for listings.
    Used in catalog grids and search results.
    """
    
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category = CategoryListSerializer(read_only=True)
    brand = BrandListSerializer(read_only=True)
    pricing = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'slug', 'product_type',
            'name', 'short_description',
            'category', 'brand',
            'main_image', 'pricing',
            'stock_status', 'is_featured'
        ]
    
    def get_name(self, obj):
        lang = self._get_language()
        return obj.get_name(lang)
    
    def get_short_description(self, obj):
        lang = self._get_language()
        desc = getattr(obj, f'short_description_{lang}', None)
        return desc if desc else obj.short_description_ru
    
    def get_pricing(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        price_usd, can_see = obj.get_price_for_user(user)
        
        return {
            'show_to_guests': obj.show_price_to_guests,
            'can_see_price': can_see,
            'price_usd': float(price_usd) if price_usd else None,
            # Mock UZS conversion (12,800 rate)
            'price_uzs': int(float(price_usd) * 12800) if price_usd else None,
        }
    
    def _get_language(self):
        request = self.context.get('request')
        if request:
            return request.headers.get('Accept-Language', 'ru')[:2]
        return 'ru'


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Full product serializer for detail pages.
    """
    
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    full_description = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    documents = ProductDocumentSerializer(many=True, read_only=True)
    pricing = serializers.SerializerMethodField()
    specifications_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'slug', 'product_type',
            'name', 'name_ru', 'name_uz', 'name_en',
            'short_description', 'full_description',
            'category', 'brand',
            'main_image', 'images', 'video_url',
            'pricing',
            'stock_status', 'stock_quantity', 'warehouse_location',
            'weight_kg', 'length_cm', 'width_cm', 'height_cm',
            'ships_from', 'estimated_delivery_days',
            'specifications', 'specifications_formatted',
            'documents',
            'is_featured', 'is_configurable',
            'meta_title_ru', 'meta_description_ru',
            'view_count', 'created_at'
        ]
    
    def get_name(self, obj):
        lang = self._get_language()
        return obj.get_name(lang)
    
    def get_short_description(self, obj):
        lang = self._get_language()
        desc = getattr(obj, f'short_description_{lang}', None)
        return desc if desc else obj.short_description_ru
    
    def get_full_description(self, obj):
        lang = self._get_language()
        desc = getattr(obj, f'full_description_{lang}', None)
        return desc if desc else obj.full_description_ru
    
    def get_pricing(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        price_usd, can_see = obj.get_price_for_user(user)
        
        return {
            'show_to_guests': obj.show_price_to_guests,
            'can_see_price': can_see,
            'base_usd': float(obj.base_price_usd) if can_see else None,
            'retail_usd': float(obj.retail_price_usd) if obj.retail_price_usd and can_see else None,
            'wholesale_usd': float(obj.wholesale_price_usd) if obj.wholesale_price_usd and can_see else None,
            'user_price_usd': float(price_usd) if price_usd else None,
            'user_price_uzs': int(float(price_usd) * 12800) if price_usd else None,
        }
    
    def get_specifications_formatted(self, obj):
        """Format specifications with labels in current language."""
        specs = obj.specifications
        if not specs:
            return []
        
        lang = self._get_language()
        formatted = []
        
        # Spec labels in Russian
        labels = {
            'horsepower': {'ru': 'Мощность', 'uz': 'Quvvat', 'en': 'Power'},
            'engine_type': {'ru': 'Двигатель', 'uz': 'Dvigatel', 'en': 'Engine'},
            'transmission': {'ru': 'КПП', 'uz': 'Uzatma', 'en': 'Transmission'},
            'fuel_capacity': {'ru': 'Топливный бак', 'uz': "Yoqilg'i sig'imi", 'en': 'Fuel Tank'},
            'working_width': {'ru': 'Рабочая ширина', 'uz': 'Ish kengligi', 'en': 'Working Width'},
            'weight': {'ru': 'Вес', 'uz': "Og'irlik", 'en': 'Weight'},
        }
        
        for key, value in specs.items():
            label = labels.get(key, {}).get(lang, key.replace('_', ' ').title())
            
            if isinstance(value, dict):
                val = value.get('value', '')
                unit = value.get('unit', '')
                formatted.append({
                    'key': key,
                    'label': label,
                    'value': f"{val} {unit}".strip()
                })
            else:
                formatted.append({
                    'key': key,
                    'label': label,
                    'value': str(value)
                })
        
        return formatted
    
    def _get_language(self):
        request = self.context.get('request')
        if request:
            return request.headers.get('Accept-Language', 'ru')[:2]
        return 'ru'
