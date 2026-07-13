"""URL routes for shopping and pantry APIs."""

from rest_framework.routers import DefaultRouter

from apps.shopping.views import (
    PantryItemViewSet,
    ShoppingListItemViewSet,
    ShoppingListViewSet,
)

router = DefaultRouter()
router.register("pantry-items", PantryItemViewSet, basename="pantry-item")
router.register("shopping-lists", ShoppingListViewSet, basename="shopping-list")
router.register(
    "shopping-list-items", ShoppingListItemViewSet, basename="shopping-list-item"
)

urlpatterns = router.urls
