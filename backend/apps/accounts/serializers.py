"""
Serializers for accounts app.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Region, BusinessProfile

User = get_user_model()


class RegionSerializer(serializers.ModelSerializer):
    """Serializer for regions."""
    
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = Region
        fields = [
            'id', 'code', 'name', 'name_ru', 'name_uz', 'name_en',
            'delivery_days_min', 'delivery_days_max'
        ]
    
    def get_name(self, obj):
        """Get name in request language."""
        request = self.context.get('request')
        lang = 'ru'
        if request:
            lang = request.headers.get('Accept-Language', 'ru')[:2]
        return obj.get_name(lang)


class BusinessProfileSerializer(serializers.ModelSerializer):
    """Serializer for business profiles."""
    
    is_verified = serializers.ReadOnlyField()
    
    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'inn', 'company_name', 'legal_address',
            'vat_payer', 'verified_at', 'is_verified',
            'pricing_tier', 'contact_name', 'contact_phone'
        ]
        read_only_fields = ['verified_at', 'is_verified', 'pricing_tier']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    business_profile = BusinessProfileSerializer(read_only=True)
    region = RegionSerializer(read_only=True)
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(),
        source='region',
        write_only=True,
        required=False
    )
    is_verified_business = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'user_type', 'preferred_language',
            'region', 'region_id', 'district', 'address',
            'telegram_id', 'telegram_username',
            'business_profile', 'is_verified_business',
            'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'username', 'user_type', 'telegram_id',
            'date_joined', 'last_login'
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Optional business fields
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    inn = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # Region input
    region_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'phone', 'password', 'password_confirm',
            'first_name', 'last_name', 'preferred_language',
            'user_type', 'company_name', 'inn', 'region_name'
        ]
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Пароли не совпадают.'
            })

        # Security: Prevent registering as ADMIN
        user_type = data.get('user_type')
        if user_type == User.UserType.ADMIN:
            raise serializers.ValidationError({'user_type': 'Регистрация администратора запрещена.'})

        if user_type == User.UserType.BUSINESS:
            if not data.get('company_name'):
                raise serializers.ValidationError({'company_name': 'Название компании обязательно для бизнеса.'})

            inn = data.get('inn')
            if not inn:
                raise serializers.ValidationError({'inn': 'ИНН обязателен для бизнеса.'})

            # Security: Validate INN format
            if not inn.isdigit():
                raise serializers.ValidationError({'inn': 'ИНН должен содержать только цифры.'})
            if len(inn) != 9:
                raise serializers.ValidationError({'inn': 'ИНН должен состоять из 9 цифр.'})

        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        # Extract extra fields
        company_name = validated_data.pop('company_name', '')
        inn = validated_data.pop('inn', '')
        region_name = validated_data.pop('region_name', '')

        # Resolve region if provided
        if region_name:
            # Try to match by name (ru/uz) or code
            region = Region.objects.filter(
                Q(name_ru__iexact=region_name) |
                Q(name_uz__iexact=region_name) |
                Q(code__iexact=region_name)
            ).first()
            if region:
                validated_data['region'] = region

        # Create user
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Create business profile if needed
        if user.user_type == User.UserType.BUSINESS and inn:
            BusinessProfile.objects.create(
                user=user,
                inn=inn,
                company_name=company_name,
                legal_address='',  # Will be filled by verification
                contact_name=f"{user.first_name} {user.last_name}",
                contact_phone=user.phone or ''
            )

        return user


class INNVerificationSerializer(serializers.Serializer):
    """Serializer for INN verification request."""
    
    inn = serializers.CharField(min_length=9, max_length=9)
    
    def validate_inn(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('ИНН должен содержать только цифры.')
        return value
