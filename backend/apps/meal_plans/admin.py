"""Django admin configuration for meal planning models."""

from django.contrib import admin

from apps.meal_plans.models import MealPlan, MealPlanItem


class MealPlanItemInline(admin.TabularInline):
    """Inline admin for meals inside a meal plan."""

    model = MealPlanItem
    extra = 1
    raw_id_fields = ("recipe",)


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    """Admin configuration for meal plans."""

    list_display = ("name", "owner", "start_date", "end_date", "updated_at")
    list_filter = ("start_date", "end_date", "created_at", "updated_at")
    search_fields = ("name", "owner__username", "owner__email")
    raw_id_fields = ("owner",)
    inlines = (MealPlanItemInline,)


@admin.register(MealPlanItem)
class MealPlanItemAdmin(admin.ModelAdmin):
    """Admin configuration for meal plan items."""

    list_display = ("meal_plan", "planned_date", "meal_type", "recipe", "servings")
    list_filter = ("meal_type", "planned_date")
    search_fields = ("meal_plan__name", "recipe__title")
    raw_id_fields = ("meal_plan", "recipe")
