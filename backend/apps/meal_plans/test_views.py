"""Tests for meal planning API views."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.meal_plans.models import MealPlan


class MealPlanApiTests(TestCase):
    """Tests for meal planning APIs."""

    def test_create_meal_plan_assigns_current_user_as_owner(self) -> None:
        """Meal plan creation should use the authenticated user as owner."""
        user = get_user_model().objects.create_user(
            username="meal_api_owner", password="test-pass"
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.post(
            "/api/meal-plans/", {
                "name": "API Weekly Plan",
                "start_date": "2026-07-13",
                "end_date": "2026-07-19",
            }, format="json", )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        meal_plan = MealPlan.objects.get(name="API Weekly Plan")
        self.assertEqual(meal_plan.owner, user)
        self.assertEqual(response.data["owner_username"], "meal_api_owner")

    def test_meal_plan_list_only_returns_current_user_plans(self) -> None:
        """Meal plan list should only include current user data."""
        user = get_user_model().objects.create_user(
            username="meal_list_owner", password="test-pass"
        )
        other_user = get_user_model().objects.create_user(
            username="other_meal_owner", password="test-pass"
        )
        MealPlan.objects.create(
            owner=user,
            name="Current User Plan",
            start_date="2026-07-13",
            end_date="2026-07-19"
        )
        MealPlan.objects.create(
            owner=other_user,
            name="Other User Plan",
            start_date="2026-07-13",
            end_date="2026-07-19"
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.get("/api/meal-plans/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Current User Plan")
