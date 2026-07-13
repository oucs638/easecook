"""Serializers for accounts models."""

from rest_framework import serializers

from apps.accounts.models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializers user profile preferences."""

    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        """Serializer metadata."""

        model = UserProfile
        fields = (
            "id",
            "user",
            "username",
            "email",
            "display_name",
            "cooking_skill_level",
            "dietary_preferences",
            "allergies",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user", "created_at", "updated_at")
