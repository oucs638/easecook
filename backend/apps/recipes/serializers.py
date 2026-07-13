"""Serializers for recipe models."""

from rest_framework import serializers

from apps.recipes.models import Ingredient, Recipe, RecipeIngredient, RecipeStep


class IngredientSerializer(serializers.ModelSerializer):
    """Serializes reusable ingredients."""

    class Meta:
        """Serializer metadata."""

        model = Ingredient
        fields = ("id", "name", "category", "default_unit", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class RecipeIngredientSerializer(serializers.ModelSerializer):
    """Serializes ingredients required by a recipe."""

    ingredient_name = serializers.CharField(source="ingredient.name", read_only=True)

    class Meta:
        """Serializer metadata."""

        model = RecipeIngredient
        fields = (
            "id",
            "recipe",
            "ingredient",
            "ingredient_name",
            "quantity",
            "unit",
            "note",
            "order",
        )
        read_only_fields = ("id", "ingredient_name")


class RecipeStepSerializer(serializers.ModelSerializer):
    """Serializes one recipe instruction step."""

    class Meta:
        """Serializer metadata."""

        model = RecipeStep
        fields = ("id", "recipe", "order", "instruction", "tip")
        read_only_fields = ("id",)


class RecipeSerializer(serializers.ModelSerializer):
    """Serializes recipes with nested read-only details."""

    owner_username = serializers.CharField(source="owner.username", read_only=True)
    recipe_ingredients = RecipeIngredientSerializer(many=True, read_only=True)
    steps = RecipeStepSerializer(many=True, read_only=True)
    total_minutes = serializers.IntegerField(read_only=True)

    class Meta:
        """Serializer metadata."""

        model = Recipe
        fields = (
            "id",
            "owner",
            "owner_username",
            "title",
            "description",
            "servings",
            "prep_minutes",
            "cook_minutes",
            "total_minutes",
            "difficulty",
            "tags",
            "is_public",
            "recipe_ingredients",
            "steps",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "total_minutes", "created_at", "updated_at")
