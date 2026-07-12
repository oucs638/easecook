"""Tests for account models."""

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.models import UserProfile


class UserProfileModelTest(TestCase):
    """Tests for the UserProfile model."""

    def test_profile_string_uses_display_name_when_available(self) -> None:
        """Profile string should prefer the custom display name."""
        user = get_user_model().objects.create_user(
            username="demo_user", email="demo@example.com", password="test-pass"
        )
        profile = UserProfile.objects.create(user=user, display_name="Demo User")

        self.assertEqual(str(profile), "Demo User")

    def test_profile_string_falls_back_to_username(self) -> None:
        """Profile string should user username when display name is blank."""
        user = get_user_model().objects.create_user(
            username="fallback_user", email="fallback@example.com", password="test-pass"
        )
        profile = UserProfile.objects.create(user=user)

        self.assertEqual(str(profile), "fallback_user")


class UserProfileAdminTest(TestCase):
    """Tests for user profile admin registration."""

    def test_user_profile_is_registered_in_admin(self) -> None:
        """UserProfile should be available in Django admin."""
        self.assertTrue(admin.site.is_registered(UserProfile))
