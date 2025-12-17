"""
Product catalog models for UzAgro Platform.
"""

from django.db import models
from apps.core.models import TimestampedModel, OrderedMixin, ActiveMixin


class Category(TimestampedModel, OrderedMixin, ActiveMixin):
    """
    Hierarchical product categories.
    Examples: Тракторы, Комбайны, Почвообработка, Запчасти
    """
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Родительская категория'
    )
    slug = models.SlugField(
        'URL-адрес',
        max_length=100,
        unique=True,
        db_index=True
    )
    
    # Multilingual fields
    name_ru = models.CharField('Название (RU)', max_length=200)
    name_uz = models.CharField('Название (UZ)', max_length=200, blank=True)
    name_en = models.CharField('Название (EN)', max_length=200, blank=True)
    
    description_ru = models.TextField('Описание (RU)', blank=True)
    description_uz = models.TextField('Описание (UZ)', blank=True)
    description_en = models.TextField('Описание (EN)', blank=True)
    
    # Visual
    image = models.ImageField(
        'Изображение',
        upload_to='categories/',
        null=True,
        blank=True
    )
    icon = models.CharField(
        'Иконка',
        max_length=50,
        blank=True,
        help_text='Название иконки Lucide (например: tractor, wrench)'
    )
    
    # SEO
    meta_title_ru = models.CharField('Meta Title (RU)', max_length=70, blank=True)
    meta_description_ru = models.CharField('Meta Description (RU)', max_length=160, blank=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['order', 'name_ru']

    def __str__(self):
        return self.name_ru
    
    def get_name(self, lang='ru'):
        """Get name in specified language."""
        name = getattr(self, f'name_{lang}', None)
        return name if name else self.name_ru
    
    @property
    def full_path(self):
        """Get full category path (e.g., 'Техника / Тракторы / Колёсные')."""
        if self.parent:
            return f"{self.parent.full_path} / {self.name_ru}"
        return self.name_ru


class Brand(TimestampedModel, ActiveMixin):
    """
    Manufacturers: YTO, Rostselmash, KUHN, etc.
    """
    slug = models.SlugField(
        'URL-адрес',
        max_length=50,
        unique=True,
        db_index=True
    )
    name = models.CharField('Название', max_length=100)
    country = models.CharField('Страна', max_length=50)
    
    logo = models.ImageField(
        'Логотип',
        upload_to='brands/',
        null=True,
        blank=True
    )
    
    description_ru = models.TextField('Описание (RU)', blank=True)
    description_uz = models.TextField('Описание (UZ)', blank=True)
    description_en = models.TextField('Описание (EN)', blank=True)
    
    website = models.URLField('Веб-сайт', blank=True)
    is_verified = models.BooleanField('Верифицирован', default=False)
    is_featured = models.BooleanField('Рекомендуемый', default=False)
    
    class Meta:
        db_table = 'brands'
        verbose_name = 'Бренд'
        verbose_name_plural = 'Бренды'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.country})"


class Product(TimestampedModel, ActiveMixin):
    """
    Main product model for agricultural machinery and parts.
    """
    
    class ProductType(models.TextChoices):
        MACHINERY = 'machinery', 'Сельхозтехника'
        ATTACHMENT = 'attachment', 'Навесное оборудование'
        SPARE_PART = 'spare_part', 'Запчасть'
    
    class StockStatus(models.TextChoices):
        IN_STOCK = 'in_stock', 'В наличии'
        LOW_STOCK = 'low_stock', 'Мало'
        PRE_ORDER = 'pre_order', 'Под заказ'
        OUT_OF_STOCK = 'out_of_stock', 'Нет в наличии'
    
    # Identifiers
    sku = models.CharField(
        'Артикул',
        max_length=50,
        unique=True,
        db_index=True
    )
    slug = models.SlugField(
        'URL-адрес',
        max_length=200,
        unique=True,
        db_index=True
    )
    product_type = models.CharField(
        'Тип товара',
        max_length=20,
        choices=ProductType.choices,
        default=ProductType.MACHINERY
    )
    
    # Multilingual content
    name_ru = models.CharField('Название (RU)', max_length=300)
    name_uz = models.CharField('Название (UZ)', max_length=300, blank=True)
    name_en = models.CharField('Название (EN)', max_length=300, blank=True)
    
    short_description_ru = models.TextField('Краткое описание (RU)', blank=True)
    short_description_uz = models.TextField('Краткое описание (UZ)', blank=True)
    short_description_en = models.TextField('Краткое описание (EN)', blank=True)
    
    full_description_ru = models.TextField('Полное описание (RU)', blank=True)
    full_description_uz = models.TextField('Полное описание (UZ)', blank=True)
    full_description_en = models.TextField('Полное описание (EN)', blank=True)
    
    # Relations
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='Категория'
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name='Бренд'
    )
    
    # Pricing (base in USD for stability)
    base_price_usd = models.DecimalField(
        'Базовая цена (USD)',
        max_digits=12,
        decimal_places=2
    )
    retail_price_usd = models.DecimalField(
        'Розничная цена (USD)',
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    wholesale_price_usd = models.DecimalField(
        'Оптовая цена (USD)',
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    show_price_to_guests = models.BooleanField(
        'Показывать цену гостям',
        default=False
    )
    
    # Inventory
    stock_status = models.CharField(
        'Статус наличия',
        max_length=20,
        choices=StockStatus.choices,
        default=StockStatus.IN_STOCK
    )
    stock_quantity = models.PositiveIntegerField(
        'Количество на складе',
        default=0
    )
    warehouse_location = models.CharField(
        'Склад',
        max_length=100,
        blank=True
    )
    
    # Logistics
    weight_kg = models.DecimalField(
        'Вес (кг)',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    length_cm = models.PositiveIntegerField('Длина (см)', null=True, blank=True)
    width_cm = models.PositiveIntegerField('Ширина (см)', null=True, blank=True)
    height_cm = models.PositiveIntegerField('Высота (см)', null=True, blank=True)
    ships_from = models.CharField(
        'Отправка из',
        max_length=100,
        default='Ташкент'
    )
    estimated_delivery_days = models.PositiveIntegerField(
        'Срок доставки (дней)',
        null=True,
        blank=True
    )
    
    # Media
    main_image = models.ImageField(
        'Главное изображение',
        upload_to='products/',
        null=True,
        blank=True
    )
    video_url = models.URLField('Видео (URL)', blank=True)
    
    # Technical specifications (flexible JSON structure)
    specifications = models.JSONField(
        'Технические характеристики',
        default=dict,
        blank=True,
        help_text='''
        Пример: {
            "horsepower": {"value": 120, "unit": "л.с."},
            "engine_type": {"value": "Дизель YTO 4-цилиндра"},
            "fuel_capacity": {"value": 200, "unit": "л"}
        }
        '''
    )
    
    # SEO
    meta_title_ru = models.CharField('Meta Title (RU)', max_length=70, blank=True)
    meta_description_ru = models.CharField('Meta Description (RU)', max_length=160, blank=True)
    
    # Flags
    is_featured = models.BooleanField('Рекомендуемый', default=False)
    is_configurable = models.BooleanField('Конфигурируемый', default=False)
    
    # View count for popularity
    view_count = models.PositiveIntegerField('Просмотры', default=0)
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['brand', 'is_active']),
            models.Index(fields=['product_type', 'is_active']),
            models.Index(fields=['stock_status']),
        ]

    def __str__(self):
        return f"{self.sku} - {self.name_ru}"
    
    def get_name(self, lang='ru'):
        """Get name in specified language."""
        name = getattr(self, f'name_{lang}', None)
        return name if name else self.name_ru
    
    def get_price_for_user(self, user=None):
        """
        Get appropriate price based on user type.
        Returns (price_usd, can_see_price).
        """
        if user is None or not user.is_authenticated:
            if self.show_price_to_guests:
                return (self.retail_price_usd or self.base_price_usd, True)
            return (None, False)
        
        if hasattr(user, 'business_profile') and user.business_profile.is_verified:
            tier = user.business_profile.pricing_tier
            if tier == 'vip':
                return (self.wholesale_price_usd or self.base_price_usd, True)
            elif tier == 'wholesale':
                return (self.wholesale_price_usd or self.retail_price_usd or self.base_price_usd, True)
        
        return (self.retail_price_usd or self.base_price_usd, True)


class ProductImage(TimestampedModel):
    """
    Additional product images.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Товар'
    )
    image = models.ImageField('Изображение', upload_to='products/')
    alt_text = models.CharField('Alt-текст', max_length=200, blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)
    is_schematic = models.BooleanField(
        'Схема/чертёж',
        default=False,
        help_text='Для разнесённых схем запчастей'
    )
    
    class Meta:
        db_table = 'product_images'
        verbose_name = 'Изображение товара'
        verbose_name_plural = 'Изображения товаров'
        ordering = ['order']

    def __str__(self):
        return f"Изображение для {self.product.sku}"


class ProductDocument(TimestampedModel):
    """
    PDF brochures, manuals, certificates.
    """
    
    class DocType(models.TextChoices):
        BROCHURE = 'brochure', 'Брошюра'
        MANUAL = 'manual', 'Руководство'
        CERTIFICATE = 'certificate', 'Сертификат'
        SPEC_SHEET = 'spec_sheet', 'Спецификация'
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Товар'
    )
    doc_type = models.CharField(
        'Тип документа',
        max_length=20,
        choices=DocType.choices
    )
    title = models.CharField('Название', max_length=200)
    file = models.FileField('Файл', upload_to='documents/')
    language = models.CharField(
        'Язык',
        max_length=5,
        choices=[
            ('ru', 'Русский'),
            ('uz', "O'zbek"),
            ('en', 'English'),
        ],
        default='ru'
    )
    
    class Meta:
        db_table = 'product_documents'
        verbose_name = 'Документ товара'
        verbose_name_plural = 'Документы товаров'

    def __str__(self):
        return f"{self.title} ({self.product.sku})"
