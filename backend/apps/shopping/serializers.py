"""Serializers for shopping and pantry models."""

from rest_framework import serializers

from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem


class PantryItemSerializer(serializers.ModelSerializer):
    """Serializes pantry items owned by a user."""

    ingredient_name = serializers.CharField(source="ingredient.name", read_only=True)

    class Meta:
        """Serializer metadata."""

        model = PantryItem
        fields = (
            "id",
            "owner",
            "ingredient",
            "ingredient_name",
            "quantity",
            "unit",
            "expiration_date",
            "note",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class ShoppingListItemSerializer(serializers.ModelSerializer):
    """Serializes one shopping list item."""

    ingredient_name = serializers.CharField(source="ingredient.name", read_only=True)

    class Meta:
        """Serializer metadata."""

        model = ShoppingListItem
        fields = (
            "id",
            "shopping_list",
            "ingredient",
            "ingredient_name",
            "quantity",
            "unit",
            "is_checked",
            "note",
            "source_meal_plan_item",
        )
        read_only_fields = ("id", "ingredient_name")


class ShoppingListSerializer(serializers.ModelSerializer):
    """Serializes a shopping list with its items."""

    owner_username = serializers.CharField(source="owner.username", read_only=True)
    items = ShoppingListItemSerializer(many=True, read_only=True)

    class Meta:
        """Serializer metadata."""

        model = ShoppingList
        fields = (
            "id",
            "owner",
            "owner_username",
            "name",
            "status",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")
