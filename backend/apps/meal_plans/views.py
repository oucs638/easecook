"""API views for meal planning models."""

from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.meal_plans.serializers import MealPlanItemSerializer, MealPlanSerializer
from apps.shopping.serializers import ShoppingListSerializer
from apps.shopping.services import generate_shopping_list_from_meal_plan


class MealPlanViewSet(viewsets.ModelViewSet):
    """API endpoint for meal plans."""

    serializer_class = MealPlanSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return meal plans owned by the current user."""
        if not self.request.user.is_authenticated:
            return MealPlan.objects.none()

        return MealPlan.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """Create a meal plan owned by the current user."""
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], url_path="generate-shopping-list")
    def generate_shopping_list(self, request, pk=None):
        """Generate a shopping list from this meal plan."""
        meal_plan = self.get_object()
        shopping_list = generate_shopping_list_from_meal_plan(
            meal_plan=meal_plan,
            name=request.data.get("name") or None,
        )
        serializer = ShoppingListSerializer(shopping_list)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MealPlanItemViewSet(viewsets.ModelViewSet):
    """API endpoint for meal plan items."""

    serializer_class = MealPlanItemSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return meal plan items owned by the current user."""
        if not self.request.user.is_authenticated:
            return MealPlanItem.objects.none()

        return MealPlanItem.objects.filter(meal_plan__owner=self.request.user)

    def perform_create(self, serializer):
        """Create an item inside a meal plan owned by the current user."""
        meal_plan = serializer.validated_data["meal_plan"]
        if meal_plan.owner_id != self.request.user.id:
            raise PermissionDenied("Cannot update another user's meal plan.")

        serializer.save()
