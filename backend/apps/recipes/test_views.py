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

    def test_public_recipe_can_be_read_by_authenticated_user(self) -> None:
        """Public recipes should be readable by other users."""
        owner = get_user_model().objects.create_user(
            username="public_recipe_owner", password="test-pass"
        )
        viewer = get_user_model().objects.create_user(
            username="public_recipe_viewer", password="test-pass"
        )
        recipe = Recipe.objects.create(owner=owner, title="Public Soup", is_public=True)
        client = APIClient()
        client.force_authenticate(user=viewer)

        response = client.get(f"/api/recipes/{recipe.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Public Soup")

    def test_private_recipe_is_hidden_from_other_users(self) -> None:
        """Private recipes should not be visible to other users."""
        owner = get_user_model().objects.create_user(
            username="private_recipe_owner", password="test-pass"
        )
        viewer = get_user_model().objects.create_user(
            username="private_recipe_viewer", password="test-pass"
        )
        recipe = Recipe.objects.create(owner=owner, title="Private Soup")
        client = APIClient()
        client.force_authenticate(user=viewer)

        response = client.get(f"/api/recipes/{recipe.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_public_recipe_cannot_be_updated_by_non_owner(self) -> None:
        """Public recipes should not be editable by other users."""
        owner = get_user_model().objects.create_user(
            username="shared_recipe_owner", password="test-pass"
        )
        editor = get_user_model().objects.create_user(
            username="shared_recipe_editor", password="test-pass"
        )
        recipe = Recipe.objects.create(
            owner=owner, title="Original Public Recipe", is_public=True
        )
        client = APIClient()
        client.force_authenticate(user=editor)

        response = client.patch(
            f"/api/recipes/{recipe.id}/",
            {"title": "Changed By Other User"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        recipe.refresh_from_db()
        self.assertEqual(recipe.title, "Original Public Recipe")
