import {describe, expect, it} from "vitest";

import {mapMealPlan, type MealPlanDto} from "./mealPlans";

describe("mapMealPlan", () => {
  it("converts meal plan API fields to frontend fields", () => {
    const dto: MealPlanDto = {
      id: 1,
      owner: 7,
      owner_username: "demo_user",
      name: "Weekday Plan",
      start_date: "2026-07-13",
      end_date: "2026-07-19",
      items: [
        {
          id: 11,
          meal_plan: 1,
          recipe: 3,
          recipe_title: "Tomato Pasta",
          planned_date: "2026-07-13",
          meal_type: "dinner",
          servings: 2,
          note: "After work meal.",
        },
      ],
      created_at: "2026-07-13T00:00:00Z",
      updated_at: "2026-07-13T00:00:00Z",
    };

    expect(mapMealPlan(dto)).toMatchObject({
      id: 1,
      ownerId: 7,
      ownerUsername: "demo_user",
      startDate: "2026-07-13",
      endDate: "2026-07-19",
      items: [
        {
          mealPlanId: 1,
          recipeId: 3,
          recipeTitle: "Tomato Pasta",
          plannedDate: "2026-07-13",
          mealType: "dinner",
        },
      ],
    });
  });
});
