from rest_framework.test import APITestCase
from rest_framework import status
from django.core.cache import cache

class SearchSecurityTest(APITestCase):
    def setUp(self):
        self.url = '/api/v1/search/'
        # Clear cache to reset throttle counters
        cache.clear()

    def test_search_rate_limiting(self):
        """
        Security Test: Verify that excessive search requests are throttled.
        Limit is 20/minute.
        """
        # Make 20 allowed requests
        for _ in range(20):
            response = self.client.get(self.url, {'q': 'test'})
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        # The 21st request should be throttled
        response = self.client.get(self.url, {'q': 'test'})
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
