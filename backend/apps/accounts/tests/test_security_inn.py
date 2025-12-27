from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.test import override_settings
from apps.accounts.models import BusinessProfile

User = get_user_model()


# We need to disable debug toolbar middleware because overriding DEBUG=True
# enables the middleware logic but the URLs are not loaded in the test environment,
# causing NoReverseMatch: 'djdt' is not a registered namespace.
@override_settings(
    DEBUG=True,
    MIDDLEWARE=[
        'django.middleware.security.SecurityMiddleware',
        'corsheaders.middleware.CorsMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'django.middleware.locale.LocaleMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]
)
class INNVerificationSecurityTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='test@example.com',
            user_type=User.UserType.GUEST
        )
        self.url = '/api/v1/auth/verify-inn/'

    def test_random_inn_rejected(self):
        """
        Security Test: Verify that random INNs are rejected.
        """
        self.client.force_authenticate(user=self.user)

        # Use a random INN that is NOT in the hardcoded list
        random_inn = '555555555'

        data = {'inn': random_inn}
        response = self.client.post(self.url, data)

        # Should be rejected now
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'ИНН не найден в системе Soliq.uz')

        # User should NOT be upgraded
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.user_type, User.UserType.BUSINESS)

        # No profile should be created (or at least not verified/linked if we look at db)
        # The view uses update_or_create only if mock_response is not None.
        self.assertFalse(BusinessProfile.objects.filter(user=self.user).exists())

    def test_valid_mock_inn_accepted(self):
        """
        Functional Test: Verify that the specific mock INNs still work.
        """
        self.client.force_authenticate(user=self.user)

        # Use a KNOWN mock INN
        valid_inn = '123456789'

        data = {'inn': valid_inn}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Верификация успешна!')

        # User should be upgraded
        self.user.refresh_from_db()
        self.assertEqual(self.user.user_type, User.UserType.BUSINESS)

        # Profile should exist and be correct
        profile = BusinessProfile.objects.get(user=self.user)
        self.assertEqual(profile.inn, valid_inn)
        self.assertEqual(profile.company_name, 'ООО "АгроТех Ферма"')


class ProductionINNVerificationSecurityTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='hacker',
            password='password123',
            email='hacker@example.com',
            user_type=User.UserType.GUEST
        )
        self.url = '/api/v1/auth/verify-inn/'

    @override_settings(DEBUG=False)
    def test_mock_disabled_in_production(self):
        """
        Security Test:
        Verify that the mock implementation is DISABLED when DEBUG=False.
        This confirms the fix works.
        """
        self.client.force_authenticate(user=self.user)

        # Use a KNOWN mock INN that works in DEBUG=True
        valid_inn = '123456789'

        data = {'inn': valid_inn}
        response = self.client.post(self.url, data)

        # NEW BEHAVIOR: It should fail safely (503 Service Unavailable)
        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(response.data['error'], 'Verification service is temporarily unavailable in production mode.')
