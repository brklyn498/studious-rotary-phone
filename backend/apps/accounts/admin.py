"""
Admin configuration for accounts app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Region, BusinessProfile


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['code', 'name_ru', 'name_uz', 'delivery_days_min', 'delivery_days_max']
    search_fields = ['code', 'name_ru', 'name_uz', 'name_en']
    ordering = ['name_ru']


class BusinessProfileInline(admin.StackedInline):
    model = BusinessProfile
    can_delete = False
    verbose_name_plural = 'Бизнес-профиль'
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'phone', 'user_type', 'region', 'is_active']
    list_filter = ['user_type', 'region', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'phone', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительная информация', {
            'fields': (
                'phone', 'user_type', 'preferred_language',
                'telegram_id', 'telegram_username',
                'region', 'district', 'address'
            )
        }),
    )
    
    inlines = [BusinessProfileInline]


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'inn', 'user', 'pricing_tier', 'is_verified']
    list_filter = ['pricing_tier', 'vat_payer']
    search_fields = ['company_name', 'inn', 'user__username']
    
    def is_verified(self, obj):
        return obj.is_verified
    is_verified.boolean = True
    is_verified.short_description = 'Верифицирован'
