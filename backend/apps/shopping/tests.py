"""Tests for shopping and pantry models."""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.recipes.models import Ingredient
from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem


class ShoppingModelTests(TestCase):
    """Tests for shopping and pantry models."""

    def test_pantry_item_string_is_readable(self) -> None:
        """Pantry item string should be readable."""
        user = get_user_model().objects.create_user(
            username="shopping_owner", password="test-pass", )
        ingredient = Ingredient.objects.create(name="Milk", default_unit="ml")
        pantry_item = PantryItem.objects.create(
            owner=user, ingredient=ingredient, quantity=Decimal("500.00"),
            unit="ml", )

        self.assertEqual(str(pantry_item), "Milk 500.00 ml")

    def test_shopping_list_item_string_is_readable(self) -> None:
        """Shopping item string should be readable."""
        user = get_user_model().objects.create_user(
            username="shopping_editor", password="test-pass", )
        ingredient = Ingredient.objects.create(name="Rice", default_unit="g")
        shopping_list = ShoppingList.objects.create(
            owner=user, name="Weekend Shopping", )
        shopping_item = ShoppingListItem.objects.create(
            shopping_list=shopping_list, ingredient=ingredient,
            quantity=Decimal("1000.00"), unit="g", )

        self.assertEqual(str(shopping_item), "Rice 1000.00 g")
