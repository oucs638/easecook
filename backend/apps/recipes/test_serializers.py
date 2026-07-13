"""Tests for recipe serializers."""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.recipes.models import Ingredient, Recipe, RecipeIngredient, RecipeStep
from apps.recipes.serializers import RecipeSerializer


class RecipeSerializerTests(TestCase):
    """Tests for the recipe serializer."""

    def test_recipe_serializer_returns_nested_recipe_data(self) -> None:
        """Serializer should return recipe details."""
        user = get_user_model().objects.create_user(
            username="recipe_serializer_owner", password="test-pass"
        )
        ingredient = Ingredient.objects.create(name="Tomato", default_unit="g")
        recipe = Recipe.objects.create(
            owner=user, title="Sample Soup", prep_minutes=5, cook_minutes=15
        )
        RecipeIngredient.objects.create(
            recipe=recipe, ingredient=ingredient, quantity=Decimal("100.00"), unit="g"
        )
        RecipeStep.objects.create(
            recipe=recipe, order=1, instruction="Cook the tomato."
        )

        data = RecipeSerializer(recipe).data

        self.assertEqual(data["title"], "Sample Soup")
        self.assertEqual(data["owner_username"], "recipe_serializer_owner")
        self.assertEqual(data["total_minutes"], 20)
        self.assertEqual(data["recipe_ingredients"][0]["ingredient_name"], "Tomato")
        self.assertEqual(data["steps"][0]["instruction"], "Cook the tomato.")
