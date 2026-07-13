"""API views for meal planning models."""

from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.meal_plans.models import MealPlan, MealPlanItem
from apps.meal_plans.serializers import MealPlanItemSerializer, MealPlanSerializer


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
