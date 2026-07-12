"""Recipe-related database models."""

from django.db import models


class Ingredient(models.Model):
    """Represents a reusable cooking ingredient."""

    class Category(models.TextChoices):
        """Supported ingredient categories."""

        PROTEIN = "protein", "Protein"
        VEGETABLE = "vegetable", "Vegetable"
        FRUIT = "fruit", "Fruit"
        GRAIN = "grain", "Grain"
        DAIRY = "dairy", "Dairy"
        SEASONING = "seasoning", "Seasoning"
        OTHER = "other", "Other"

    name = models.CharField(max_length=120, unique=True)
    category = models.CharField(max_length=30, choices=Category, default=Category.OTHER)
    default_unit = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Model metadata."""

        ordering = ["name"]

    def __str__(self) -> str:
        """Return the ingredient name."""
        return self.name


class Recipe(models.Model):
    """Represents a cooking recipe created by a user."""

    class Difficulty(models.TextChoices):
        """Supported recipe difficulty levels."""

        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    owner = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="recipes"
    )
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    servings = models.PositiveSmallIntegerField(default=1)
    prep_minutes = models.PositiveSmallIntegerField(default=0)
    cook_minutes = models.PositiveSmallIntegerField(default=0)
    difficulty = models.CharField(
        max_length=20, choices=Difficulty, default=Difficulty.EASY
    )
    tags = models.JSONField(default=list, blank=True)
    is_public = models.BooleanField(default=False)
    ingredients = models.ManyToManyField(
        Ingredient, through="RecipeIngredient", related_name="recipes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        """Model metadata."""

        ordering = ["-created_at"]

    def __str__(self) -> str:
        """Return the recipe title."""
        return self.title

    @property
    def total_minutes(self) -> int:
        """Return total preparation and cooking time."""
        return self.prep_minutes + self.cook_minutes


class RecipeIngredient(models.Model):
    """Connects a recipe with one required ingredient."""

    recipe = models.ForeignKey(
        Recipe, on_delete=models.CASCADE, related_name="recipe_ingredients"
    )
    ingredient = models.ForeignKey(
        Ingredient, on_delete=models.CASCADE, related_name="recipes_ingredients"
    )
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=30)
    note = models.CharField(max_length=160, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        """Model metadata."""

        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["recipe", "ingredient"], name="unique_ingredient_per_recipe"
            )
        ]

    def __str__(self) -> str:
        """Return a readable ingredient requirement."""
        return f"{self.quantity} {self.unit} {self.ingredient.name}"


class RecipeStep(models.Model):
    """Represents one instruction step in a recipe."""

    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    order = models.PositiveSmallIntegerField(default=0)
    instruction = models.TextField(blank=True)
    tip = models.CharField(max_length=255, blank=True)

    class Meta:
        """Model metadata."""

        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(
                fields=["recipe", "order"], name="unique_step_order_per_recipe"
            )
        ]

    def __str__(self) -> str:
        """Return a readable step label."""
        return f"{self.recipe.title} - Step {self.order}"
