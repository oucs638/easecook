"""Tests for recipe API views."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.recipes.models import Recipe


class RecipeApiTests(TestCase):
    """Tests for recipe APIs."""

    def test_create_recipe_assigns_current_user_as_owner(self) -> None:
        """Recipe creation should use the authenticated user as owner."""
        user = get_user_model().objects.create_user(
            username="recipe_api_owner", password="test-pass"
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/recipes/",
            {
                "title": "API Pasta",
                "servings": 2,
                "prep_minutes": 10,
                "cook_minutes": 15,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        recipe = Recipe.objects.get(title="API Pasta")
        self.assertEqual(recipe.owner, user)
        self.assertEqual(response.data["owner_username"], "recipe_api_owner")
