# UzAgro Platform - Development Roadmap for AI Coding Agents

> **Project:** Digital Agricultural Machinery Import Platform for Uzbekistan  
> **Architecture:** Headless Commerce (Django REST API + Next.js Frontend + Telegram Mini App)  
> **Target Market:** B2B Agricultural Machinery Sales in Uzbekistan  
> **Languages:** Uzbek (uz), Russian (ru), English (en)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [API Specification](#5-api-specification)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Telegram Integration](#7-telegram-integration)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Design System](#9-design-system)
10. [Implementation Phases](#10-implementation-phases)
11. [Testing Requirements](#11-testing-requirements)
12. [Deployment Configuration](#12-deployment-configuration)

---

## 1. Project Overview

### 1.1 Business Context

This platform serves an agricultural machinery import company bridging Western, Russian, and Chinese manufacturers with Uzbek farmers. The digital platform acts as the central nervous system for:

- **Product Discovery:** Tractors, combines, harvesters, spare parts
- **B2B Transactions:** Verified business accounts with tiered pricing
- **Dealer Management:** Regional sub-dealer network support
- **Logistics Tracking:** Real-time shipment visibility
- **Financial Services:** Leasing calculators, payment integration

### 1.2 Key Differentiators

| Feature | Implementation |
|---------|---------------|
| Trust Mechanisms | Soliq.uz INN verification, video inspections, manufacturer certificates |
| Technical Depth | Parametric filtering (HP, hydraulic flow, working width, crop type) |
| Local Integration | Payme/Click payments, BTS/Fargo logistics, Telegram-first mobile |
| Fleet Management | "My Garage" - registered machines filter compatible parts |
| Multilingual | Full RTL-aware support for uz/ru/en with SEO optimization |

### 1.3 Target Users

1. **End Farmers (Fermer):** Primary buyers, mobile-first, price-sensitive
2. **Agronomists:** Technical buyers needing spec comparisons
3. **Regional Dealers:** Sub-distributors managing local sales
4. **Corporate Buyers:** Agricultural holdings, government procurement

---

## 2. Technology Stack

### 2.1 Backend Stack

```yaml
Runtime: Python 3.12+
Framework: Django 5.x
API: Django REST Framework 3.15+
Database: PostgreSQL 16 with PostGIS extension
Search: MeiliSearch 1.x (typo-tolerant, multilingual)
Cache: Redis 7.x
Task Queue: Celery 5.x with Redis broker
File Storage: MinIO (S3-compatible) or local with CDN
```

### 2.2 Frontend Stack

```yaml
Framework: Next.js 15.x (App Router)
Language: TypeScript 5.x
Styling: Tailwind CSS 3.4+
State: Zustand or React Query
Forms: React Hook Form + Zod validation
i18n: next-intl
Maps: Leaflet with OpenStreetMap
Charts: Recharts or Chart.js
```

### 2.3 Telegram Stack

```yaml
Bot Framework: aiogram 3.x (Python async)
Mini App: Next.js (shared codebase with web)
Auth: Telegram WebApp initData validation
```

### 2.4 Infrastructure

```yaml
Containerization: Docker + Docker Compose
Reverse Proxy: Nginx or Caddy
CI/CD: GitHub Actions
Monitoring: Prometheus + Grafana (optional)
Hosting: DigitalOcean / AWS / Local (Uzinfocom)
```

---

## 3. Project Structure

### 3.1 Monorepo Structure

```
uzagro-platform/
├── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── deploy.yml
│
├── backend/                          # Django Application
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── apps/
│   │   ├── __init__.py
│   │   ├── accounts/                 # User management
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── permissions.py
│   │   │   └── services/
│   │   │       └── soliq_verification.py
│   │   │
│   │   ├── catalog/                  # Products & Categories
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   ├── filters.py
│   │   │   └── services/
│   │   │       └── search_service.py
│   │   │
│   │   ├── orders/                   # RFQ & Orders
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── services/
│   │   │       └── quote_generator.py
│   │   │
│   │   ├── dealers/                  # Dealer Portal
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── payments/                 # Payme/Click Integration
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── services/
│   │   │       ├── payme.py
│   │   │       └── click.py
│   │   │
│   │   ├── logistics/                # Shipping Integration
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   └── services/
│   │   │       ├── bts_express.py
│   │   │       └── fargo.py
│   │   │
│   │   ├── content/                  # CMS: News, Academy
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   └── telegram_bot/             # Telegram Bot Logic
│   │       ├── bot.py
│   │       ├── handlers/
│   │       ├── keyboards.py
│   │       └── services/
│   │
│   ├── core/                         # Shared utilities
│   │   ├── models.py                 # Base models (timestamps, etc.)
│   │   ├── pagination.py
│   │   ├── exceptions.py
│   │   └── utils/
│   │       ├── currency.py           # USD/UZS conversion
│   │       └── translations.py
│   │
│   └── locale/                       # Django translations
│       ├── uz/
│       ├── ru/
│       └── en/
│
├── frontend/                         # Next.js Application
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   │
│   ├── public/
│   │   ├── images/
│   │   ├── videos/
│   │   └── icons/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx                    # Homepage
│   │   │   │   ├── catalog/
│   │   │   │   │   ├── page.tsx                # Catalog listing
│   │   │   │   │   ├── [category]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── product/
│   │   │   │   │       └── [slug]/
│   │   │   │   │           └── page.tsx        # Product detail
│   │   │   │   ├── parts/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [partNumber]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── services/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── leasing/
│   │   │   │   │   ├── warranty/
│   │   │   │   │   └── service-request/
│   │   │   │   ├── knowledge/
│   │   │   │   │   ├── news/
│   │   │   │   │   ├── academy/
│   │   │   │   │   └── weather/
│   │   │   │   ├── cabinet/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── garage/
│   │   │   │   │   ├── orders/
│   │   │   │   │   └── documents/
│   │   │   │   ├── compare/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── cart/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── auth/
│   │   │   │       ├── login/
│   │   │   │       └── register/
│   │   │   │
│   │   │   └── api/                             # API routes for Telegram
│   │   │       └── telegram/
│   │   │           └── webhook/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                              # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   └── BottomNav.tsx               # Mobile thumb-zone nav
│   │   │   ├── catalog/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── FilterSidebar.tsx
│   │   │   │   ├── CompareBar.tsx
│   │   │   │   └── Configurator.tsx
│   │   │   ├── parts/
│   │   │   │   ├── PartCard.tsx
│   │   │   │   ├── SchematicViewer.tsx         # Exploded view diagrams
│   │   │   │   └── CompatibilityList.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── CurrencyTicker.tsx
│   │   │   │   ├── QuickPartFinder.tsx
│   │   │   │   └── FeaturedProducts.tsx
│   │   │   └── common/
│   │   │       ├── LanguageSwitcher.tsx
│   │   │       ├── SearchBar.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── client.ts                   # Axios/fetch wrapper
│   │   │   │   ├── catalog.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── payments.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCart.ts
│   │   │   │   ├── useCompare.ts
│   │   │   │   └── useTelegram.ts              # Telegram WebApp detection
│   │   │   ├── store/
│   │   │   │   ├── cartStore.ts
│   │   │   │   ├── compareStore.ts
│   │   │   │   └── userStore.ts
│   │   │   └── utils/
│   │   │       ├── currency.ts
│   │   │       ├── formatters.ts
│   │   │       └── validators.ts
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   └── i18n/
│   │       ├── config.ts
│   │       └── messages/
│   │           ├── uz.json
│   │           ├── ru.json
│   │           └── en.json
│   │
│   └── tests/
│       └── ...
│
├── telegram-bot/                     # Standalone Telegram Bot (aiogram)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── config.py
│   ├── handlers/
│   │   ├── start.py
│   │   ├── catalog.py
│   │   ├── orders.py
│   │   └── support.py
│   ├── keyboards/
│   │   ├── inline.py
│   │   └── reply.py
│   ├── services/
│   │   └── api_client.py             # Calls Django API
│   └── utils/
│       └── auth.py                   # initData validation
│
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       └── default.conf
│
├── scripts/
│   ├── seed_data.py
│   ├── import_products.py
│   └── backup_db.sh
│
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── INTEGRATIONS.md
```

---

## 4. Database Schema

### 4.1 Core Models

#### Users & Authentication

```python
# apps/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Extended user model with B2B fields"""
    
    class UserType(models.TextChoices):
        GUEST = 'guest', 'Guest'
        FARMER = 'farmer', 'Farmer (Individual)'
        BUSINESS = 'business', 'Business (Verified)'
        DEALER = 'dealer', 'Regional Dealer'
        ADMIN = 'admin', 'Administrator'
    
    user_type = models.CharField(
        max_length=20,
        choices=UserType.choices,
        default=UserType.GUEST
    )
    phone = models.CharField(max_length=20, unique=True)
    telegram_id = models.BigIntegerField(null=True, blank=True, unique=True)
    telegram_username = models.CharField(max_length=100, null=True, blank=True)
    preferred_language = models.CharField(
        max_length=5,
        choices=[('uz', 'Uzbek'), ('ru', 'Russian'), ('en', 'English')],
        default='uz'
    )
    
    # Geolocation
    region = models.ForeignKey('Region', on_delete=models.SET_NULL, null=True)
    district = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'users'


class BusinessProfile(models.Model):
    """B2B verification data from Soliq.uz"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')
    inn = models.CharField(max_length=9, unique=True, db_index=True)  # Tax ID
    company_name = models.CharField(max_length=255)
    legal_address = models.TextField()
    vat_payer = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True)
    verification_data = models.JSONField(default=dict)  # Raw Soliq response
    
    # Pricing tier
    pricing_tier = models.CharField(
        max_length=20,
        choices=[('retail', 'Retail'), ('wholesale', 'Wholesale'), ('vip', 'VIP')],
        default='retail'
    )
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'business_profiles'


class Region(models.Model):
    """Uzbekistan viloyats (regions)"""
    
    code = models.CharField(max_length=10, unique=True)  # e.g., 'TAS', 'SAM'
    name_uz = models.CharField(max_length=100)
    name_ru = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    
    # PostGIS geometry for dealer locator
    # boundary = models.PolygonField(null=True)
    
    class Meta:
        db_table = 'regions'
```

#### Product Catalog

```python
# apps/catalog/models.py

from django.db import models
from django.contrib.postgres.fields import ArrayField
from core.models import TimestampedModel

class Category(TimestampedModel):
    """Hierarchical product categories"""
    
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='children'
    )
    slug = models.SlugField(max_length=100, unique=True)
    name_uz = models.CharField(max_length=200)
    name_ru = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200)
    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', null=True)
    icon = models.CharField(max_length=50, blank=True)  # Lucide icon name
    
    # For filtering UI
    filterable_attributes = ArrayField(
        models.CharField(max_length=50),
        default=list,
        help_text="Attribute keys to show in filter sidebar"
    )
    
    # SEO
    meta_title_uz = models.CharField(max_length=70, blank=True)
    meta_title_ru = models.CharField(max_length=70, blank=True)
    meta_title_en = models.CharField(max_length=70, blank=True)
    meta_description_uz = models.CharField(max_length=160, blank=True)
    meta_description_ru = models.CharField(max_length=160, blank=True)
    meta_description_en = models.CharField(max_length=160, blank=True)
    
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'
        ordering = ['order', 'name_en']


class Brand(TimestampedModel):
    """Manufacturers: YTO, Rostselmash, Kuhn, etc."""
    
    slug = models.SlugField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=50)  # China, Russia, Germany, etc.
    logo = models.ImageField(upload_to='brands/')
    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    website = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'brands'


class Product(TimestampedModel):
    """Main product model for machinery"""
    
    class ProductType(models.TextChoices):
        MACHINERY = 'machinery', 'Agricultural Machinery'
        ATTACHMENT = 'attachment', 'Attachment/Implement'
        SPARE_PART = 'spare_part', 'Spare Part'
    
    class StockStatus(models.TextChoices):
        IN_STOCK = 'in_stock', 'In Stock'
        LOW_STOCK = 'low_stock', 'Low Stock'
        PRE_ORDER = 'pre_order', 'Pre-Order'
        OUT_OF_STOCK = 'out_of_stock', 'Out of Stock'
    
    # Basic info
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    slug = models.SlugField(max_length=200, unique=True)
    product_type = models.CharField(max_length=20, choices=ProductType.choices)
    
    name_uz = models.CharField(max_length=300)
    name_ru = models.CharField(max_length=300)
    name_en = models.CharField(max_length=300)
    
    short_description_uz = models.TextField(blank=True)
    short_description_ru = models.TextField(blank=True)
    short_description_en = models.TextField(blank=True)
    
    full_description_uz = models.TextField(blank=True)
    full_description_ru = models.TextField(blank=True)
    full_description_en = models.TextField(blank=True)
    
    # Relations
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='products')
    
    # Pricing (base in USD for stability)
    base_price_usd = models.DecimalField(max_digits=12, decimal_places=2)
    retail_price_usd = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    wholesale_price_usd = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    show_price_to_guests = models.BooleanField(default=False)
    
    # Inventory
    stock_status = models.CharField(max_length=20, choices=StockStatus.choices, default=StockStatus.IN_STOCK)
    stock_quantity = models.PositiveIntegerField(default=0)
    warehouse_location = models.CharField(max_length=100, blank=True)
    
    # Logistics
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    length_cm = models.PositiveIntegerField(null=True)
    width_cm = models.PositiveIntegerField(null=True)
    height_cm = models.PositiveIntegerField(null=True)
    ships_from = models.CharField(max_length=100, default='Tashkent')  # or Shanghai, Moscow, etc.
    estimated_delivery_days = models.PositiveIntegerField(null=True)
    
    # Media
    main_image = models.ImageField(upload_to='products/')
    video_url = models.URLField(blank=True)  # YouTube/hosted video
    
    # Technical specs (EAV-style for flexibility)
    specifications = models.JSONField(default=dict)
    """
    Example specifications JSON:
    {
        "horsepower": {"value": 120, "unit": "HP"},
        "engine_type": {"value": "Diesel"},
        "working_width": {"value": 3.5, "unit": "m"},
        "fuel_capacity": {"value": 200, "unit": "L"},
        "hydraulic_flow": {"value": 100, "unit": "L/min"},
        "pto_speed": {"value": [540, 1000], "unit": "RPM"},
        "crop_type": ["cotton", "wheat", "corn"]
    }
    """
    
    # Compatibility (for parts and attachments)
    compatible_with = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='compatible_parts'
    )
    
    # SEO
    meta_title_uz = models.CharField(max_length=70, blank=True)
    meta_title_ru = models.CharField(max_length=70, blank=True)
    meta_title_en = models.CharField(max_length=70, blank=True)
    meta_description_uz = models.CharField(max_length=160, blank=True)
    meta_description_ru = models.CharField(max_length=160, blank=True)
    meta_description_en = models.CharField(max_length=160, blank=True)
    
    # Flags
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_configurable = models.BooleanField(default=False)
    
    # Search optimization
    search_keywords = ArrayField(models.CharField(max_length=50), default=list)
    
    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['brand', 'is_active']),
            models.Index(fields=['product_type', 'is_active']),
        ]


class ProductImage(TimestampedModel):
    """Additional product images"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_schematic = models.BooleanField(default=False)  # For exploded view diagrams
    
    class Meta:
        db_table = 'product_images'
        ordering = ['order']


class ProductDocument(TimestampedModel):
    """PDF brochures, manuals, certificates"""
    
    class DocType(models.TextChoices):
        BROCHURE = 'brochure', 'Brochure'
        MANUAL = 'manual', 'User Manual'
        CERTIFICATE = 'certificate', 'Certificate'
        SPEC_SHEET = 'spec_sheet', 'Specification Sheet'
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')
    language = models.CharField(max_length=5, choices=[('uz', 'Uzbek'), ('ru', 'Russian'), ('en', 'English')])
    
    class Meta:
        db_table = 'product_documents'


class ConfiguratorOption(TimestampedModel):
    """Options for configurable products (cabin type, tires, etc.)"""
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='configurator_options')
    group_name = models.CharField(max_length=100)  # e.g., "Cabin", "Tires", "Hydraulics"
    option_name_uz = models.CharField(max_length=200)
    option_name_ru = models.CharField(max_length=200)
    option_name_en = models.CharField(max_length=200)
    price_modifier_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    image = models.ImageField(upload_to='configurator/', null=True, blank=True)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'configurator_options'
```

#### Orders & RFQ

```python
# apps/orders/models.py

from django.db import models
from core.models import TimestampedModel
import uuid

class Quote(TimestampedModel):
    """Request for Quote for machinery"""
    
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        SUBMITTED = 'submitted', 'Submitted'
        PROCESSING = 'processing', 'Processing'
        QUOTED = 'quoted', 'Quote Sent'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
        EXPIRED = 'expired', 'Expired'
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='quotes')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    
    # Configuration snapshot
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    configuration = models.JSONField(default=dict)  # Selected options
    quantity = models.PositiveIntegerField(default=1)
    
    # Pricing
    estimated_price_usd = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    final_price_usd = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    final_price_uzs = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    # Delivery
    delivery_region = models.ForeignKey('accounts.Region', on_delete=models.SET_NULL, null=True)
    delivery_address = models.TextField(blank=True)
    estimated_delivery_days = models.PositiveIntegerField(null=True)
    
    # Notes
    customer_notes = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    
    # PDF quote
    quote_pdf = models.FileField(upload_to='quotes/', null=True, blank=True)
    valid_until = models.DateField(null=True)
    
    class Meta:
        db_table = 'quotes'


class Order(TimestampedModel):
    """Orders for parts and accepted quotes"""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending Payment'
        PAID = 'paid', 'Paid'
        PROCESSING = 'processing', 'Processing'
        SHIPPED = 'shipped', 'Shipped'
        DELIVERED = 'delivered', 'Delivered'
        CANCELLED = 'cancelled', 'Cancelled'
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    order_number = models.CharField(max_length=20, unique=True)  # e.g., UZA-2025-00001
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='orders')
    quote = models.OneToOneField(Quote, on_delete=models.SET_NULL, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Totals
    subtotal_usd = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_usd = models.DecimalField(max_digits=12, decimal_places=2)
    total_uzs = models.DecimalField(max_digits=15, decimal_places=2)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Delivery
    delivery_region = models.ForeignKey('accounts.Region', on_delete=models.SET_NULL, null=True)
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=20)
    
    # Logistics
    courier = models.CharField(max_length=50, blank=True)  # BTS, Fargo, etc.
    tracking_number = models.CharField(max_length=100, blank=True)
    shipped_at = models.DateTimeField(null=True)
    delivered_at = models.DateTimeField(null=True)
    
    class Meta:
        db_table = 'orders'


class OrderItem(TimestampedModel):
    """Line items in an order"""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price_usd = models.DecimalField(max_digits=12, decimal_places=2)
    configuration = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'order_items'


class Cart(TimestampedModel):
    """Shopping cart (session-based or user-based)"""
    
    user = models.OneToOneField(
        'accounts.User', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='cart'
    )
    session_key = models.CharField(max_length=40, null=True, blank=True, db_index=True)
    
    class Meta:
        db_table = 'carts'


class CartItem(TimestampedModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    configuration = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'cart_items'
        unique_together = ['cart', 'product', 'configuration']
```

#### Dealers & Fleet

```python
# apps/dealers/models.py

from django.db import models
from core.models import TimestampedModel

class DealerProfile(TimestampedModel):
    """Regional sub-dealer profiles"""
    
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='dealer_profile')
    dealer_code = models.CharField(max_length=20, unique=True)  # e.g., DLR-SAM-001
    company_name = models.CharField(max_length=255)
    regions_served = models.ManyToManyField('accounts.Region')
    
    # Contact
    office_address = models.TextField()
    office_phone = models.CharField(max_length=20)
    service_phone = models.CharField(max_length=20, blank=True)
    
    # Capabilities
    can_service = models.BooleanField(default=False)
    can_sell_parts = models.BooleanField(default=True)
    
    # Commission
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    
    class Meta:
        db_table = 'dealer_profiles'


class UserMachine(TimestampedModel):
    """User's registered machines ('My Garage')"""
    
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='machines')
    product = models.ForeignKey('catalog.Product', on_delete=models.CASCADE)
    
    # Machine identification
    serial_number = models.CharField(max_length=100)
    vin = models.CharField(max_length=50, blank=True)
    purchase_date = models.DateField(null=True)
    
    # Warranty
    warranty_start = models.DateField(null=True)
    warranty_end = models.DateField(null=True)
    
    # Dealer who sold it
    dealer = models.ForeignKey(DealerProfile, on_delete=models.SET_NULL, null=True, blank=True)
    
    nickname = models.CharField(max_length=100, blank=True)  # e.g., "Main Tractor"
    
    class Meta:
        db_table = 'user_machines'
        unique_together = ['user', 'serial_number']


class WarrantyRegistration(TimestampedModel):
    """Warranty registrations by dealers"""
    
    machine = models.ForeignKey(UserMachine, on_delete=models.CASCADE, related_name='warranty_registrations')
    dealer = models.ForeignKey(DealerProfile, on_delete=models.SET_NULL, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=20)
    proof_of_purchase = models.FileField(upload_to='warranties/', null=True)
    
    class Meta:
        db_table = 'warranty_registrations'
```

#### Payments & Logistics

```python
# apps/payments/models.py

from django.db import models
from core.models import TimestampedModel
import uuid

class Payment(TimestampedModel):
    """Payment transactions"""
    
    class Provider(models.TextChoices):
        PAYME = 'payme', 'Payme'
        CLICK = 'click', 'Click'
        BANK_TRANSFER = 'bank', 'Bank Transfer'
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    
    provider = models.CharField(max_length=20, choices=Provider.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    amount_uzs = models.DecimalField(max_digits=15, decimal_places=2)
    provider_transaction_id = models.CharField(max_length=100, blank=True)
    
    # Provider response data
    provider_response = models.JSONField(default=dict)
    
    completed_at = models.DateTimeField(null=True)
    
    class Meta:
        db_table = 'payments'


# apps/logistics/models.py

class Shipment(TimestampedModel):
    """Shipment tracking"""
    
    class Status(models.TextChoices):
        CREATED = 'created', 'Label Created'
        PICKED_UP = 'picked_up', 'Picked Up'
        IN_TRANSIT = 'in_transit', 'In Transit'
        OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
        DELIVERED = 'delivered', 'Delivered'
        EXCEPTION = 'exception', 'Exception'
    
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='shipments')
    courier = models.CharField(max_length=50)  # BTS Express, Fargo
    tracking_number = models.CharField(max_length=100, unique=True)
    
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.CREATED)
    
    # Dimensions & weight
    weight_kg = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Cost
    shipping_cost_uzs = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Timestamps
    estimated_delivery = models.DateField(null=True)
    actual_delivery = models.DateTimeField(null=True)
    
    class Meta:
        db_table = 'shipments'


class ShipmentEvent(TimestampedModel):
    """Tracking events from courier API"""
    
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='events')
    status = models.CharField(max_length=50)
    location = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    occurred_at = models.DateTimeField()
    
    class Meta:
        db_table = 'shipment_events'
        ordering = ['-occurred_at']
```

### 4.2 Content Management

```python
# apps/content/models.py

from django.db import models
from core.models import TimestampedModel

class Article(TimestampedModel):
    """News and blog articles"""
    
    class ArticleType(models.TextChoices):
        NEWS = 'news', 'Industry News'
        GUIDE = 'guide', 'How-To Guide'
        ANNOUNCEMENT = 'announcement', 'Company Announcement'
        SUBSIDY = 'subsidy', 'Government Subsidy Info'
    
    slug = models.SlugField(max_length=200, unique=True)
    article_type = models.CharField(max_length=20, choices=ArticleType.choices)
    
    title_uz = models.CharField(max_length=300)
    title_ru = models.CharField(max_length=300)
    title_en = models.CharField(max_length=300)
    
    excerpt_uz = models.TextField(blank=True)
    excerpt_ru = models.TextField(blank=True)
    excerpt_en = models.TextField(blank=True)
    
    content_uz = models.TextField()
    content_ru = models.TextField()
    content_en = models.TextField()
    
    featured_image = models.ImageField(upload_to='articles/')
    
    author = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    published_at = models.DateTimeField(null=True)
    is_published = models.BooleanField(default=False)
    
    # SEO
    meta_title_uz = models.CharField(max_length=70, blank=True)
    meta_title_ru = models.CharField(max_length=70, blank=True)
    meta_title_en = models.CharField(max_length=70, blank=True)
    meta_description_uz = models.CharField(max_length=160, blank=True)
    meta_description_ru = models.CharField(max_length=160, blank=True)
    meta_description_en = models.CharField(max_length=160, blank=True)
    
    class Meta:
        db_table = 'articles'
        ordering = ['-published_at']


class VideoTutorial(TimestampedModel):
    """Academy video tutorials"""
    
    slug = models.SlugField(max_length=200, unique=True)
    
    title_uz = models.CharField(max_length=300)
    title_ru = models.CharField(max_length=300)
    title_en = models.CharField(max_length=300)
    
    description_uz = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    
    video_url = models.URLField()  # YouTube, etc.
    thumbnail = models.ImageField(upload_to='tutorials/')
    duration_minutes = models.PositiveIntegerField()
    
    # Related products
    related_products = models.ManyToManyField('catalog.Product', blank=True)
    
    is_published = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'video_tutorials'
```

---

## 5. API Specification

### 5.1 API Design Principles

- RESTful endpoints with consistent naming
- JSON:API or simple JSON response format
- JWT authentication with refresh tokens
- Rate limiting: 100 req/min for anonymous, 1000 req/min for authenticated
- Pagination: cursor-based for large lists
- Filtering via query parameters
- Multilingual: `Accept-Language` header or `?lang=uz` parameter

### 5.2 Core Endpoints

```yaml
# Authentication
POST   /api/v1/auth/register/              # User registration
POST   /api/v1/auth/login/                 # JWT login
POST   /api/v1/auth/refresh/               # Refresh token
POST   /api/v1/auth/logout/                # Invalidate token
POST   /api/v1/auth/telegram/              # Telegram initData auth
POST   /api/v1/auth/verify-inn/            # Soliq.uz INN verification

# User Profile
GET    /api/v1/users/me/                   # Current user profile
PATCH  /api/v1/users/me/                   # Update profile
GET    /api/v1/users/me/business/          # Business profile
POST   /api/v1/users/me/business/          # Create/update business profile

# Catalog
GET    /api/v1/categories/                 # List categories (tree)
GET    /api/v1/categories/{slug}/          # Category detail
GET    /api/v1/brands/                     # List brands
GET    /api/v1/brands/{slug}/              # Brand detail

GET    /api/v1/products/                   # List products (filterable)
GET    /api/v1/products/{slug}/            # Product detail
GET    /api/v1/products/{slug}/related/    # Related products
GET    /api/v1/products/{slug}/compatible/ # Compatible parts
GET    /api/v1/products/{slug}/documents/  # Product documents/PDFs
GET    /api/v1/products/compare/           # Compare products (?ids=1,2,3)

GET    /api/v1/parts/                      # Spare parts list
GET    /api/v1/parts/search/               # Part number search
GET    /api/v1/parts/{sku}/                # Part detail

# Search
GET    /api/v1/search/                     # Global search
GET    /api/v1/search/suggestions/         # Autocomplete

# Cart
GET    /api/v1/cart/                       # Get cart
POST   /api/v1/cart/items/                 # Add item
PATCH  /api/v1/cart/items/{id}/            # Update quantity
DELETE /api/v1/cart/items/{id}/            # Remove item
POST   /api/v1/cart/clear/                 # Clear cart

# Quotes (RFQ)
GET    /api/v1/quotes/                     # User's quotes
POST   /api/v1/quotes/                     # Create quote request
GET    /api/v1/quotes/{uuid}/              # Quote detail
PATCH  /api/v1/quotes/{uuid}/              # Update quote
POST   /api/v1/quotes/{uuid}/accept/       # Accept quote -> Order

# Orders
GET    /api/v1/orders/                     # User's orders
POST   /api/v1/orders/                     # Create order (from cart)
GET    /api/v1/orders/{uuid}/              # Order detail
GET    /api/v1/orders/{uuid}/tracking/     # Shipment tracking

# Payments
POST   /api/v1/payments/payme/create/      # Initiate Payme payment
POST   /api/v1/payments/payme/callback/    # Payme webhook
POST   /api/v1/payments/click/create/      # Initiate Click payment
POST   /api/v1/payments/click/callback/    # Click webhook

# Fleet Management (My Garage)
GET    /api/v1/garage/                     # User's machines
POST   /api/v1/garage/                     # Register machine
GET    /api/v1/garage/{id}/                # Machine detail
DELETE /api/v1/garage/{id}/                # Remove machine
GET    /api/v1/garage/{id}/parts/          # Compatible parts for this machine
GET    /api/v1/garage/{id}/warranty/       # Warranty status

# Services
POST   /api/v1/services/leasing-calc/      # Calculate leasing
POST   /api/v1/services/request/           # Service request
GET    /api/v1/services/warranty-check/    # Check warranty by VIN

# Dealer Portal (dealer role only)
GET    /api/v1/dealer/inventory/           # Central inventory
POST   /api/v1/dealer/orders/              # Order on behalf of customer
POST   /api/v1/dealer/warranty/register/   # Register warranty
GET    /api/v1/dealer/commissions/         # Commission reports

# Content
GET    /api/v1/articles/                   # News/articles
GET    /api/v1/articles/{slug}/            # Article detail
GET    /api/v1/tutorials/                  # Video tutorials
GET    /api/v1/tutorials/{slug}/           # Tutorial detail

# Utilities
GET    /api/v1/regions/                    # List regions
GET    /api/v1/exchange-rate/              # Current USD/UZS rate
GET    /api/v1/shipping/calculate/         # Calculate shipping cost
```

### 5.3 Product Filtering Parameters

```yaml
# GET /api/v1/products/

# Pagination
page: 1
page_size: 24

# Sorting
ordering: "-created_at" | "price" | "-price" | "name" | "popularity"

# Basic filters
category: "tractors"
brand: "yto,rostselmash"
product_type: "machinery" | "attachment" | "spare_part"
stock_status: "in_stock"
is_featured: true

# Price range
min_price: 10000
max_price: 50000

# Technical specs (dynamic based on category)
spec_horsepower_min: 80
spec_horsepower_max: 150
spec_working_width_min: 2.5
spec_crop_type: "cotton,wheat"

# Search
search: "yto traktor"
```

### 5.4 Response Examples

```json
// GET /api/v1/products/yto-x1204-tractor/

{
  "slug": "yto-x1204-tractor",
  "sku": "YTO-X1204",
  "product_type": "machinery",
  "name": {
    "uz": "YTO X1204 Traktor",
    "ru": "Трактор YTO X1204",
    "en": "YTO X1204 Tractor"
  },
  "short_description": {
    "uz": "120 ot kuchli universal traktor...",
    "ru": "Универсальный трактор мощностью 120 л.с...",
    "en": "120 HP versatile tractor..."
  },
  "category": {
    "slug": "tractors",
    "name": {"uz": "Traktorlar", "ru": "Тракторы", "en": "Tractors"}
  },
  "brand": {
    "slug": "yto",
    "name": "YTO",
    "country": "China",
    "logo": "https://cdn.example.com/brands/yto.png"
  },
  "pricing": {
    "show_to_guests": false,
    "base_usd": 45000.00,
    "retail_usd": 48000.00,
    "retail_uzs": 614400000,
    "wholesale_usd": 44000.00,
    "user_price_usd": 44000.00,  // Based on auth user's tier
    "user_price_uzs": 563200000
  },
  "stock": {
    "status": "in_stock",
    "quantity": 5,
    "warehouse": "Tashkent Main"
  },
  "specifications": {
    "horsepower": {"value": 120, "unit": "HP", "label": {"uz": "Quvvat", "ru": "Мощность", "en": "Power"}},
    "engine_type": {"value": "YTO Diesel 4-cylinder", "label": {"uz": "Dvigatel", "ru": "Двигатель", "en": "Engine"}},
    "transmission": {"value": "12F + 4R", "label": {"uz": "Uzatmalar qutisi", "ru": "КПП", "en": "Transmission"}},
    "working_width": {"value": null, "unit": null},
    "fuel_capacity": {"value": 200, "unit": "L", "label": {"uz": "Yoqilg'i sig'imi", "ru": "Топливный бак", "en": "Fuel Tank"}},
    "weight": {"value": 4500, "unit": "kg", "label": {"uz": "Og'irlik", "ru": "Вес", "en": "Weight"}}
  },
  "media": {
    "main_image": "https://cdn.example.com/products/yto-x1204-main.jpg",
    "images": [
      {"url": "https://cdn.example.com/products/yto-x1204-1.jpg", "alt": "Front view"},
      {"url": "https://cdn.example.com/products/yto-x1204-2.jpg", "alt": "Cabin interior"}
    ],
    "video_url": "https://youtube.com/watch?v=xxx"
  },
  "logistics": {
    "ships_from": "Tashkent",
    "weight_kg": 4500,
    "estimated_delivery_days": 3
  },
  "is_configurable": true,
  "configurator_options": [
    {
      "group": "Cabin",
      "options": [
        {"id": 1, "name": {"uz": "Standart kabina", "ru": "Стандартная кабина", "en": "Standard Cabin"}, "price_modifier_usd": 0, "is_default": true},
        {"id": 2, "name": {"uz": "Konditsionerli kabina", "ru": "Кабина с кондиционером", "en": "AC Cabin"}, "price_modifier_usd": 2500, "is_default": false}
      ]
    },
    {
      "group": "Tires",
      "options": [
        {"id": 3, "name": {"uz": "Standart shinalar", "ru": "Стандартные шины", "en": "Standard Tires"}, "price_modifier_usd": 0, "is_default": true},
        {"id": 4, "name": {"uz": "Kengaytirilgan shinalar", "ru": "Широкие шины", "en": "Wide Tires"}, "price_modifier_usd": 800, "is_default": false}
      ]
    }
  ],
  "documents": [
    {"type": "brochure", "title": "YTO X1204 Brochure", "url": "https://cdn.example.com/docs/yto-x1204-brochure.pdf", "language": "ru"},
    {"type": "manual", "title": "User Manual", "url": "https://cdn.example.com/docs/yto-x1204-manual.pdf", "language": "en"}
  ],
  "compatible_parts_count": 156,
  "related_products": ["yto-x1304-tractor", "yto-x904-tractor"],
  "meta": {
    "title": {"uz": "YTO X1204 Traktor - 120 ot kuchi | UzAgro", "ru": "...", "en": "..."},
    "description": {"uz": "YTO X1204 traktorini eng yaxshi narxda xarid qiling...", "ru": "...", "en": "..."}
  }
}
```

---

## 6. Frontend Architecture

### 6.1 Page Components Map

| Route | Component | Data Fetching | Key Features |
|-------|-----------|---------------|--------------|
| `/[locale]` | HomePage | SSR | Hero video, currency ticker, quick search, featured products |
| `/[locale]/catalog` | CatalogPage | SSR + Client | Category grid, filters, product listing |
| `/[locale]/catalog/[category]` | CategoryPage | SSR + Client | Filtered products, breadcrumbs |
| `/[locale]/catalog/product/[slug]` | ProductPage | SSR | Full specs, configurator, RFQ form, related |
| `/[locale]/parts` | PartsPage | SSR + Client | Part search, schematic browser |
| `/[locale]/parts/[partNumber]` | PartDetailPage | SSR | Compatibility list, add to cart |
| `/[locale]/compare` | ComparePage | Client | Side-by-side spec comparison |
| `/[locale]/cart` | CartPage | Client | Cart items, shipping calc, checkout |
| `/[locale]/services/leasing` | LeasingPage | Client | Calculator, bank partners |
| `/[locale]/services/warranty` | WarrantyPage | Client | VIN checker |
| `/[locale]/knowledge/news` | NewsPage | SSR | Article listing |
| `/[locale]/knowledge/news/[slug]` | ArticlePage | SSR | Full article |
| `/[locale]/knowledge/academy` | AcademyPage | SSR | Video tutorials |
| `/[locale]/cabinet` | CabinetLayout | Client (Protected) | Dashboard wrapper |
| `/[locale]/cabinet/profile` | ProfilePage | Client | User settings |
| `/[locale]/cabinet/garage` | GaragePage | Client | Registered machines |
| `/[locale]/cabinet/orders` | OrdersPage | Client | Order history |
| `/[locale]/cabinet/quotes` | QuotesPage | Client | RFQ history |
| `/[locale]/cabinet/documents` | DocumentsPage | Client | Invoices, GTDs |
| `/[locale]/auth/login` | LoginPage | Client | Phone/Telegram login |
| `/[locale]/auth/register` | RegisterPage | Client | Multi-step registration |

### 6.2 Key Component Specifications

#### ProductCard.tsx
```typescript
interface ProductCardProps {
  product: {
    slug: string;
    sku: string;
    name: LocalizedString;
    shortDescription: LocalizedString;
    mainImage: string;
    brand: { name: string; logo: string };
    pricing: {
      showToGuests: boolean;
      userPriceUsd: number | null;
      userPriceUzs: number | null;
    };
    stockStatus: 'in_stock' | 'low_stock' | 'pre_order' | 'out_of_stock';
    isFeatured: boolean;
  };
  showCompareButton?: boolean;
  onAddToCompare?: (slug: string) => void;
}

// Features:
// - Responsive image with next/image optimization
// - Stock status badge
// - Price display (hidden for guests if configured)
// - Quick "Add to Compare" button
// - "Request Quote" or "Add to Cart" CTA
// - Hover effect with subtle shadow lift
```

#### FilterSidebar.tsx
```typescript
interface FilterSidebarProps {
  category: Category;
  activeFilters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
  availableFilters: {
    brands: { slug: string; name: string; count: number }[];
    priceRange: { min: number; max: number };
    specifications: {
      key: string;
      label: LocalizedString;
      type: 'range' | 'checkbox' | 'select';
      options?: { value: string; label: string; count: number }[];
      range?: { min: number; max: number; unit: string };
    }[];
  };
}

// Features:
// - Collapsible sections
// - Range sliders for numeric specs (HP, width)
// - Checkboxes for multi-select (brand, crop type)
// - Active filter chips with clear buttons
// - "Clear All" button
// - Mobile: slide-out drawer
```

#### Configurator.tsx
```typescript
interface ConfiguratorProps {
  product: Product;
  options: ConfiguratorOptionGroup[];
  onConfigChange: (config: Record<string, number>) => void;
  currentConfig: Record<string, number>;
}

// Features:
// - Visual option selection (image thumbnails)
// - Real-time price update
// - 3D model viewer (future enhancement)
// - Configuration summary panel
// - "Request Quote with this Configuration" CTA
```

#### CurrencyTicker.tsx
```typescript
// Displays live USD/UZS rate
// Fetches from /api/v1/exchange-rate/ every 5 minutes
// Shows trend indicator (up/down arrow)
// Compact design for header placement
```

### 6.3 State Management

```typescript
// stores/cartStore.ts (Zustand)
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productSlug: string, quantity: number, config?: Record<string, number>) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed
  totalItems: () => number;
  subtotalUsd: () => number;
}

// stores/compareStore.ts (Zustand with persist)
interface CompareState {
  productSlugs: string[];  // Max 4
  
  addProduct: (slug: string) => void;
  removeProduct: (slug: string) => void;
  clearAll: () => void;
}

// stores/userStore.ts (Zustand)
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithTelegram: (initData: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}
```

### 6.4 Internationalization Setup

```typescript
// i18n/config.ts
export const locales = ['uz', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'uz';

// i18n/messages/uz.json (sample structure)
{
  "common": {
    "search": "Qidirish",
    "cart": "Savat",
    "login": "Kirish",
    "register": "Ro'yxatdan o'tish",
    "logout": "Chiqish",
    "loading": "Yuklanmoqda...",
    "error": "Xatolik yuz berdi",
    "retry": "Qayta urinish"
  },
  "navigation": {
    "home": "Bosh sahifa",
    "catalog": "Texnika",
    "parts": "Ehtiyot qismlar",
    "services": "Xizmatlar",
    "knowledge": "Bilim markazi",
    "cabinet": "Shaxsiy kabinet"
  },
  "catalog": {
    "filters": "Filtrlar",
    "clearFilters": "Tozalash",
    "sortBy": "Saralash",
    "showingResults": "{count} ta natija",
    "noResults": "Hech narsa topilmadi",
    "requestQuote": "Narx so'rash",
    "addToCart": "Savatga qo'shish",
    "compare": "Solishtirish",
    "inStock": "Mavjud",
    "outOfStock": "Mavjud emas",
    "preOrder": "Oldindan buyurtma"
  },
  "product": {
    "specifications": "Texnik xususiyatlar",
    "description": "Tavsif",
    "documents": "Hujjatlar",
    "compatibleParts": "Mos ehtiyot qismlar",
    "relatedProducts": "O'xshash mahsulotlar"
  },
  "cart": {
    "yourCart": "Sizning savatingiz",
    "empty": "Savat bo'sh",
    "subtotal": "Jami",
    "shipping": "Yetkazib berish",
    "total": "Umumiy",
    "checkout": "Rasmiylashtirish"
  }
}
```

---

## 7. Telegram Integration

### 7.1 Bot Architecture (aiogram 3.x)

```python
# telegram-bot/main.py

import asyncio
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

from config import BOT_TOKEN
from handlers import start, catalog, orders, support

async def main():
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    
    # Register routers
    dp.include_router(start.router)
    dp.include_router(catalog.router)
    dp.include_router(orders.router)
    dp.include_router(support.router)
    
    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
```

```python
# telegram-bot/handlers/start.py

from aiogram import Router, F
from aiogram.types import Message, WebAppInfo
from aiogram.filters import CommandStart
from aiogram.utils.keyboard import InlineKeyboardBuilder

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    builder = InlineKeyboardBuilder()
    
    # Mini App button
    builder.button(
        text="🌐 Katalogni ochish",
        web_app=WebAppInfo(url="https://app.uzagro.uz")
    )
    builder.button(text="🔍 Qism qidirish", callback_data="search_part")
    builder.button(text="📦 Buyurtmalarim", callback_data="my_orders")
    builder.button(text="💬 Yordam", callback_data="support")
    builder.adjust(1)
    
    await message.answer(
        f"Assalomu alaykum, {message.from_user.first_name}! 👋\n\n"
        "UzAgro botiga xush kelibsiz. Qishloq xo'jaligi texnikasi va ehtiyot qismlarini "
        "qulay tarzda ko'rishingiz mumkin.",
        reply_markup=builder.as_markup()
    )
```

### 7.2 Mini App Detection (Frontend)

```typescript
// lib/hooks/useTelegram.ts

import { useEffect, useState } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const tgWebApp = window.Telegram?.WebApp;
    if (tgWebApp) {
      setWebApp(tgWebApp);
      setIsInTelegram(true);
      tgWebApp.expand(); // Expand to full height
    }
  }, []);

  return {
    webApp,
    isInTelegram,
    user: webApp?.initDataUnsafe?.user,
    colorScheme: webApp?.colorScheme || 'light',
    initData: webApp?.initData || '',
  };
}
```

### 7.3 Telegram Auth Endpoint

```python
# backend/apps/accounts/views.py

import hashlib
import hmac
import json
from urllib.parse import parse_qsl
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class TelegramAuthView(APIView):
    """Authenticate user via Telegram Mini App initData"""
    
    def post(self, request):
        init_data = request.data.get('init_data', '')
        
        # Parse and validate initData
        parsed = dict(parse_qsl(init_data, keep_blank_values=True))
        received_hash = parsed.pop('hash', '')
        
        # Create data check string
        data_check_string = '\n'.join(
            f"{k}={v}" for k, v in sorted(parsed.items())
        )
        
        # Calculate secret key
        secret_key = hmac.new(
            b"WebAppData",
            settings.TELEGRAM_BOT_TOKEN.encode(),
            hashlib.sha256
        ).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if calculated_hash != received_hash:
            return Response({'error': 'Invalid init data'}, status=401)
        
        # Extract user data
        user_data = json.loads(parsed.get('user', '{}'))
        telegram_id = user_data.get('id')
        
        if not telegram_id:
            return Response({'error': 'No user data'}, status=400)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'username': f"tg_{telegram_id}",
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
                'telegram_username': user_data.get('username', ''),
                'preferred_language': user_data.get('language_code', 'uz')[:2],
            }
        )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
            'is_new': created
        })
```

---

## 8. Third-Party Integrations

### 8.1 Soliq.uz (Tax Verification)

```python
# backend/apps/accounts/services/soliq_verification.py

import httpx
from django.conf import settings
from typing import Optional, Dict, Any

class SoliqService:
    """Integration with Uzbekistan State Tax Committee API"""
    
    BASE_URL = "https://api.soliq.uz"  # or proxy endpoint
    
    def __init__(self):
        self.api_key = settings.SOLIQ_API_KEY
    
    async def verify_inn(self, inn: str) -> Optional[Dict[str, Any]]:
        """
        Verify business by INN (Tax ID)
        
        Returns company data if valid:
        {
            "inn": "123456789",
            "company_name": "EXAMPLE LLC",
            "legal_address": "Tashkent, ...",
            "vat_payer": true,
            "status": "active"
        }
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.BASE_URL}/v1/taxpayer/{inn}",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    return None  # INN not found
                else:
                    raise SoliqAPIError(f"API error: {response.status_code}")
                    
            except httpx.TimeoutException:
                raise SoliqAPIError("Soliq API timeout")

class SoliqAPIError(Exception):
    pass
```

### 8.2 Payme Integration

```python
# backend/apps/payments/services/payme.py

import base64
import hashlib
from decimal import Decimal
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

class PaymeService:
    """Payme payment integration"""
    
    MERCHANT_ID = settings.PAYME_MERCHANT_ID
    SECRET_KEY = settings.PAYME_SECRET_KEY
    
    def generate_payment_link(self, order_id: str, amount_uzs: Decimal) -> str:
        """Generate Payme checkout URL"""
        # Amount in tiyin (1 UZS = 100 tiyin)
        amount_tiyin = int(amount_uzs * 100)
        
        params = f"m={self.MERCHANT_ID};ac.order_id={order_id};a={amount_tiyin}"
        encoded = base64.b64encode(params.encode()).decode()
        
        return f"https://checkout.paycom.uz/{encoded}"
    
    def verify_callback(self, request_data: dict) -> bool:
        """Verify Payme callback signature"""
        # Implementation depends on Payme's callback format
        pass


class PaymeCallbackView(APIView):
    """Handle Payme merchant API callbacks"""
    
    authentication_classes = []  # Payme uses its own auth
    
    def post(self, request):
        # Verify authorization header
        auth_header = request.headers.get('Authorization', '')
        if not self._verify_auth(auth_header):
            return self._error_response(-32504, "Auth failed")
        
        method = request.data.get('method')
        params = request.data.get('params', {})
        
        handlers = {
            'CheckPerformTransaction': self._check_perform,
            'CreateTransaction': self._create_transaction,
            'PerformTransaction': self._perform_transaction,
            'CancelTransaction': self._cancel_transaction,
            'CheckTransaction': self._check_transaction,
        }
        
        handler = handlers.get(method)
        if not handler:
            return self._error_response(-32601, "Method not found")
        
        return handler(params)
    
    def _verify_auth(self, auth_header: str) -> bool:
        # Verify Basic auth with Payme credentials
        pass
    
    def _check_perform(self, params):
        """Check if transaction can be performed"""
        order_id = params.get('account', {}).get('order_id')
        amount = params.get('amount')
        
        try:
            order = Order.objects.get(uuid=order_id)
            expected_amount = int(order.total_uzs * 100)
            
            if amount != expected_amount:
                return self._error_response(-31001, "Invalid amount")
            
            if order.status != Order.Status.PENDING:
                return self._error_response(-31050, "Order already processed")
            
            return Response({
                'result': {
                    'allow': True
                }
            })
        except Order.DoesNotExist:
            return self._error_response(-31050, "Order not found")
    
    # ... other handlers
    
    def _error_response(self, code: int, message: str):
        return Response({
            'error': {
                'code': code,
                'message': message
            }
        })
```

### 8.3 Click Integration

```python
# backend/apps/payments/services/click.py

import hashlib
from decimal import Decimal
from django.conf import settings

class ClickService:
    """Click payment integration"""
    
    MERCHANT_ID = settings.CLICK_MERCHANT_ID
    SERVICE_ID = settings.CLICK_SERVICE_ID
    SECRET_KEY = settings.CLICK_SECRET_KEY
    
    def generate_payment_link(self, order_id: str, amount_uzs: Decimal, return_url: str) -> str:
        """Generate Click payment URL"""
        params = {
            'merchant_id': self.MERCHANT_ID,
            'service_id': self.SERVICE_ID,
            'transaction_param': order_id,
            'amount': str(amount_uzs),
            'return_url': return_url
        }
        
        query = '&'.join(f"{k}={v}" for k, v in params.items())
        return f"https://my.click.uz/services/pay?{query}"
    
    def verify_signature(self, click_trans_id: str, service_id: str, 
                         merchant_trans_id: str, amount: str, 
                         action: str, sign_time: str, sign_string: str) -> bool:
        """Verify Click callback signature"""
        data = f"{click_trans_id}{service_id}{self.SECRET_KEY}{merchant_trans_id}{amount}{action}{sign_time}"
        calculated = hashlib.md5(data.encode()).hexdigest()
        return calculated == sign_string
```

### 8.4 Logistics (BTS Express / Fargo)

```python
# backend/apps/logistics/services/bts_express.py

import httpx
from typing import Dict, Any, List
from decimal import Decimal

class BTSExpressService:
    """BTS Express logistics integration"""
    
    BASE_URL = "https://api.bts.uz"  # Placeholder
    
    def __init__(self):
        self.api_key = settings.BTS_API_KEY
    
    async def calculate_shipping(
        self, 
        origin_region: str,
        destination_region: str,
        weight_kg: Decimal,
        dimensions: Dict[str, int]  # length, width, height in cm
    ) -> Dict[str, Any]:
        """
        Calculate shipping cost and delivery time
        
        Returns:
        {
            "cost_uzs": 150000,
            "estimated_days": 3,
            "service_type": "standard"
        }
        """
        # Calculate volumetric weight
        volumetric = (dimensions['length'] * dimensions['width'] * dimensions['height']) / 5000
        billable_weight = max(float(weight_kg), volumetric)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v1/rates",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "origin": origin_region,
                    "destination": destination_region,
                    "weight": billable_weight
                }
            )
            return response.json()
    
    async def create_shipment(self, order: 'Order') -> str:
        """Create shipment and return tracking number"""
        pass
    
    async def get_tracking(self, tracking_number: str) -> List[Dict[str, Any]]:
        """Get tracking events"""
        pass
```

### 8.5 Currency Exchange Rate

```python
# backend/core/utils/currency.py

import httpx
from decimal import Decimal
from django.core.cache import cache
from django.conf import settings

class CurrencyService:
    """Fetch and cache USD/UZS exchange rate"""
    
    # Central Bank of Uzbekistan API
    CBU_URL = "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
    
    CACHE_KEY = "usd_uzs_rate"
    CACHE_TTL = 3600  # 1 hour
    
    @classmethod
    async def get_usd_uzs_rate(cls) -> Decimal:
        """Get current USD to UZS rate"""
        cached = cache.get(cls.CACHE_KEY)
        if cached:
            return Decimal(cached)
        
        async with httpx.AsyncClient() as client:
            response = await client.get(cls.CBU_URL)
            data = response.json()
            
            # Find USD in the response
            for currency in data:
                if currency.get('Ccy') == 'USD':
                    rate = Decimal(currency.get('Rate', '12800'))
                    cache.set(cls.CACHE_KEY, str(rate), cls.CACHE_TTL)
                    return rate
        
        # Fallback rate
        return Decimal('12800')
    
    @classmethod
    def convert_usd_to_uzs(cls, amount_usd: Decimal, rate: Decimal) -> Decimal:
        """Convert USD to UZS"""
        return (amount_usd * rate).quantize(Decimal('1'))
```

---

## 9. Design System

### 9.1 Color Palette

```css
/* tailwind.config.ts - extend theme.colors */

:root {
  /* Primary - Agricultural Green */
  --color-primary-50: #f4f7f0;
  --color-primary-100: #e5ebe0;
  --color-primary-200: #ccd8c2;
  --color-primary-300: #a8bc9a;
  --color-primary-400: #829d70;
  --color-primary-500: #628150;
  --color-primary-600: #4d673f;
  --color-primary-700: #3d5233;
  --color-primary-800: #33432b;
  --color-primary-900: #2b3825;
  --color-primary-950: #151d12;

  /* Secondary - Earth Brown */
  --color-secondary-50: #fbf6f1;
  --color-secondary-100: #f5e9de;
  --color-secondary-200: #ead1bc;
  --color-secondary-300: #dcb391;
  --color-secondary-400: #cd9065;
  --color-secondary-500: #c27748;
  --color-secondary-600: #b4633d;
  --color-secondary-700: #964e34;
  --color-secondary-800: #7a4130;
  --color-secondary-900: #63372a;
  --color-secondary-950: #351b14;

  /* Accent - Safety Orange (CTAs) */
  --color-accent-500: #f97316;
  --color-accent-600: #ea580c;
  --color-accent-700: #c2410c;

  /* Neutral - Grayscape */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #eab308;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### 9.2 Typography

```css
/* globals.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Type scale */
.text-display { font-size: 3rem; line-height: 1.1; font-weight: 700; }
.text-h1 { font-size: 2.25rem; line-height: 1.2; font-weight: 700; }
.text-h2 { font-size: 1.875rem; line-height: 1.25; font-weight: 600; }
.text-h3 { font-size: 1.5rem; line-height: 1.3; font-weight: 600; }
.text-h4 { font-size: 1.25rem; line-height: 1.4; font-weight: 600; }
.text-body { font-size: 1rem; line-height: 1.5; }
.text-body-sm { font-size: 0.875rem; line-height: 1.5; }
.text-caption { font-size: 0.75rem; line-height: 1.4; }
```

### 9.3 Component Styles

```typescript
// tailwind.config.ts

const config = {
  theme: {
    extend: {
      // Neomorphic shadows for industrial feel
      boxShadow: {
        'neo': '6px 6px 12px #d1d1d1, -6px -6px 12px #ffffff',
        'neo-inset': 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff',
        'neo-button': '4px 4px 8px #d1d1d1, -4px -4px 8px #ffffff',
        'neo-button-active': 'inset 2px 2px 4px #d1d1d1, inset -2px -2px 4px #ffffff',
      },
      
      // Touch-friendly sizing
      spacing: {
        'touch': '44px',  // Minimum touch target
        'thumb': '48px',  // Comfortable thumb target
      },
      
      // Border radius
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      }
    }
  }
};
```

### 9.4 UI Component Examples

```tsx
// components/ui/Button.tsx

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles - large touch targets
  'inline-flex items-center justify-center font-medium transition-all duration-200 min-h-[44px] px-6 rounded-button focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-neo-button active:shadow-neo-button-active',
        secondary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'text-neutral-700 hover:bg-neutral-100',
      },
      size: {
        sm: 'min-h-[36px] px-4 text-sm',
        md: 'min-h-[44px] px-6 text-base',
        lg: 'min-h-[52px] px-8 text-lg',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    }
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant, 
  size, 
  isLoading,
  children,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin mr-2">⟳</span>
      ) : null}
      {children}
    </button>
  );
}
```

```tsx
// components/ui/Card.tsx

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'neo';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-card overflow-hidden',
        {
          'border border-neutral-200': variant === 'default',
          'shadow-lg': variant === 'elevated',
          'shadow-neo': variant === 'neo',
        },
        className
      )}
      {...props}
    />
  );
}
```

### 9.5 Mobile-First Layout

```tsx
// components/layout/BottomNav.tsx
// Fixed bottom navigation for mobile - thumb zone friendly

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'home' },
  { href: '/catalog', icon: Grid, label: 'catalog' },
  { href: '/cart', icon: ShoppingCart, label: 'cart', showBadge: true },
  { href: '/cabinet', icon: User, label: 'cabinet' },
];

export function BottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === `/${locale}${item.href}` || 
                          pathname.startsWith(`/${locale}${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full relative',
                'text-neutral-500 hover:text-primary-600',
                isActive && 'text-primary-600'
              )}
            >
              <Icon className="w-6 h-6" />
              {item.showBadge && totalItems() > 0 && (
                <span className="absolute top-2 right-1/4 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

---

## 10. Implementation Phases

### Phase 1: Digital Foundation (Weeks 1-6)

#### Week 1-2: Infrastructure Setup
- [ ] Initialize monorepo structure
- [ ] Set up Docker Compose for local development
- [ ] Configure PostgreSQL with initial migrations
- [ ] Set up Django project with apps skeleton
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up ESLint, Prettier, pre-commit hooks

#### Week 3-4: Core Backend
- [ ] Implement User model and authentication (JWT)
- [ ] Create Category and Brand models
- [ ] Build Product model with specifications JSON
- [ ] Set up Django REST Framework serializers
- [ ] Implement basic CRUD API endpoints
- [ ] Configure MeiliSearch integration
- [ ] Create product import script (CSV/JSON)

#### Week 5-6: Core Frontend
- [ ] Build layout components (Header, Footer, BottomNav)
- [ ] Implement i18n with next-intl
- [ ] Create HomePage with hero section
- [ ] Build CatalogPage with product grid
- [ ] Implement FilterSidebar component
- [ ] Create ProductCard component
- [ ] Build ProductDetailPage with specs display
- [ ] Implement global search functionality

**Phase 1 Deliverable:** Informational website with product catalog, search, and basic filtering.

---

### Phase 2: Commerce Engine (Weeks 7-12)

#### Week 7-8: User Accounts & Verification
- [ ] Build registration flow (phone-based)
- [ ] Implement Soliq.uz INN verification
- [ ] Create BusinessProfile model and flow
- [ ] Build user cabinet layout
- [ ] Implement profile management
- [ ] Add tiered pricing logic (guest/retail/wholesale)

#### Week 9-10: Cart & Ordering
- [ ] Implement Cart model and API
- [ ] Build CartPage with items management
- [ ] Create shipping cost calculator
- [ ] Implement Quote (RFQ) system
- [ ] Build QuoteRequestForm with configurator
- [ ] Create PDF quote generation (WeasyPrint)
- [ ] Build OrdersPage with status tracking

#### Week 11-12: Payments
- [ ] Integrate Payme API
- [ ] Integrate Click API
- [ ] Build payment selection UI
- [ ] Implement webhook handlers
- [ ] Create payment status notifications
- [ ] Test end-to-end payment flow

**Phase 2 Deliverable:** Functional e-commerce with B2B verification, RFQ system, and payment processing.

---

### Phase 3: Ecosystem Expansion (Weeks 13-18)

#### Week 13-14: Telegram Integration
- [ ] Set up aiogram bot framework
- [ ] Implement start command and menu
- [ ] Build Telegram Mini App detection
- [ ] Implement Telegram authentication
- [ ] Create notification system
- [ ] Build part search via bot

#### Week 15-16: Logistics & Dealer Portal
- [ ] Integrate BTS Express/Fargo APIs
- [ ] Implement real-time shipping calculation
- [ ] Build shipment tracking UI
- [ ] Create DealerProfile model
- [ ] Build Dealer Portal pages
- [ ] Implement order-on-behalf functionality
- [ ] Create warranty registration system

#### Week 17-18: Knowledge Hub & Polish
- [ ] Build Article/News CMS
- [ ] Create AcademyPage with video tutorials
- [ ] Integrate weather API (optional)
- [ ] Implement "My Garage" fleet management
- [ ] Add compatible parts filtering
- [ ] Performance optimization (caching, CDN)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Accessibility audit and fixes

**Phase 3 Deliverable:** Complete platform with Telegram ecosystem, dealer network support, and content hub.

---

## 11. Testing Requirements

### 11.1 Backend Testing

```python
# tests/test_catalog.py

import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from apps.catalog.models import Product, Category, Brand

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def sample_product(db):
    category = Category.objects.create(
        slug='tractors',
        name_uz='Traktorlar',
        name_ru='Тракторы',
        name_en='Tractors'
    )
    brand = Brand.objects.create(
        slug='yto',
        name='YTO',
        country='China'
    )
    return Product.objects.create(
        sku='YTO-X1204',
        slug='yto-x1204-tractor',
        product_type='machinery',
        name_uz='YTO X1204 Traktor',
        name_ru='Трактор YTO X1204',
        name_en='YTO X1204 Tractor',
        category=category,
        brand=brand,
        base_price_usd=45000,
        stock_status='in_stock'
    )

class TestProductAPI:
    def test_list_products(self, api_client, sample_product):
        url = reverse('product-list')
        response = api_client.get(url)
        assert response.status_code == 200
        assert len(response.data['results']) == 1
    
    def test_product_detail(self, api_client, sample_product):
        url = reverse('product-detail', kwargs={'slug': 'yto-x1204-tractor'})
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data['sku'] == 'YTO-X1204'
    
    def test_filter_by_brand(self, api_client, sample_product):
        url = reverse('product-list') + '?brand=yto'
        response = api_client.get(url)
        assert response.status_code == 200
        assert len(response.data['results']) == 1
    
    def test_price_hidden_for_guests(self, api_client, sample_product):
        sample_product.show_price_to_guests = False
        sample_product.save()
        
        url = reverse('product-detail', kwargs={'slug': 'yto-x1204-tractor'})
        response = api_client.get(url)
        assert response.data['pricing']['user_price_usd'] is None
```

### 11.2 Frontend Testing

```typescript
// __tests__/components/ProductCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/catalog/ProductCard';

const mockProduct = {
  slug: 'yto-x1204-tractor',
  sku: 'YTO-X1204',
  name: { uz: 'YTO X1204 Traktor', ru: 'Трактор YTO X1204', en: 'YTO X1204 Tractor' },
  shortDescription: { uz: 'Test description', ru: '', en: '' },
  mainImage: '/images/products/yto.jpg',
  brand: { name: 'YTO', logo: '/brands/yto.png' },
  pricing: {
    showToGuests: true,
    userPriceUsd: 45000,
    userPriceUzs: 576000000,
  },
  stockStatus: 'in_stock' as const,
  isFeatured: false,
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('YTO X1204 Tractor')).toBeInTheDocument();
  });
  
  it('shows price when allowed', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });
  
  it('hides price when not allowed for guests', () => {
    const guestProduct = {
      ...mockProduct,
      pricing: { ...mockProduct.pricing, showToGuests: false, userPriceUsd: null }
    };
    render(<ProductCard product={guestProduct} />);
    expect(screen.getByText(/Narx so'rash/)).toBeInTheDocument();
  });
  
  it('calls onAddToCompare when compare button clicked', () => {
    const mockHandler = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        showCompareButton 
        onAddToCompare={mockHandler} 
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /compare/i }));
    expect(mockHandler).toHaveBeenCalledWith('yto-x1204-tractor');
  });
});
```

### 11.3 E2E Testing (Playwright)

```typescript
// e2e/catalog.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('should filter products by brand', async ({ page }) => {
    await page.goto('/uz/catalog');
    
    // Open filter sidebar on mobile
    await page.click('[data-testid="filter-toggle"]');
    
    // Select YTO brand
    await page.click('[data-testid="brand-filter-yto"]');
    
    // Wait for filtered results
    await page.waitForURL(/brand=yto/);
    
    // Verify all visible products are YTO
    const brandBadges = page.locator('[data-testid="product-brand"]');
    await expect(brandBadges).toHaveCount(await brandBadges.count());
    for (const badge of await brandBadges.all()) {
      await expect(badge).toHaveText('YTO');
    }
  });
  
  test('should add product to cart', async ({ page }) => {
    await page.goto('/uz/catalog/product/yto-x1204-tractor');
    
    // Click add to cart (for parts) or request quote (for machinery)
    await page.click('[data-testid="request-quote-btn"]');
    
    // Fill quote form
    await page.fill('[name="quantity"]', '2');
    await page.fill('[name="notes"]', 'Test quote request');
    await page.click('[data-testid="submit-quote"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="quote-success"]')).toBeVisible();
  });
});
```

---

## 12. Deployment Configuration

### 12.1 Docker Compose (Production)

```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: always
    
  redis:
    image: redis:7-alpine
    restart: always
    
  meilisearch:
    image: getmeili/meilisearch:v1.6
    volumes:
      - meilisearch_data:/meili_data
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY}
    restart: always
    
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - REDIS_URL=redis://redis:6379/0
      - MEILISEARCH_URL=http://meilisearch:7700
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=False
    depends_on:
      - db
      - redis
      - meilisearch
    restart: always
    
  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A config worker -l info
    environment:
      - DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    restart: always
    
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    restart: always
    
  telegram-bot:
    build:
      context: ./telegram-bot
      dockerfile: Dockerfile
    environment:
      - BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - API_URL=http://backend:8000
    depends_on:
      - backend
    restart: always
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - static_volume:/var/www/static:ro
      - media_volume:/var/www/media:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    depends_on:
      - backend
      - frontend
    restart: always

volumes:
  postgres_data:
  meilisearch_data:
  static_volume:
  media_volume:
```

### 12.2 Environment Variables

```bash
# .env.example

# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=uzagro.uz,www.uzagro.uz,app.uzagro.uz

# Database
DB_NAME=uzagro
DB_USER=uzagro_user
DB_PASSWORD=secure-password
DATABASE_URL=postgres://uzagro_user:secure-password@db:5432/uzagro

# Redis
REDIS_URL=redis://redis:6379/0

# MeiliSearch
MEILI_MASTER_KEY=your-meili-key
MEILISEARCH_URL=http://meilisearch:7700

# Integrations
SOLIQ_API_KEY=your-soliq-api-key
PAYME_MERCHANT_ID=your-payme-merchant-id
PAYME_SECRET_KEY=your-payme-secret
CLICK_MERCHANT_ID=your-click-merchant-id
CLICK_SERVICE_ID=your-click-service-id
CLICK_SECRET_KEY=your-click-secret
BTS_API_KEY=your-bts-api-key

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token

# Frontend
NEXT_PUBLIC_API_URL=https://api.uzagro.uz
NEXT_PUBLIC_SITE_URL=https://uzagro.uz
```

### 12.3 Nginx Configuration

```nginx
# nginx/conf.d/default.conf

upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name uzagro.uz www.uzagro.uz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name uzagro.uz www.uzagro.uz;
    
    ssl_certificate /etc/letsencrypt/live/uzagro.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/uzagro.uz/privkey.pem;
    
    # Static files
    location /static/ {
        alias /var/www/static/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /media/ {
        alias /var/www/media/;
        expires 7d;
    }
    
    # API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin
    location /admin/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}

# Telegram Mini App subdomain
server {
    listen 443 ssl http2;
    server_name app.uzagro.uz;
    
    ssl_certificate /etc/letsencrypt/live/uzagro.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/uzagro.uz/privkey.pem;
    
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Appendix A: Data Seeding Script

```python
# scripts/seed_data.py

import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.catalog.models import Category, Brand, Product
from apps.accounts.models import Region

def seed_regions():
    regions = [
        ('TAS', "Toshkent shahri", "Ташкент город", "Tashkent City"),
        ('TOSH', "Toshkent viloyati", "Ташкентская область", "Tashkent Region"),
        ('SAM', "Samarqand", "Самарканд", "Samarkand"),
        ('BUX', "Buxoro", "Бухара", "Bukhara"),
        ('FAR', "Farg'ona", "Фергана", "Fergana"),
        ('AND', "Andijon", "Андижан", "Andijan"),
        ('NAM', "Namangan", "Наманган", "Namangan"),
        ('QAS', "Qashqadaryo", "Кашкадарья", "Kashkadarya"),
        ('SUR', "Surxondaryo", "Сурхандарья", "Surkhandarya"),
        ('JIZ', "Jizzax", "Джизак", "Jizzakh"),
        ('SIR', "Sirdaryo", "Сырдарья", "Syrdarya"),
        ('NAV', "Navoiy", "Навоий", "Navoi"),
        ('XOR', "Xorazm", "Хорезм", "Khorezm"),
        ('QAR', "Qoraqalpog'iston", "Каракалпакстан", "Karakalpakstan"),
    ]
    
    for code, name_uz, name_ru, name_en in regions:
        Region.objects.get_or_create(
            code=code,
            defaults={'name_uz': name_uz, 'name_ru': name_ru, 'name_en': name_en}
        )
    print(f"Created {len(regions)} regions")

def seed_categories():
    categories = [
        {
            'slug': 'tractors',
            'name_uz': 'Traktorlar',
            'name_ru': 'Тракторы',
            'name_en': 'Tractors',
            'filterable_attributes': ['horsepower', 'engine_type', 'drive_type'],
            'children': [
                {'slug': 'wheeled-tractors', 'name_uz': "G'ildirakli traktorlar", 'name_ru': 'Колесные тракторы', 'name_en': 'Wheeled Tractors'},
                {'slug': 'crawler-tractors', 'name_uz': "Zanjirbandli traktorlar", 'name_ru': 'Гусеничные тракторы', 'name_en': 'Crawler Tractors'},
            ]
        },
        {
            'slug': 'harvesters',
            'name_uz': "O'rim-yig'im mashinalari",
            'name_ru': 'Уборочная техника',
            'name_en': 'Harvesters',
            'filterable_attributes': ['working_width', 'crop_type', 'tank_capacity'],
            'children': [
                {'slug': 'cotton-harvesters', 'name_uz': 'Paxta terim mashinalari', 'name_ru': 'Хлопкоуборочные машины', 'name_en': 'Cotton Harvesters'},
                {'slug': 'grain-combines', 'name_uz': "Don kombaynlari", 'name_ru': 'Зерноуборочные комбайны', 'name_en': 'Grain Combines'},
            ]
        },
        {
            'slug': 'tillage',
            'name_uz': 'Tuproq ishlash',
            'name_ru': 'Почвообработка',
            'name_en': 'Tillage Equipment',
            'filterable_attributes': ['working_width', 'working_depth'],
        },
        {
            'slug': 'spare-parts',
            'name_uz': 'Ehtiyot qismlar',
            'name_ru': 'Запасные части',
            'name_en': 'Spare Parts',
        },
    ]
    
    for cat_data in categories:
        children = cat_data.pop('children', [])
        parent, _ = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        for child_data in children:
            Category.objects.get_or_create(
                slug=child_data['slug'],
                defaults={**child_data, 'parent': parent}
            )
    
    print(f"Created categories")

def seed_brands():
    brands = [
        ('yto', 'YTO', 'China', 'Ведущий китайский производитель сельхозтехники'),
        ('rostselmash', 'Rostselmash', 'Russia', 'Крупнейший производитель комбайнов в России'),
        ('kuhn', 'KUHN', 'France', 'Мировой лидер в производстве почвообрабатывающей техники'),
        ('lemken', 'LEMKEN', 'Germany', 'Немецкое качество плугов и борон'),
        ('foton', 'Foton Lovol', 'China', 'Производитель тракторов и комбайнов'),
    ]
    
    for slug, name, country, desc in brands:
        Brand.objects.get_or_create(
            slug=slug,
            defaults={
                'name': name,
                'country': country,
                'description_ru': desc,
                'description_uz': desc,
                'description_en': desc,
            }
        )
    print(f"Created {len(brands)} brands")

if __name__ == '__main__':
    seed_regions()
    seed_categories()
    seed_brands()
    print("Seeding complete!")
```

---

## Appendix B: AI Agent Instructions

When implementing this project with AI coding assistance:

1. **Start with Phase 1** - Get the foundation solid before adding complexity
2. **Follow the folder structure exactly** - Consistency aids maintainability
3. **Use TypeScript strictly** - No `any` types without explicit justification
4. **Write tests alongside features** - Aim for 80%+ coverage on critical paths
5. **Commit frequently** - Small, focused commits with conventional commit messages
6. **Document API changes** - Update OpenAPI/Swagger specs as you build
7. **Mobile-first CSS** - Always start with mobile breakpoints in Tailwind
8. **Translations early** - Add all user-facing strings to i18n files immediately
9. **Security first** - Validate all inputs, sanitize outputs, use parameterized queries

---

*This roadmap is a living document. Update it as requirements evolve and implementation details are refined.*
