"""Meal plans application configuration."""

from django.apps import AppConfig


class MealPlanConfig(AppConfig):
    """Configuration for the meal plans application."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.meal_plans"
