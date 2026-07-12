"""Recipes application configuration."""

from django.apps import AppConfig


class RecipesConfig(AppConfig):
    """Configuration for the recipes application."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.recipes"
