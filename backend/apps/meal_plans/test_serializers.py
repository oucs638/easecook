"""Tests for meal planning serializers."""

from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.meal_plans.serializers import MealPlanSerializer
from apps.recipes.models import Recipe


class MealPlanSerializerTests(TestCase):
    """Tests for the meal plan serializer."""

    def test_meal_plan_serializer_returns_nested_items(self) -> None:
        """Serializer should return planned meals."""
        user = get_user_model().objects.create_user(
            username="meal_serializer_owner", password="test-pass"
        )
        recipe = Recipe.objects.create(owner=user, title="Sample Rice Bowl")
        meal_plan = MealPlan.objects.create(
            owner=user,
            name="Weekly Plan",
            start_date=date(2026, 7, 13),
            end_date=date(2026, 7, 19),
        )
        MealPlanItem.objects.create(
            meal_plan=meal_plan,
            recipe=recipe,
            planned_date=date(2026, 7, 13),
            meal_type=MealPlanItem.MealType.DINNER,
        )

        data = MealPlanSerializer(meal_plan).data

        self.assertEqual(data["name"], "Weekly Plan")
        self.assertEqual(data["owner_username"], "meal_serializer_owner")
        self.assertEqual(data["items"][0]["recipe_title"], "Sample Rice Bowl")
