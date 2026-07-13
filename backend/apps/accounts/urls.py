"""URL routes for account APIs."""

from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from apps.accounts.views import (
    CurrentUserView,
    UserProfileViewSet,
    UserRegistrationView,
)

router = DefaultRouter()
router.register("profiles", UserProfileViewSet, basename="profile")

urlpatterns = [
    path("auth/register/", UserRegistrationView.as_view(), name="auth-register"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token-verify"),
]

urlpatterns += router.urls
