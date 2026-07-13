"""Tests for shopping serializers."""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.recipes.models import Ingredient
from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem
from apps.shopping.serializers import PantryItemSerializer, ShoppingListSerializer


class ShoppingSerializerTests(TestCase):
    """Tests for shopping serializers."""

    def test_pantry_item_serializer_returns_ingredient_name(self) -> None:
        """Serializer should return pantry item details."""
        user = get_user_model().objects.create_user(
            username="pantry_serializer_owner", password="test-pass"
        )
        ingredient = Ingredient.objects.create(name="Milk", default_unit="ml")
        pantry_item = PantryItem.objects.create(
            owner=user, ingredient=ingredient, quantity=Decimal("500.00"), unit="ml"
        )

        data = PantryItemSerializer(pantry_item).data

        self.assertEqual(data["ingredient_name"], "Milk")
        self.assertEqual(data["unit"], "ml")

    def test_shopping_list_serializer_returns_nested_items(self) -> None:
        """Serializer should return shopping list items."""
        user = get_user_model().objects.create_user(
            username="shopping_serializer_owner", password="test-pass"
        )
        ingredient = Ingredient.objects.create(name="Rice", default_unit="g")
        shopping_list = ShoppingList.objects.create(owner=user, name="Weekend Shopping")
        ShoppingListItem.objects.create(
            shopping_list=shopping_list,
            ingredient=ingredient,
            quantity=Decimal("1000.00"),
            unit="g",
        )

        data = ShoppingListSerializer(shopping_list).data

        self.assertEqual(data["name"], "Weekend Shopping")
        self.assertEqual(data["owner_username"], "shopping_serializer_owner")
        self.assertEqual(data["items"][0]["ingredient_name"], "Rice")
