"""Shopping and pantry database models."""

from django.db import models


class PantryItem(models.Model):
    """Represents an ingredient currently owned by a user."""

    owner = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="pantry_items"
    )
    ingredient = models.ForeignKey(
        "recipes.Ingredient", on_delete=models.PROTECT, related_name="pantry_items"
    )
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=30)
    expiration_date = models.DateField(null=True, blank=True)
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Model metadata."""

        ordering = ["expiration_date", "ingredient__name"]
        constraints = [
            models.UniqueConstraint(
                fields=["owner", "ingredient", "unit"],
                name="unique_pantry_item_per_user_ingradent_unit",
            )
        ]

    def __str__(self) -> str:
        """Return a readable pantry item label."""
        return f"{self.ingredient.name} {self.quantity} {self.unit}"


class ShoppingList(models.Model):
    """Represents a user's shopping list."""

    class Status(models.TextChoices):
        """Supported shopping list statuses."""

        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ARCHIVED = "archived", "Archived"

    owner = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="shopping_lists"
    )
    name = models.CharField(max_length=160)
    status = models.CharField(max_length=20, choices=Status, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Model metadata."""

        ordering = ["-created_at"]

    def __str__(self) -> str:
        """Return the shopping list name."""
        return self.name


class ShoppingListItem(models.Model):
    """Represents one ingredient to buy."""

    shopping_list = models.ForeignKey(
        ShoppingList, on_delete=models.CASCADE, related_name="items"
    )
    ingredient = models.ForeignKey(
        "recipes.Ingredient",
        on_delete=models.PROTECT,
        related_name="shopping_list_items",
    )
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=30)
    is_checked = models.BooleanField(default=False)
    note = models.CharField(max_length=255, blank=True)
    source_meal_plan_item = models.ForeignKey(
        "meal_plans.MealPlanItem",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="shopping_list_items",
    )

    class Meta:
        """Model metadata."""

        ordering = ["is_checked", "ingredient__name"]
        constraints = [
            models.UniqueConstraint(
                fields=["shopping_list", "ingredient", "unit"],
                name="unique_shopping_item_per_list_ingredient_unit",
            )
        ]

    def __str__(self) -> str:
        """Return a readable shopping item label."""
        return f"{self.ingredient.name} {self.quantity} {self.unit}"
