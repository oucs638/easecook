"""Tests for shopping services."""

from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.recipes.models import Ingredient, Recipe, RecipeIngredient
from apps.shopping.models import PantryItem, ShoppingListItem
from apps.shopping.services import generate_shopping_list_from_meal_plan


class ShoppingListGenerationServiceTests(TestCase):
    """Tests for shopping list generation."""

    def test_generate_shopping_list_subtracts_existing_pantry_items(self) -> None:
        """Generated shopping list should only include missing quantities."""
        user = get_user_model().objects.create_user(
            username="shopping_service_owner", password="test-pass"
        )
        tomato = Ingredient.objects.create(name="Tomato", default_unit="g")
        salt = Ingredient.objects.create(name="Salt", default_unit="g")
        recipe = Recipe.objects.create(owner=user, title="Tomato Soup")
        RecipeIngredient.objects.create(
            recipe=recipe, ingredient=tomato, quantity=Decimal("100.00"), unit="g"
        )
        RecipeIngredient.objects.create(
            recipe=recipe, ingredient=salt, quantity=Decimal("5.00"), unit="g"
        )
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
            servings=2,
        )
        PantryItem.objects.create(
            owner=user, ingredient=tomato, quantity=Decimal("50.00"), unit="g"
        )
        PantryItem.objects.create(
            owner=user, ingredient=salt, quantity=Decimal("10.00"), unit="g"
        )

        shopping_list = generate_shopping_list_from_meal_plan(
            meal_plan=meal_plan, name="Generated Shopping"
        )

        self.assertEqual(shopping_list.name, "Generated Shopping")
        shopping_items = ShoppingListItem.objects.filter(shopping_list=shopping_list)
        self.assertEqual(shopping_items.count(), 1)

        shopping_item = shopping_items.get(ingredient=tomato)
        self.assertEqual(shopping_item.quantity, Decimal("150.00"))
        self.assertEqual(shopping_item.unit, "g")
