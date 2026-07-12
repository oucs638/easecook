"""Django admin configuration for shopping and pantry models."""

from django.contrib import admin

from apps.shopping.models import PantryItem, ShoppingList, ShoppingListItem


@admin.register(PantryItem)
class PantryItemAdmin(admin.ModelAdmin):
    """Admin configuration for pantry items."""

    list_display = (
        "ingredient",
        "owner",
        "quantity",
        "unit",
        "expiration_date",
        "updated_at",
    )
    list_filter = ("unit", "expiration_date", "created_at", "updated_at")
    search_fields = ("ingredient__name", "owner__username", "owner__email")
    raw_id_fields = ("owner", "ingredient")


class ShoppingListItemInline(admin.TabularInline):
    """Inline admin for shopping list items."""

    model = ShoppingListItem
    extra = 1
    raw_id_fields = ("ingredient", "source_meal_plan_item")


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    """Admin configuration for shopping lists."""

    list_display = ("name", "owner", "status", "created_at", "updated_at")
    list_filter = ("status", "created_at", "updated_at")
    search_fields = ("name", "owner__username", "owner__email")
    raw_id_fields = ("owner",)
    inlines = (ShoppingListItemInline,)


@admin.register(ShoppingListItem)
class ShoppingListItemAdmin(admin.ModelAdmin):
    """Admin configuration for shopping list items."""

    list_display = ("shopping_list", "ingredient", "quantity", "unit", "is_checked")
    list_filter = ("is_checked", "unit")
    search_fields = ("shopping_list__name", "ingredient__name", "note")
    raw_id_fields = ("shopping_list", "ingredient", "source_meal_plan_item")
