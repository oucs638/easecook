"""Account-related database models."""

from django.db import models


class UserProfile(models.Model):
    """Stores meal planning preferences for one user."""

    class CookingSkillLevel(models.TextChoices):
        """Supported cooking skill levels."""

        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    user = models.OneToOneField(
        "auth.User", on_delete=models.CASCADE, related_name="profile"
    )
    display_name = models.CharField(max_length=120, blank=True)
    cooking_skill_level = models.CharField(
        max_length=20, choices=CookingSkillLevel, default=CookingSkillLevel.BEGINNER
    )
    dietary_preferences = models.JSONField(default=list, blank=True)
    allergies = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        """Return a readable profile label."""
        return self.display_name or self.user.get_username()
