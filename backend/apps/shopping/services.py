"""Services for shopping list generation."""

from dataclasses import dataclass
from decimal import Decimal

from django.db import transaction
from django.db.models import Sum

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.recipes.models import Ingredient
from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem


@dataclass
class IngredientRequirement:
    """Aggregated ingredient quantity needed for a meal plan."""

    ingredient: Ingredient
    unit: str
    quantity: Decimal
    source_meal_plan_item: MealPlanItem


def _get_available_pantry_quantity(
    meal_plan: MealPlan,
    requirement: IngredientRequirement,
) -> Decimal:
    """Return available pantry quantity for one ingredient and unit."""
    result = PantryItem.objects.filter(
        owner=meal_plan.owner, ingredient=requirement.ingredient, unit=requirement.unit
    ).aggregate(total=Sum("quantity"))

    return result["total"] or Decimal("0")


def _collect_ingredient_requirements(
    meal_plan: MealPlan,
) -> dict[tuple[int, str], IngredientRequirement]:
    """Return aggregated ingredient requirements for a meal plan."""
    requirements: dict[tuple[int, str], IngredientRequirement] = {}
    meal_plan_items = (
        MealPlanItem.objects.select_related("recipe")
        .prefetch_related("recipe__recipe_ingredients__ingredient")
        .filter(meal_plan=meal_plan)
    )

    for meal_plan_item in meal_plan_items:
        for recipe_ingredient in meal_plan_item.recipe.recipe_ingredients.all():
            ingredient_id = recipe_ingredient.ingredient.pk
            if ingredient_id is None:
                continue

            key = (ingredient_id, recipe_ingredient.unit)
            required_quantity = recipe_ingredient.quantity * Decimal(
                meal_plan_item.servings
            )

            if key not in requirements:
                requirements[key] = IngredientRequirement(
                    ingredient=recipe_ingredient.ingredient,
                    unit=recipe_ingredient.unit,
                    quantity=Decimal("0"),
                    source_meal_plan_item=meal_plan_item,
                )

            requirements[key].quantity += required_quantity

    return requirements


@transaction.atomic
def generate_shopping_list_from_meal_plan(
    meal_plan: MealPlan,
    name: str | None = None,
) -> ShoppingList:
    """Create a shopping list from meal plan requirements."""
    shopping_list = ShoppingList.objects.create(
        owner=meal_plan.owner, name=name or f"Shopping for {meal_plan.name}"
    )
    requirements = _collect_ingredient_requirements(meal_plan)

    for requirement in requirements.values():
        available_quantity = _get_available_pantry_quantity(meal_plan, requirement)
        quantity_to_buy = requirement.quantity - available_quantity

        if quantity_to_buy <= 0:
            continue

        ShoppingListItem.objects.create(
            shopping_list=shopping_list,
            ingredient=requirement.ingredient,
            quantity=quantity_to_buy,
            unit=requirement.unit,
            source_meal_plan_item=requirement.source_meal_plan_item,
        )

    return shopping_list
