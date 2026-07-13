import {describe, expect, it} from "vitest";

import {mapShoppingList, type ShoppingListDto} from "./shopping";

describe("mapShoppingList", () => {
  it("converts shopping list API fields to frontend fields", () => {
    const dto: ShoppingListDto = {
      id: 1,
      owner: 7,
      owner_username: "demo_user",
      name: "Shopping for Weekday Plan",
      status: "active",
      items: [
        {
          id: 11,
          shopping_list: 1,
          ingredient: 3,
          ingredient_name: "Tomato",
          quantity: "4.00",
          unit: "piece",
          is_checked: false,
          note: "",
          source_meal_plan_item: 5,
        },
      ],
      created_at: "2026-07-13T00:00:00Z",
      updated_at: "2026-07-13T00:00:00Z",
    };

    expect(mapShoppingList(dto)).toMatchObject({
      id: 1,
      ownerId: 7,
      ownerUsername: "demo_user",
      status: "active",
      items: [
        {
          shoppingListId: 1,
          ingredientId: 3,
          ingredientName: "Tomato",
          isChecked: false,
          sourceMealPlanItemId: 5,
        },
      ],
    });
  });
});
