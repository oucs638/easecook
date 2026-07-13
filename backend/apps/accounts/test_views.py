"""Tests for account API views."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.accounts.models import UserProfile


class UserProfileApiTests(TestCase):
    """Tests for user profile APIs."""

    def test_profile_list_only_returns_current_user_profile(self) -> None:
        """Profile list should only include the authenticated user's profile."""
        user = get_user_model().objects.create_user(
            username="profile_api_owner", password="test-pass"
        )
        other_user = get_user_model().objects.create_user(
            username="other_profile_owner", password="test-pass"
        )
        UserProfile.objects.create(user=user, display_name="Current User")
        UserProfile.objects.create(user=other_user, display_name="Other User")

        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/profiles/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["display_name"], "Current User")
