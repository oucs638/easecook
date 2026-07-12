"""Django admin configuration for account models."""

from django.contrib import admin

from apps.accounts.models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin configuration for user profiles."""

    list_display = ("user", "display_name", "cooking_skill_level", "updated_at")
    list_filter = ("cooking_skill_level", "created_at", "updated_at")
    search_fields = ("user__username", "user__email", "display_name")
    ordering = ("user__username",)
