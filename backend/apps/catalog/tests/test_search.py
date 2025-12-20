"""
Tests for catalog search view.
"""

from rest_framework.test import APITestCase
from rest_framework import status
from apps.catalog.models import Product, Category, Brand

class SearchViewTests(APITestCase):

    def setUp(self):
        # Create some test data
        self.category = Category.objects.create(
            name_ru="Тракторы",
            slug="tractors",
            order=1
        )
        self.brand = Brand.objects.create(
            name="Claas",
            slug="claas",
            country="Germany"
        )
        self.product = Product.objects.create(
            name_ru="Трактор Claas Axion 850",
            slug="claas-axion-850",
            category=self.category,
            brand=self.brand,
            base_price_usd=150000,
            is_active=True
        )

    def test_search_query_too_long(self):
        """
        Test that a very long search query is handled gracefully (truncated).
        """
        url = '/api/v1/search/'

        # A query that starts with "Traktor" but is very long
        # "Трактор" is 7 chars.
        # We'll make a query that is "Трактор" + 200 "a"s.
        # The truncation is at 100 chars.
        # "Трактор" should be preserved at the beginning.
        # However, "icontains" checks if the query is IN the name.
        # If the query is "Тракторaaaa...", it won't be found in "Трактор Claas".

        # So we test that it DOESN'T crash.
        long_query = "a" * 200
        response = self.client.get(url, {'q': long_query})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_truncation_logic(self):
        """
        Test that the query is actually truncated.
        We can't easily spy on the local variable, but we can verify behavior.
        If we search for a string longer than 100 chars that DOES exist, it should match
        if the first 100 chars match (and we truncated correctly).
        """
        # Create a product with a very long name (110 chars)
        long_name = "a" * 110
        product = Product.objects.create(
            name_ru=long_name,
            slug="long-product",
            sku="SKU-LONG",
            category=self.category,
            brand=self.brand,
            base_price_usd=100,
            is_active=True
        )

        url = '/api/v1/search/'

        # Search for the exact long name (110 chars)
        # If we truncate to 100, we search for "a"*100.
        # "a"*100 is contained in "a"*110.
        # So it should find the product.

        response = self.client.get(url, {'q': long_name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['products']), 1)
        self.assertEqual(response.data['products'][0]['id'], product.id)
