"""Serializers for accounts models."""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from apps.accounts.models import UserProfile


class UserRegistrationSerializer(serializers.Serializer):
    """Serializes user registration requests."""

    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(
        max_length=150,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="This username is already used."
            )
        ],
    )
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(
        write_only=True, min_length=8, validators=[validate_password]
    )
    display_name = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    def create(self, validated_data: dict) -> User:
        """Create a user and its profile."""
        display_name = validated_data.pop("display_name", "")
        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user, display_name=display_name)
        return user


class CurrentUserSerializer(serializers.ModelSerializer):
    """Serializes the currently authenticated user."""

    class Meta:
        """Serializer metadata."""

        model = User
        fields = ("id", "username", "email")


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
