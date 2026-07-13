"""Tests for the demo data seed command."""

from io import StringIO

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase

from apps.meal_plans.models import MealPlan
from apps.recipes.models import Recipe
from apps.shopping.models import PantryItem, ShoppingList


class SeedDemoDataCommandTests(TestCase):
    """Tests for the seed_demo_data management command."""

    def test_seed_demo_data_creates_complete_demo_workflow(self) -> None:
        """Command should create demo user data across the core workflow."""
        call_command("seed_demo_data", stdout=StringIO())

        user = get_user_model().objects.get(username="demo_user")

        self.assertTrue(user.check_password("DemoPass123!"))
        self.assertTrue(Recipe.objects.filter(owner=user).exists())
        self.assertTrue(MealPlan.objects.filter(owner=user).exists())
        self.assertTrue(PantryItem.objects.filter(owner=user).exists())
        self.assertTrue(
            ShoppingList.objects.filter(
                owner=user,
                name="Demo Shopping List",
                items__isnull=False, ).exists(), )

    def test_seed_demo_data_is_repeatable(self) -> None:
        """Command should be safe to run more than once locally."""
        call_command("seed_demo_data", stdout=StringIO())
        call_command("seed_demo_data", stdout=StringIO())

        user = get_user_model().objects.get(username="demo_user")

        self.assertEqual(
            ShoppingList.objects.filter(
                owner=user, name="Demo Shopping List", ).count(), 1, )
