"""Tests for recipe models."""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.recipes.models import Ingredient, Recipe, RecipeIngredient


class RecipeModelTest(TestCase):
    """Tests for recipe-related models."""

    def test_recipe_total_minutes_returns_prep_plus_cook_time(self) -> None:
        """Total minutes should include prep and cooking time."""
        user = get_user_model().objects.create_user(
            username="recipe_owner", password="test-pass"
        )
        recipe = Recipe.objects.create(
            owner=user,
            title="Sample Pasta",
            servings=2,
            prep_minutes=10,
            cook_minutes=15,
        )

        self.assertEqual(recipe.total_minutes, 25)

    def test_recipe_ingredient_string_is_readable(self) -> None:
        """RecipeIngredient string should show quantity, unit, and name."""
        user = get_user_model().objects.create_user(
            username="recipe_editor", password="test-pass"
        )
        recipe = Recipe.objects.create(owner=user, title="Sample Omelette")
        ingredient = Ingredient.objects.create(
            name="Egg", category=Ingredient.Category.PROTEIN, default_unit="piece"
        )
        recipe_ingredient = RecipeIngredient.objects.create(
            recipe=recipe, ingredient=ingredient, quantity=Decimal("2.00"), unit="piece"
        )

        self.assertEqual(str(recipe_ingredient), "2.00 piece Egg")
