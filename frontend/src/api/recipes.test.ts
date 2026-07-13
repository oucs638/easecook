import {describe, expect, it} from "vitest";

import {type IngredientDto, mapIngredient, mapRecipe, type RecipeDto,} from "./recipes";

describe("mapRecipe", () => {
  it("converts recipe API fields to frontend fields", () => {
    const dto: RecipeDto = {
      id: 1,
      owner: 7,
      owner_username: "demo_user",
      title: "Tomato Pasta",
      description: "Simple weekday pasta.",
      servings: 2,
      prep_minutes: 10,
      cook_minutes: 15,
      total_minutes: 25,
      difficulty: "easy",
      tags: ["pasta", "quick"],
      is_public: true,
      recipe_ingredients: [
        {
          id: 11,
          recipe: 1,
          ingredient: 3,
          ingredient_name: "Tomato",
          quantity: "2.00",
          unit: "piece",
          note: "",
          order: 1,
        },
      ],
      steps: [
        {
          id: 21,
          recipe: 1,
          order: 1,
          instruction: "Cook pasta.",
          tip: "Salt the water.",
        },
      ],
      created_at: "2026-07-13T00:00:00Z",
      updated_at: "2026-07-13T00:00:00Z",
    };

    expect(mapRecipe(dto)).toMatchObject({
      id: 1,
      ownerId: 7,
      ownerUsername: "demo_user",
      prepMinutes: 10,
      cookMinutes: 15,
      totalMinutes: 25,
      isPublic: true,
      ingredients: [
        {
          ingredientId: 3,
          ingredientName: "Tomato",
        },
      ],
      steps: [
        {
          instruction: "Cook pasta.",
        },
      ],
    });
  });
});

describe("mapIngredient", () => {
  it("converts ingredient API fields to frontend fields", () => {
    const dto: IngredientDto = {
      id: 3,
      name: "Tomato",
      category: "vegetable",
      default_unit: "piece",
      created_at: "2026-07-13T00:00:00Z",
      updated_at: "2026-07-13T00:00:00Z",
    };

    expect(mapIngredient(dto)).toEqual({
      id: 3,
      name: "Tomato",
      category: "vegetable",
      defaultUnit: "piece",
      createdAt: "2026-07-13T00:00:00Z",
      updatedAt: "2026-07-13T00:00:00Z",
    });
  });
});
