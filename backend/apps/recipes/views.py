"""API views for recipe models."""

from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from apps.recipes.models import Ingredient, Recipe, RecipeIngredient, RecipeStep
from apps.recipes.serializers import (
    IngredientSerializer,
    RecipeIngredientSerializer,
    RecipeSerializer,
    RecipeStepSerializer,
)


class IngredientViewSet(viewsets.ModelViewSet):
    """API endpoint for ingredients."""

    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = (permissions.IsAuthenticated,)
    search_fields = ("name",)


class RecipeViewSet(viewsets.ModelViewSet):
    """API endpoint for recipes."""

    serializer_class = RecipeSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return recipes owned by the user or marked as public."""
        user = self.request.user
        if not user.is_authenticated:
            return Recipe.objects.filter(is_public=True)

        return Recipe.objects.filter(Q(owner=user) | Q(is_public=True)).distinct()

    def perform_create(self, serializer):
        """Create a recipe owned by the current user."""
        serializer.save(owner=self.request.user)


class RecipeIngredientViewSet(viewsets.ModelViewSet):
    """API endpoint for recipe ingredients."""

    serializer_class = RecipeIngredientSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return recipe ingredients for the current user's recipes."""
        if not self.request.user.is_authenticated:
            return RecipeIngredient.objects.none()

        return RecipeIngredient.objects.filter(recipe__owner=self.request.user)

    def perform_create(self, serializer):
        """Create an ingredient entry for a recipe owned by the current user."""
        recipe = serializer.validated_data["recipe"]
        if recipe.owner_id != self.request.user.id:
            raise PermissionDenied("Cannot update another user's recipe.")

        serializer.save()


class RecipeStepViewSet(viewsets.ModelViewSet):
    """API endpoint for recipe steps."""

    serializer_class = RecipeStepSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return recipe steps for the current user's recipes."""
        if not self.request.user.is_authenticated:
            return RecipeStep.objects.none()

        return RecipeStep.objects.filter(recipe__owner=self.request.user)

    def perform_create(self, serializer):
        """Create a step for a recipe owned by the current user."""
        recipe = serializer.validated_data["recipe"]
        if recipe.owner_id != self.request.user.id:
            raise PermissionDenied("Cannot update another user's recipe.")

        serializer.save()
