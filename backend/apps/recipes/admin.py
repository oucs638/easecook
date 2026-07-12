"""Django admin configuration for recipe models."""

from django.contrib import admin

from apps.recipes.models import Ingredient, Recipe, RecipeIngredient, RecipeStep


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    """Admin configuration for  ingredients."""

    list_display = ("name", "category", "default_unit", "updated_at")
    list_filter = ("category",)
    search_fields = ("name",)
    ordering = ("name",)


class RecipeIngredientInline(admin.TabularInline):
    """Inline admin for ingredients used in a recipe."""

    model = RecipeIngredient
    extra = 1
    autocomplete_fields = ("ingredient",)


class RecipeStepInLine(admin.TabularInline):
    """Inline admin for recipe cooking steps."""

    model = RecipeStep
    extra = 1


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    """Admin configuration for  recipes."""

    list_display = (
        "title",
        "owner",
        "difficulty",
        "servings",
        "total_minutes",
        "is_public",
        "updated_at",
    )
    list_filter = ("difficulty", "is_public", "created_at", "updated_at")
    search_fields = ("title", "description", "owner__username", "owner__email")
    raw_id_fields = ("owner",)
    readonly_fields = ("total_minutes", "created_at", "updated_at")
    inlines = (RecipeIngredientInline, RecipeStepInLine)


@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    """Admin configuration for recipe ingredients."""

    list_display = ("recipe", "ingredient", "quantity", "unit", "order")
    search_fields = ("recipe__title", "ingredient__name", "note")
    autocomplete_fields = ("recipe", "ingredient")


@admin.register(RecipeStep)
class RecipeStepAdmin(admin.ModelAdmin):
    """Admin configuration for recipe steps."""

    list_display = ("recipe", "order", "instruction")
    search_fields = ("recipe__title", "instruction", "tip")
    autocomplete_fields = ("recipe",)
