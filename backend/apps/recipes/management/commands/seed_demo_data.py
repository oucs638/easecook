"""Management command for seeding local demo data."""

from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import UserProfile
from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.recipes.models import Ingredient, Recipe, RecipeIngredient, RecipeStep
from apps.shopping.models import PantryItem
from apps.shopping.services import generate_shopping_list_from_meal_plan


class Command(BaseCommand):
    """Creates deterministic demo data for local portfolio review."""

    help = "Create a complete EaseCook demo workflow."

    @transaction.atomic
    def handle(self, *_args: object, **_options: object) -> None:
        """Seed demo user, recipes, meal plan, pantry, and shopping list."""
        user_model = get_user_model()
        user, _created = user_model.objects.get_or_create(
            username="demo_user", defaults={"email": "demo@example.com"}, )
        user.email = "demo@example.com"
        user.set_password("DemoPass123!")
        user.save()

        UserProfile.objects.update_or_create(
            user=user, defaults={
                "display_name": "Demo User",
                "cooking_skill_level": UserProfile.CookingSkillLevel.BEGINNER,
                "dietary_preferences": ["quick meals"],
                "allergies": [],
            }, )

        user.shopping_lists.all().delete()
        user.meal_plans.all().delete()
        user.pantry_items.all().delete()
        user.recipes.all().delete()

        tomato = self._create_ingredient("Tomato", "vegetable", "piece")
        pasta = self._create_ingredient("Pasta", "grain", "g")
        basil = self._create_ingredient("Basil", "seasoning", "g")
        rice = self._create_ingredient("Rice", "grain", "g")
        chicken = self._create_ingredient("Chicken Breast", "protein", "g")

        pasta_recipe = Recipe.objects.create(
            owner=user,
            title="Tomato Basil Pasta",
            description="A quick pasta recipe for a weekday dinner.",
            servings=2,
            prep_minutes=10,
            cook_minutes=15,
            difficulty=Recipe.Difficulty.EASY,
            tags=["quick", "vegetarian"],
            is_public=True, )
        RecipeIngredient.objects.bulk_create(
            [
                RecipeIngredient(
                    recipe=pasta_recipe,
                    ingredient=tomato,
                    quantity=Decimal("4.00"),
                    unit="piece",
                    order=1, ), RecipeIngredient(
                recipe=pasta_recipe,
                ingredient=pasta,
                quantity=Decimal("200.00"),
                unit="g",
                order=2, ), RecipeIngredient(
                recipe=pasta_recipe,
                ingredient=basil,
                quantity=Decimal("10.00"),
                unit="g",
                order=3, ),
            ], )
        RecipeStep.objects.bulk_create(
            [
                RecipeStep(
                    recipe=pasta_recipe,
                    order=1,
                    instruction="Boil pasta until al dente.",
                    tip="Reserve a small cup of pasta water.", ), RecipeStep(
                recipe=pasta_recipe,
                order=2,
                instruction="Cook tomatoes with basil and combine with "
                            "pasta.", ),
            ], )

        rice_bowl = Recipe.objects.create(
            owner=user,
            title="Chicken Rice Bowl",
            description="Simple protein bowl with pantry-friendly ingredients.",
            servings=1,
            prep_minutes=10,
            cook_minutes=20,
            difficulty=Recipe.Difficulty.MEDIUM,
            tags=["meal prep"],
            is_public=False, )
        RecipeIngredient.objects.bulk_create(
            [
                RecipeIngredient(
                    recipe=rice_bowl,
                    ingredient=rice,
                    quantity=Decimal("150.00"),
                    unit="g",
                    order=1, ), RecipeIngredient(
                recipe=rice_bowl,
                ingredient=chicken,
                quantity=Decimal("180.00"),
                unit="g",
                order=2, ),
            ], )
        RecipeStep.objects.bulk_create(
            [
                RecipeStep(
                    recipe=rice_bowl,
                    order=1,
                    instruction="Cook rice and keep it warm.", ), RecipeStep(
                recipe=rice_bowl,
                order=2,
                instruction="Pan-sear chicken and serve over rice.", ),
            ], )

        PantryItem.objects.create(
            owner=user,
            ingredient=tomato,
            quantity=Decimal("2.00"),
            unit="piece",
            note="Left from the previous grocery run.", )
        PantryItem.objects.create(
            owner=user,
            ingredient=rice,
            quantity=Decimal("100.00"),
            unit="g",
            note="Stored in the pantry.", )

        today = timezone.localdate()
        start_date = today - timedelta(days=today.weekday())
        meal_plan = MealPlan.objects.create(
            owner=user,
            name="Demo Weekly Meal Plan",
            start_date=start_date,
            end_date=start_date + timedelta(days=6), )
        MealPlanItem.objects.create(
            meal_plan=meal_plan,
            recipe=pasta_recipe,
            planned_date=start_date,
            meal_type=MealPlanItem.MealType.DINNER,
            servings=2, )
        MealPlanItem.objects.create(
            meal_plan=meal_plan,
            recipe=rice_bowl,
            planned_date=start_date + timedelta(days=1),
            meal_type=MealPlanItem.MealType.LUNCH,
            servings=1, )

        generate_shopping_list_from_meal_plan(
            meal_plan=meal_plan, name="Demo Shopping List", )

        self.stdout.write(
            self.style.SUCCESS(
                "Demo data created. Login with demo_user / DemoPass123!", ), )

    def _create_ingredient(
        self, name: str, category: str, default_unit: str, ) -> Ingredient:
        """Create or update a reusable ingredient."""
        ingredient, _created = Ingredient.objects.update_or_create(
            name=name, defaults={
                "category": category, "default_unit": default_unit,
            }, )
        return ingredient
