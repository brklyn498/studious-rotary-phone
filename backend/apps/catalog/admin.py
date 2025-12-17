"""
Admin configuration for catalog app.
"""

from django.contrib import admin
from .models import Category, Brand, Product, ProductImage, ProductDocument


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductDocumentInline(admin.TabularInline):
    model = ProductDocument
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_ru', 'slug', 'parent', 'order', 'is_active']
    list_filter = ['is_active', 'parent']
    search_fields = ['name_ru', 'name_uz', 'name_en', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}
    ordering = ['order', 'name_ru']


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'is_verified', 'is_featured', 'is_active']
    list_filter = ['country', 'is_verified', 'is_featured', 'is_active']
    search_fields = ['name', 'country']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'sku', 'name_ru', 'category', 'brand',
        'base_price_usd', 'stock_status', 'is_featured', 'is_active'
    ]
    list_filter = [
        'product_type', 'category', 'brand',
        'stock_status', 'is_featured', 'is_active'
    ]
    search_fields = ['sku', 'name_ru', 'name_en', 'slug']
    prepopulated_fields = {'slug': ('name_en',)}
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': (
                'sku', 'slug', 'product_type',
                'category', 'brand'
            )
        }),
        ('Названия', {
            'fields': (
                'name_ru', 'name_uz', 'name_en',
            )
        }),
        ('Описания', {
            'fields': (
                'short_description_ru', 'short_description_uz', 'short_description_en',
                'full_description_ru', 'full_description_uz', 'full_description_en',
            ),
            'classes': ('collapse',)
        }),
        ('Цены', {
            'fields': (
                'base_price_usd', 'retail_price_usd', 'wholesale_price_usd',
                'show_price_to_guests'
            )
        }),
        ('Склад', {
            'fields': (
                'stock_status', 'stock_quantity', 'warehouse_location'
            )
        }),
        ('Доставка', {
            'fields': (
                'weight_kg', 'length_cm', 'width_cm', 'height_cm',
                'ships_from', 'estimated_delivery_days'
            ),
            'classes': ('collapse',)
        }),
        ('Медиа', {
            'fields': ('main_image', 'video_url')
        }),
        ('Технические характеристики', {
            'fields': ('specifications',),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('meta_title_ru', 'meta_description_ru'),
            'classes': ('collapse',)
        }),
        ('Флаги', {
            'fields': ('is_active', 'is_featured', 'is_configurable')
        }),
    )
    
    inlines = [ProductImageInline, ProductDocumentInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'order', 'is_schematic']
    list_filter = ['is_schematic']
    search_fields = ['product__sku', 'product__name_ru']


@admin.register(ProductDocument)
class ProductDocumentAdmin(admin.ModelAdmin):
    list_display = ['product', 'doc_type', 'title', 'language']
    list_filter = ['doc_type', 'language']
    search_fields = ['product__sku', 'title']
