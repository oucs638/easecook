"""Shopping application configuration."""

from django.apps import AppConfig


class ShoppingConfig(AppConfig):
    """Configuration for the shopping application."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.shopping"
