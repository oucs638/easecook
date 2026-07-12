"""Tests for meal planning models."""

from datetime import date

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.recipes.models import Recipe


class MealPlanModelTests(TestCase):
    """Tests for meal planning models."""

    def test_meal_plan_item_string_is_readable(self) -> None:
        """MealPlanItem string should include date, type, and recipe."""
        user = get_user_model().objects.create_user(
            username="meal_owner", password="test-pass"
        )
        recipe = Recipe.objects.create(owner=user, title="Sample Rice Bowl")
        meal_plan = MealPlan.objects.create(
            owner=user,
            name="Weekly Meal Plan",
            start_date=date(2027, 1, 1),
            end_date=date(2027, 1, 8),
        )
        item = MealPlanItem.objects.create(
            meal_plan=meal_plan,
            recipe=recipe,
            planned_date=date(2027, 1, 1),
            meal_type=MealPlanItem.MealType.DINNER,
            servings=2,
        )

        self.assertEqual(str(item), "2027-01-01 dinner: Sample Rice Bowl")


class MealPlanAdminTests(TestCase):
    """Tests for meal planning admin registration."""

    def test_meal_plan_models_are_registered_in_admin(self) -> None:
        """Meal planning models should be available in Django admin."""
        registered_models = (MealPlan, MealPlanItem)

        for model in registered_models:
            with self.subTest(model=model.__name__):
                self.assertTrue(admin.site.is_registered(model))
