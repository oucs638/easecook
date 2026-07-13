"""URL routes for recipe APIs."""

from rest_framework.routers import DefaultRouter

from apps.recipes.views import (
    IngredientViewSet,
    RecipeIngredientViewSet,
    RecipeStepViewSet,
    RecipeViewSet,
)

router = DefaultRouter()
router.register("ingredients", IngredientViewSet, basename="ingredient")
router.register("recipes", RecipeViewSet, basename="recipe")
router.register(
    "recipe-ingredients", RecipeIngredientViewSet, basename="recipe-ingredient"
)
router.register("recipe-steps", RecipeStepViewSet, basename="recipe-step")

urlpatterns = router.urls
