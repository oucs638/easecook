"""API views for account models."""

from rest_framework import permissions, viewsets

from apps.accounts.models import UserProfile
from apps.accounts.serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """API endpoint for user profiles."""

    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """Return profiles owned by the current user."""
        if not self.request.user.is_authenticated:
            return UserProfile.objects.none()

        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Create a profile for the current user."""
        serializer.save(user=self.request.user)
