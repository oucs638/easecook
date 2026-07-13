"""Serializers for meal planning models."""

from rest_framework import serializers

from apps.meal_plans.models import MealPlan, MealPlanItem


class MealPlanItemSerializer(serializers.ModelSerializer):
    """Serializes one planned meal."""

    recipe_title = serializers.CharField(source="recipe.title", read_only=True)

    class Meta:
        """Serializer metadata."""

        model = MealPlanItem
        fields = (
            "id",
            "meal_plan",
            "recipe",
            "recipe_title",
            "planned_date",
            "meal_type",
            "servings",
            "note",
        )
        read_only_fields = ("id", "recipe_title")


class MealPlanSerializer(serializers.ModelSerializer):
    """Serializes a meal plan with planned meals."""

    owner_username = serializers.CharField(source="owner.username", read_only=True)
    items = MealPlanItemSerializer(many=True, read_only=True)

    class Meta:
        """Serializer metadata."""

        model = MealPlan
        fields = (
            "id",
            "owner",
            "owner_username",
            "name",
            "start_date",
            "end_date",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")
