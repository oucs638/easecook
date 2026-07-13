"""Tests for authentication API views."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import UserProfile


class AuthApiTests(TestCase):
    """Tests for authentication APIs."""

    def test_register_creates_user_and_profile(self) -> None:
        """Registration should create a user and profile."""
        client = APIClient()

        response = client.post(
            "/api/auth/register/",
            {
                "username": "new_api_user",
                "email": "new-api-user@example.com",
                "password": "Strong-test-pass-123",
                "display_name": "New API User",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)

        user = get_user_model().objects.get(username="new_api_user")
        self.assertEqual(user.email, "new-api-user@example.com")
        self.assertTrue(
            UserProfile.objects.filter(user=user, display_name="New API User").exists()
        )

    def test_token_endpoint_returns_access_and_refresh_tokens(self) -> None:
        """Token endpoint should return JWT tokens."""
        get_user_model().objects.create_user(
            username="token_user", password="Strong-test-pass-123"
        )
        client = APIClient()

        response = client.post(
            "/api/auth/token/",
            {"username": "token_user", "password": "Strong-test-pass-123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_current_user_endpoint_returns_authenticated_user(self) -> None:
        """Current user endpoint should return the authenticated user."""
        user = get_user_model().objects.create_user(
            username="current_user",
            email="current@example.com",
            password="Strong-test-pass-123",
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "current_user")
        self.assertEqual(response.data["email"], "current@example.com")

    def test_current_user_endpoint_requires_authentication(self) -> None:
        """Current user endpoint should reject anonymous requests."""
        client = APIClient()

        response = client.get("/api/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
