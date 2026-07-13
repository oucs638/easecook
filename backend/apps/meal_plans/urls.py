"""URL routes for meal planning APIs."""

from rest_framework.routers import DefaultRouter

from apps.meal_plans.views import MealPlanItemViewSet, MealPlanViewSet

router = DefaultRouter()
router.register("meal-plans", MealPlanViewSet, basename="meal-plan")
router.register("meal-plan-items", MealPlanItemViewSet, basename="meal-plan-item")

urlpatterns = router.urls
