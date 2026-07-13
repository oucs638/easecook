"""API views for shopping and pantry models."""

from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem
from apps.shopping.serializers import (
    PantryItemSerializer,
    ShoppingListItemSerializer,
    ShoppingListSerializer,
)


class PantryItemViewSet(viewsets.ModelViewSet):
    """API endpoint for pantry items."""

    serializer_class = PantryItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return pantry items owned by the current user."""
        if not self.request.user.is_authenticated:
            return PantryItem.objects.none()

        return PantryItem.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Create a pantry item owned by the current user."""
        serializer.save(owner=self.request.user)


class ShoppingListViewSet(viewsets.ModelViewSet):
    """API endpoint for shopping lists."""

    serializer_class = ShoppingListSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return shopping lists owned by the current user."""
        if not self.request.user.is_authenticated:
            return ShoppingList.objects.none()

        return ShoppingList.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Create a shopping list owned by the current user."""
        serializer.save(owner=self.request.user)


class ShoppingListItemViewSet(viewsets.ModelViewSet):
    """API endpoint for shopping list items."""

    serializer_class = ShoppingListItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return shopping list items owned by the current user."""
        if not self.request.user.is_authenticated:
            return ShoppingListItem.objects.none()

        return ShoppingListItem.objects.filter(shopping_list__owner=self.request.user)

    def perform_create(self, serializer):
        """Create an item inside a shopping list owned by the current user."""
        shopping_list = serializer.validated_data["shopping_list"]
        if shopping_list.owner_id != self.request.user.id:
            raise PermissionDenied("Cannot update another user's shopping list.")

        serializer.save()
