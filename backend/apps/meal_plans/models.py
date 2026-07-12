"""Meal planning database models."""

from django.db import models


class MealPlan(models.Model):
    """Represents a user's meal plan for a date range."""

    owner = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="meal_plans"
    )
    name = models.CharField(max_length=160)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Model metadata."""

        ordering = ["-start_date"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F("start_date")),
                name="meal_plan_end_date_on_or_after_start_date",
            )
        ]

    def __str__(self) -> str:
        """Return the meal plan name."""
        return self.name


class MealPlanItem(models.Model):
    """Represents one planned meal in a meal plan."""

    class MealType(models.TextChoices):
        """Supported meal types."""

        BREAKFAST = "breakfast", "Breakfast"
        LUNCH = "lunch", "Lunch"
        DINNER = "dinner", "Dinner"
        SNACK = "snack", "Snack"

    meal_plan = models.ForeignKey(
        MealPlan, on_delete=models.CASCADE, related_name="items"
    )
    recipe = models.ForeignKey(
        "recipes.Recipe", on_delete=models.PROTECT, related_name="meal_plan_items"
    )
    planned_date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MealType)
    servings = models.PositiveSmallIntegerField(default=1)
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        """Model metadata."""

        ordering = ["planned_date", "meal_type"]
        constraints = [
            models.UniqueConstraint(
                fields=["meal_plan", "planned_date", "meal_type"],
                name="unique_meal_type_per_day_in_plan",
            )
        ]

    def __str__(self) -> str:
        """Return a readable planned meal label."""
        return f"{self.planned_date} {self.meal_type}: {self.recipe.title}"
