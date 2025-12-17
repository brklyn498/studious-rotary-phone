import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.catalog.models import Category, Brand, Product

class Command(BaseCommand):
    help = 'Populates the database with mock data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Populating database...')

        # 1. Create Categories
        categories_data = [
            {'name_ru': 'Тракторы', 'slug': 'tractors'},
            {'name_ru': 'Комбайны', 'slug': 'harvesters'},
            {'name_ru': 'Почвообработка', 'slug': 'tillage'},
            {'name_ru': 'Запчасти', 'slug': 'spare-parts'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={
                    'name_ru': cat_data['name_ru'],
                    'name_uz': cat_data['name_ru'] + ' (UZ)', 
                    'name_en': cat_data['name_ru'] + ' (EN)',
                }
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'Created category: {category}')

        # 2. Create Brands
        brands_data = [
            {'name': 'YTO', 'slug': 'yto', 'country': 'Китай'},
            {'name': 'Rostselmash', 'slug': 'rostselmash', 'country': 'Россия'},
            {'name': 'KUHN', 'slug': 'kuhn', 'country': 'Франция'},
            {'name': 'Lemken', 'slug': 'lemken', 'country': 'Германия'},
        ]

        brands = {}
        for brand_data in brands_data:
            brand, created = Brand.objects.get_or_create(
                slug=brand_data['slug'],
                defaults={
                    'name': brand_data['name'],
                    'country': brand_data['country'],
                    'is_verified': True,
                    'is_featured': True
                }
            )
            brands[brand_data['slug']] = brand
            if created:
                self.stdout.write(f'Created brand: {brand}')

        # 3. Create Products
        # Helper to create products
        def create_products(category_slug, product_type, brand_slug, prefix, count=5):
            category = categories[category_slug]
            brand = brands[brand_slug]
            
            for i in range(1, count + 1):
                name = f'{prefix} {i * 100}'
                sku = f'{brand_slug.upper()}-{prefix}-{i}'
                slug = slugify(f'{brand.name}-{name}')
                
                # Check uniqueness of slug
                if Product.objects.filter(slug=slug).exists():
                    continue

                Product.objects.get_or_create(
                    sku=sku,
                    defaults={
                        'slug': slug,
                        'name_ru': f'{brand.name} {name}',
                        'category': category,
                        'brand': brand,
                        'product_type': product_type,
                        'base_price_usd': random.randint(100, 50000),
                        'stock_status': 'in_stock',
                        'show_price_to_guests': True,
                        'short_description_ru': f'Mock description for {name}',
                    }
                )
                self.stdout.write(f'Created product: {name}')

        # Tractors (Machinery)
        create_products('tractors', 'machinery', 'yto', 'Tractor X')
        
        # Harvesters (Machinery)
        create_products('harvesters', 'machinery', 'rostselmash', 'Harvester RSM')

        # Spare Parts (Spare Part) - IMPORTANT for Cart testing
        create_products('spare-parts', 'spare_part', 'kuhn', 'Bearing Set')
        create_products('spare-parts', 'spare_part', 'lemken', 'Hydraulic Pump')

        self.stdout.write(self.style.SUCCESS('Successfully populated database'))
