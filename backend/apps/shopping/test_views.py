"""Tests for shopping API views."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.shopping.models import ShoppingList


class ShoppingListApiTests(TestCase):
    """Tests for shopping list APIs."""

    def test_create_shopping_list_assigns_current_user_as_owner(self) -> None:
        """Shopping list creation should use the authenticated user as owner."""
        user = get_user_model().objects.create_user(
            username="shopping_api_owner", password="test-pass"
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/shopping-lists/", {"name": "API Shopping List"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        shopping_list = ShoppingList.objects.get(name="API Shopping List")
        self.assertEqual(shopping_list.owner, user)
        self.assertEqual(response.data["owner_username"], "shopping_api_owner")
