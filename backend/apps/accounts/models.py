"""
User and account models for UzAgro Platform.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import TimestampedModel


class Region(TimestampedModel):
    """
    Uzbekistan viloyats (regions).
    Used for delivery zones and dealer territories.
    """
    code = models.CharField(
        'Код региона',
        max_length=10,
        unique=True,
        db_index=True
    )
    name_ru = models.CharField('Название (RU)', max_length=100)
    name_uz = models.CharField('Название (UZ)', max_length=100)
    name_en = models.CharField('Название (EN)', max_length=100)
    
    # Shipping settings
    delivery_days_min = models.PositiveIntegerField(
        'Мин. дней доставки',
        default=1
    )
    delivery_days_max = models.PositiveIntegerField(
        'Макс. дней доставки',
        default=5
    )
    
    class Meta:
        db_table = 'regions'
        verbose_name = 'Регион'
        verbose_name_plural = 'Регионы'
        ordering = ['name_ru']

    def __str__(self):
        return self.name_ru
    
    def get_name(self, lang='ru'):
        """Get name in specified language."""
        return getattr(self, f'name_{lang}', self.name_ru)


class User(AbstractUser):
    """
    Extended user model with B2B fields.
    """
    
    class UserType(models.TextChoices):
        GUEST = 'guest', 'Гость'
        FARMER = 'farmer', 'Фермер (физ. лицо)'
        BUSINESS = 'business', 'Бизнес (юр. лицо)'
        DEALER = 'dealer', 'Региональный дилер'
        ADMIN = 'admin', 'Администратор'
    
    user_type = models.CharField(
        'Тип пользователя',
        max_length=20,
        choices=UserType.choices,
        default=UserType.GUEST
    )
    
    # Contact info
    phone = models.CharField(
        'Телефон',
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        db_index=True
    )
    
    # Telegram integration
    telegram_id = models.BigIntegerField(
        'Telegram ID',
        null=True,
        blank=True,
        unique=True,
        db_index=True
    )
    telegram_username = models.CharField(
        'Telegram username',
        max_length=100,
        null=True,
        blank=True
    )
    
    # Preferences
    preferred_language = models.CharField(
        'Предпочитаемый язык',
        max_length=5,
        choices=[
            ('ru', 'Русский'),
            ('uz', "O'zbek"),
            ('en', 'English'),
        ],
        default='ru'
    )
    
    # Location
    region = models.ForeignKey(
        Region,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Регион',
        related_name='users'
    )
    district = models.CharField(
        'Район',
        max_length=100,
        blank=True
    )
    address = models.TextField(
        'Адрес',
        blank=True
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    def __str__(self):
        return self.get_full_name() or self.username
    
    @property
    def is_verified_business(self):
        """Check if user has verified business profile."""
        return (
            self.user_type == self.UserType.BUSINESS and 
            hasattr(self, 'business_profile') and 
            self.business_profile.verified_at is not None
        )


class BusinessProfile(TimestampedModel):
    """
    B2B verification data from Soliq.uz.
    Stores company information for verified business accounts.
    """
    
    class PricingTier(models.TextChoices):
        RETAIL = 'retail', 'Розница'
        WHOLESALE = 'wholesale', 'Опт'
        VIP = 'vip', 'VIP'
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='business_profile',
        verbose_name='Пользователь'
    )
    
    # Tax ID (INN) - 9 digits for legal entities
    inn = models.CharField(
        'ИНН',
        max_length=9,
        unique=True,
        db_index=True
    )
    
    # Company info
    company_name = models.CharField(
        'Название компании',
        max_length=255
    )
    legal_address = models.TextField(
        'Юридический адрес'
    )
    
    # Tax status
    vat_payer = models.BooleanField(
        'Плательщик НДС',
        default=False
    )
    
    # Verification
    verified_at = models.DateTimeField(
        'Дата верификации',
        null=True,
        blank=True
    )
    verification_data = models.JSONField(
        'Данные верификации',
        default=dict,
        blank=True,
        help_text='Raw response from Soliq.uz API'
    )
    
    # Pricing
    pricing_tier = models.CharField(
        'Ценовая категория',
        max_length=20,
        choices=PricingTier.choices,
        default=PricingTier.RETAIL
    )
    credit_limit = models.DecimalField(
        'Кредитный лимит (USD)',
        max_digits=15,
        decimal_places=2,
        default=0
    )
    
    # Contact person
    contact_name = models.CharField(
        'Контактное лицо',
        max_length=200,
        blank=True
    )
    contact_phone = models.CharField(
        'Контактный телефон',
        max_length=20,
        blank=True
    )
    
    class Meta:
        db_table = 'business_profiles'
        verbose_name = 'Бизнес-профиль'
        verbose_name_plural = 'Бизнес-профили'

    def __str__(self):
        return f"{self.company_name} (ИНН: {self.inn})"
    
    @property
    def is_verified(self):
        """Check if business is verified."""
        return self.verified_at is not None
