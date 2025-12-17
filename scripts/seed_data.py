"""
Seed data script for UzAgro Platform.
Populates the database with initial regions, categories, brands, and sample products.

Usage:
    cd backend
    python manage.py shell < ../scripts/seed_data.py
    
Or:
    python scripts/seed_data.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from decimal import Decimal
from apps.accounts.models import Region
from apps.catalog.models import Category, Brand, Product


def seed_regions():
    """Seed Uzbekistan regions (viloyats)."""
    print("🗺️  Создание регионов...")
    
    regions = [
        ('TAS', 'Город Ташкент', 'Toshkent shahri', 'Tashkent City', 1, 3),
        ('TOSH', 'Ташкентская область', 'Toshkent viloyati', 'Tashkent Region', 1, 3),
        ('SAM', 'Самаркандская область', 'Samarqand viloyati', 'Samarkand Region', 2, 5),
        ('BUX', 'Бухарская область', 'Buxoro viloyati', 'Bukhara Region', 3, 7),
        ('FAR', 'Ферганская область', "Farg'ona viloyati", 'Fergana Region', 2, 5),
        ('AND', 'Андижанская область', 'Andijon viloyati', 'Andijan Region', 2, 5),
        ('NAM', 'Наманганская область', 'Namangan viloyati', 'Namangan Region', 2, 5),
        ('QAS', 'Кашкадарьинская область', 'Qashqadaryo viloyati', 'Kashkadarya Region', 3, 7),
        ('SUR', 'Сурхандарьинская область', 'Surxondaryo viloyati', 'Surkhandarya Region', 4, 8),
        ('JIZ', 'Джизакская область', 'Jizzax viloyati', 'Jizzakh Region', 2, 5),
        ('SIR', 'Сырдарьинская область', 'Sirdaryo viloyati', 'Syrdarya Region', 2, 4),
        ('NAV', 'Навоийская область', 'Navoiy viloyati', 'Navoi Region', 3, 7),
        ('XOR', 'Хорезмская область', 'Xorazm viloyati', 'Khorezm Region', 4, 8),
        ('QAR', 'Республика Каракалпакстан', "Qoraqalpog'iston Respublikasi", 'Karakalpakstan', 5, 10),
    ]
    
    for code, name_ru, name_uz, name_en, min_days, max_days in regions:
        Region.objects.get_or_create(
            code=code,
            defaults={
                'name_ru': name_ru,
                'name_uz': name_uz,
                'name_en': name_en,
                'delivery_days_min': min_days,
                'delivery_days_max': max_days,
            }
        )
    
    print(f"   ✓ Создано {len(regions)} регионов")


def seed_categories():
    """Seed product categories."""
    print("📁 Создание категорий...")
    
    # Main categories
    categories = [
        {
            'slug': 'tractors',
            'name_ru': 'Тракторы',
            'name_uz': 'Traktorlar',
            'name_en': 'Tractors',
            'icon': 'tractor',
            'order': 1,
            'children': [
                {'slug': 'wheeled-tractors', 'name_ru': 'Колёсные тракторы', 'name_uz': "G'ildirakli traktorlar", 'name_en': 'Wheeled Tractors'},
                {'slug': 'crawler-tractors', 'name_ru': 'Гусеничные тракторы', 'name_uz': 'Zanjirbandli traktorlar', 'name_en': 'Crawler Tractors'},
                {'slug': 'mini-tractors', 'name_ru': 'Мини-тракторы', 'name_uz': 'Mini traktorlar', 'name_en': 'Mini Tractors'},
            ]
        },
        {
            'slug': 'harvesters',
            'name_ru': 'Уборочная техника',
            'name_uz': "O'rim-yig'im mashinalari",
            'name_en': 'Harvesters',
            'icon': 'wheat',
            'order': 2,
            'children': [
                {'slug': 'cotton-harvesters', 'name_ru': 'Хлопкоуборочные машины', 'name_uz': 'Paxta terim mashinalari', 'name_en': 'Cotton Harvesters'},
                {'slug': 'grain-combines', 'name_ru': 'Зерноуборочные комбайны', 'name_uz': 'Don kombaynlari', 'name_en': 'Grain Combines'},
            ]
        },
        {
            'slug': 'tillage',
            'name_ru': 'Почвообработка',
            'name_uz': 'Tuproq ishlash',
            'name_en': 'Tillage Equipment',
            'icon': 'shovel',
            'order': 3,
            'children': [
                {'slug': 'plows', 'name_ru': 'Плуги', 'name_uz': 'Pluglar', 'name_en': 'Plows'},
                {'slug': 'cultivators', 'name_ru': 'Культиваторы', 'name_uz': 'Kultivatorlar', 'name_en': 'Cultivators'},
                {'slug': 'harrows', 'name_ru': 'Бороны', 'name_uz': 'Boronalar', 'name_en': 'Harrows'},
            ]
        },
        {
            'slug': 'seeders',
            'name_ru': 'Посевная техника',
            'name_uz': 'Ekish texnikasi',
            'name_en': 'Seeding Equipment',
            'icon': 'sprout',
            'order': 4,
        },
        {
            'slug': 'irrigation',
            'name_ru': 'Ирригация',
            'name_uz': 'Sug\'orish',
            'name_en': 'Irrigation',
            'icon': 'droplets',
            'order': 5,
        },
        {
            'slug': 'spare-parts',
            'name_ru': 'Запасные части',
            'name_uz': 'Ehtiyot qismlar',
            'name_en': 'Spare Parts',
            'icon': 'wrench',
            'order': 6,
        },
    ]
    
    count = 0
    for cat_data in categories:
        children = cat_data.pop('children', [])
        parent, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        count += 1
        
        for child_data in children:
            child_data['parent'] = parent
            child_data['order'] = 0
            Category.objects.get_or_create(
                slug=child_data['slug'],
                defaults=child_data
            )
            count += 1
    
    print(f"   ✓ Создано {count} категорий")


def seed_brands():
    """Seed manufacturer brands."""
    print("🏭 Создание брендов...")
    
    brands = [
        {
            'slug': 'yto',
            'name': 'YTO',
            'country': 'Китай',
            'description_ru': 'Ведущий китайский производитель сельскохозяйственной техники. Основан в 1955 году.',
            'is_verified': True,
            'is_featured': True,
        },
        {
            'slug': 'rostselmash',
            'name': 'Ростсельмаш',
            'country': 'Россия',
            'description_ru': 'Крупнейший российский производитель зерноуборочных комбайнов. Основан в 1929 году.',
            'is_verified': True,
            'is_featured': True,
        },
        {
            'slug': 'kuhn',
            'name': 'KUHN',
            'country': 'Франция',
            'description_ru': 'Мировой лидер в производстве почвообрабатывающей и кормозаготовительной техники.',
            'is_verified': True,
            'is_featured': True,
        },
        {
            'slug': 'lemken',
            'name': 'LEMKEN',
            'country': 'Германия',
            'description_ru': 'Немецкий производитель высококачественных плугов и борон с 1780 года.',
            'is_verified': True,
            'is_featured': False,
        },
        {
            'slug': 'foton',
            'name': 'Foton Lovol',
            'country': 'Китай',
            'description_ru': 'Один из крупнейших китайских производителей тракторов и комбайнов.',
            'is_verified': True,
            'is_featured': True,
        },
        {
            'slug': 'claas',
            'name': 'CLAAS',
            'country': 'Германия',
            'description_ru': 'Немецкий производитель премиальной сельскохозяйственной техники.',
            'is_verified': True,
            'is_featured': False,
        },
    ]
    
    for brand_data in brands:
        Brand.objects.get_or_create(
            slug=brand_data['slug'],
            defaults=brand_data
        )
    
    print(f"   ✓ Создано {len(brands)} брендов")


def seed_products():
    """Seed sample products."""
    print("🚜 Создание товаров...")
    
    # Get references
    tractors = Category.objects.get(slug='tractors')
    wheeled = Category.objects.get(slug='wheeled-tractors')
    combines = Category.objects.get(slug='grain-combines')
    plows = Category.objects.get(slug='plows')
    
    yto = Brand.objects.get(slug='yto')
    rostselmash = Brand.objects.get(slug='rostselmash')
    kuhn = Brand.objects.get(slug='kuhn')
    foton = Brand.objects.get(slug='foton')
    
    products = [
        # YTO Tractors
        {
            'sku': 'YTO-X1204',
            'slug': 'yto-x1204-tractor',
            'product_type': 'machinery',
            'name_ru': 'Трактор YTO X1204',
            'name_en': 'YTO X1204 Tractor',
            'short_description_ru': 'Мощный универсальный трактор 120 л.с. для средних и крупных хозяйств',
            'full_description_ru': '''
Трактор YTO X1204 — это надёжный и экономичный трактор мощностью 120 лошадиных сил. 
Оснащён 4-цилиндровым дизельным двигателем YTO собственного производства.

Особенности:
• Полный привод 4WD
• Синхронизированная коробка передач 12F+4R
• Гидравлическая система с выносными цилиндрами
• Комфортная кабина с кондиционером (опция)

Идеально подходит для пахоты, культивации, посева и уборки урожая.
            ''',
            'category': wheeled,
            'brand': yto,
            'base_price_usd': Decimal('42000.00'),
            'retail_price_usd': Decimal('45000.00'),
            'wholesale_price_usd': Decimal('40000.00'),
            'show_price_to_guests': True,
            'stock_status': 'in_stock',
            'stock_quantity': 5,
            'warehouse_location': 'Ташкент',
            'weight_kg': Decimal('4500.00'),
            'ships_from': 'Ташкент',
            'estimated_delivery_days': 3,
            'specifications': {
                'horsepower': {'value': 120, 'unit': 'л.с.'},
                'engine_type': {'value': 'Дизель YTO 4-цилиндра'},
                'transmission': {'value': '12F + 4R'},
                'drive_type': {'value': '4WD'},
                'fuel_capacity': {'value': 200, 'unit': 'л'},
                'weight': {'value': 4500, 'unit': 'кг'},
            },
            'is_featured': True,
        },
        {
            'sku': 'YTO-X904',
            'slug': 'yto-x904-tractor',
            'product_type': 'machinery',
            'name_ru': 'Трактор YTO X904',
            'short_description_ru': 'Компактный трактор 90 л.с. для малых и средних хозяйств',
            'category': wheeled,
            'brand': yto,
            'base_price_usd': Decimal('32000.00'),
            'retail_price_usd': Decimal('35000.00'),
            'show_price_to_guests': True,
            'stock_status': 'in_stock',
            'stock_quantity': 8,
            'specifications': {
                'horsepower': {'value': 90, 'unit': 'л.с.'},
                'engine_type': {'value': 'Дизель YTO'},
                'drive_type': {'value': '4WD'},
            },
            'is_featured': True,
        },
        {
            'sku': 'YTO-X1604',
            'slug': 'yto-x1604-tractor',
            'product_type': 'machinery',
            'name_ru': 'Трактор YTO X1604',
            'short_description_ru': 'Мощный трактор 160 л.с. для крупных сельхозпредприятий',
            'category': wheeled,
            'brand': yto,
            'base_price_usd': Decimal('58000.00'),
            'retail_price_usd': Decimal('62000.00'),
            'show_price_to_guests': False,
            'stock_status': 'pre_order',
            'stock_quantity': 0,
            'specifications': {
                'horsepower': {'value': 160, 'unit': 'л.с.'},
                'engine_type': {'value': 'Дизель YTO 6-цилиндра'},
                'drive_type': {'value': '4WD'},
            },
            'is_featured': False,
        },
        # Foton Tractors
        {
            'sku': 'FOTON-TD904',
            'slug': 'foton-td904-tractor',
            'product_type': 'machinery',
            'name_ru': 'Трактор Foton Lovol TD904',
            'short_description_ru': 'Надёжный трактор 90 л.с. по доступной цене',
            'category': wheeled,
            'brand': foton,
            'base_price_usd': Decimal('28000.00'),
            'retail_price_usd': Decimal('31000.00'),
            'show_price_to_guests': True,
            'stock_status': 'in_stock',
            'stock_quantity': 12,
            'specifications': {
                'horsepower': {'value': 90, 'unit': 'л.с.'},
                'engine_type': {'value': 'Дизель Perkins'},
                'drive_type': {'value': '4WD'},
            },
            'is_featured': True,
        },
        # Rostselmash Combines
        {
            'sku': 'RSM-161',
            'slug': 'rostselmash-161-combine',
            'product_type': 'machinery',
            'name_ru': 'Зерноуборочный комбайн РСМ 161',
            'short_description_ru': 'Современный российский комбайн с жаткой 9 метров',
            'full_description_ru': '''
Комбайн РСМ 161 — это современная зерноуборочная техника российского производства.
Отличается высокой производительностью и надёжностью.

Основные характеристики:
• Мощность двигателя: 380 л.с.
• Ширина жатки: до 9 метров
• Объём бункера: 9000 литров
• Пропускная способность: до 14 кг/с
            ''',
            'category': combines,
            'brand': rostselmash,
            'base_price_usd': Decimal('180000.00'),
            'show_price_to_guests': False,
            'stock_status': 'pre_order',
            'stock_quantity': 0,
            'specifications': {
                'horsepower': {'value': 380, 'unit': 'л.с.'},
                'working_width': {'value': 9, 'unit': 'м'},
                'grain_tank': {'value': 9000, 'unit': 'л'},
            },
            'is_featured': True,
        },
        # KUHN Tillage
        {
            'sku': 'KUHN-MM153',
            'slug': 'kuhn-mm153-plow',
            'product_type': 'attachment',
            'name_ru': 'Плуг оборотный KUHN Multi-Master 153',
            'short_description_ru': '5-корпусный оборотный плуг для качественной вспашки',
            'category': plows,
            'brand': kuhn,
            'base_price_usd': Decimal('18000.00'),
            'retail_price_usd': Decimal('20000.00'),
            'show_price_to_guests': True,
            'stock_status': 'in_stock',
            'stock_quantity': 3,
            'specifications': {
                'working_width': {'value': 2.25, 'unit': 'м'},
                'bodies': {'value': 5},
                'working_depth': {'value': 30, 'unit': 'см'},
            },
            'is_featured': False,
        },
    ]
    
    for product_data in products:
        Product.objects.get_or_create(
            sku=product_data['sku'],
            defaults=product_data
        )
    
    print(f"   ✓ Создано {len(products)} товаров")


def main():
    print("\n" + "=" * 50)
    print("🌾 UzAgro Platform - Загрузка начальных данных")
    print("=" * 50 + "\n")
    
    seed_regions()
    seed_categories()
    seed_brands()
    seed_products()
    
    print("\n" + "=" * 50)
    print("✅ Загрузка данных завершена!")
    print("=" * 50 + "\n")


if __name__ == '__main__':
    main()
