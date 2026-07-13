"""Tests for account serializers."""

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.accounts.models import UserProfile
from apps.accounts.serializers import UserProfileSerializer


class UserProfileSerializerTests(TestCase):
    """Tests for the user profile serializer."""

    def test_user_profile_serializer_returns_profile_data(self) -> None:
        """Serializer should return profile preferences."""
        user = get_user_model().objects.create_user(
            username="profile_owner", email="profile@example.com", password="test-pass"
        )
        profile = UserProfile.objects.create(
            user=user,
            display_name="Demo Profile",
            dietary_preferences=["vegetarian"],
            allergies=["peanut"],
        )

        data = UserProfileSerializer(profile).data

        self.assertEqual(data["username"], "profile_owner")
        self.assertEqual(data["display_name"], "Demo Profile")
        self.assertEqual(data["dietary_preferences"], ["vegetarian"])
        self.assertEqual(data["allergies"], ["peanut"])
