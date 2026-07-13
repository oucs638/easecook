"""Tests for meal planning API views."""

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.recipes.models import Ingredient, Recipe, RecipeIngredient
from apps.shopping.models import ShoppingList, ShoppingListItem


class MealPlanApiTests(TestCase):
    """Tests for meal planning APIs."""

    def test_create_meal_plan_assigns_current_user_as_owner(self) -> None:
        """Meal plan creation should use the authenticated user as owner."""
        user = get_user_model().objects.create_user(
            username="meal_api_owner", password="test-pass"
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/meal-plans/",
            {
                "name": "API Weekly Plan",
                "start_date": "2026-07-13",
                "end_date": "2026-07-19",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        meal_plan = MealPlan.objects.get(name="API Weekly Plan")
        self.assertEqual(meal_plan.owner, user)
        self.assertEqual(response.data["owner_username"], "meal_api_owner")

    def test_meal_plan_list_only_returns_current_user_plans(self) -> None:
        """Meal plan list should only include current user data."""
        user = get_user_model().objects.create_user(
            username="meal_list_owner", password="test-pass"
        )
        other_user = get_user_model().objects.create_user(
            username="other_meal_owner", password="test-pass"
        )
        MealPlan.objects.create(
            owner=user,
            name="Current User Plan",
            start_date="2026-07-13",
            end_date="2026-07-19",
        )
        MealPlan.objects.create(
            owner=other_user,
            name="Other User Plan",
            start_date="2026-07-13",
            end_date="2026-07-19",
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.get("/api/meal-plans/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Current User Plan")

    def test_generate_shopping_list_action_creates_shopping_list(self) -> None:
        """Meal plan action should generate a shopping list."""
        user = get_user_model().objects.create_user(
            username="meal_plan_generator",
            password="test-pass",
        )
        ingredient = Ingredient.objects.create(name="Action Tomato", default_unit="g")
        recipe = Recipe.objects.create(owner=user, title="Action Soup")
        RecipeIngredient.objects.create(
            recipe=recipe,
            ingredient=ingredient,
            quantity=Decimal("100.00"),
            unit="g",
        )
        meal_plan = MealPlan.objects.create(
            owner=user,
            name="Action Weekly Plan",
            start_date=date(2026, 7, 13),
            end_date=date(2026, 7, 19),
        )
        MealPlanItem.objects.create(
            meal_plan=meal_plan,
            recipe=recipe,
            planned_date=date(2026, 7, 13),
            meal_type=MealPlanItem.MealType.DINNER,
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            f"/api/meal-plans/{meal_plan.id}/generate-shopping-list/",
            {"name": "Action Shopping List"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "Action Shopping List")

        shopping_list = ShoppingList.objects.get(name="Action Shopping List")
        self.assertEqual(shopping_list.owner, user)
        self.assertEqual(
            ShoppingListItem.objects.filter(shopping_list=shopping_list).count(), 1
        )
