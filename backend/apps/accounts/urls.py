"""URL routes for account APIs."""

from rest_framework.routers import DefaultRouter

from apps.accounts.views import UserProfileViewSet

router = DefaultRouter()
router.register("profiles", UserProfileViewSet, basename="profile")

urlpatterns = router.urls
