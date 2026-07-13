import {apiRequest} from "./client";

import {mapShoppingList, type ShoppingList, type ShoppingListDto,} from "./shopping";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlanItemDto {
  id: number;
  meal_plan: number;
  recipe: number;
  recipe_title: string;
  planned_date: string;
  meal_type: MealType;
  servings: number;
  note: string;
}

export interface MealPlanDto {
  id: number;
  owner: number;
  owner_username: string;
  name: string;
  start_date: string;
  end_date: string;
  items: MealPlanItemDto[];
  created_at: string;
  updated_at: string;
}

export interface MealPlanItem {
  id: number;
  mealPlanId: number;
  recipeId: number;
  recipeTitle: string;
  plannedDate: string;
  mealType: MealType;
  servings: number;
  note: string;
}

export interface MealPlan {
  id: number;
  ownerId: number;
  ownerUsername: string;
  name: string;
  startDate: string;
  endDate: string;
  items: MealPlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealPlanPayload {
  name: string;
  start_date: string;
  end_date: string;
}

export interface CreateMealPlanItemPayload {
  meal_plan: number;
  recipe: number;
  planned_date: string;
  meal_type: MealType;
  servings: number;
  note: string;
}

/**
 * Converts a meal plan response from Django format to frontend format.
 */
export function mapMealPlan(dto: MealPlanDto): MealPlan {
  return {
    id: dto.id,
    ownerId: dto.owner,
    ownerUsername: dto.owner_username,
    name: dto.name,
    startDate: dto.start_date,
    endDate: dto.end_date,
    items: dto.items.map((item) => ({
      id: item.id,
      mealPlanId: item.meal_plan,
      recipeId: item.recipe,
      recipeTitle: item.recipe_title,
      plannedDate: item.planned_date,
      mealType: item.meal_type,
      servings: item.servings,
      note: item.note,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

/**
 * Fetches meal plans owned by the current authenticated user.
 */
export async function listMealPlans(): Promise<MealPlan[]> {
  const mealPlans = await apiRequest<MealPlanDto[]>("/meal-plans/");

  return mealPlans.map(mapMealPlan);
}

/**
 * Creates a meal plan owned by the current authenticated user.
 */
export async function createMealPlan(
  payload: CreateMealPlanPayload,
): Promise<MealPlan> {
  const mealPlan = await apiRequest<MealPlanDto>("/meal-plans/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapMealPlan(mealPlan);
}

/**
 * Adds one recipe entry to an existing meal plan.
 */
export async function createMealPlanItem(
  payload: CreateMealPlanItemPayload,
): Promise<MealPlanItem> {
  const item = await apiRequest<MealPlanItemDto>("/meal-plan-items/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: item.id,
    mealPlanId: item.meal_plan,
    recipeId: item.recipe,
    recipeTitle: item.recipe_title,
    plannedDate: item.planned_date,
    mealType: item.meal_type,
    servings: item.servings,
    note: item.note,
  };
}

export interface GenerateShoppingListPayload {
  name?: string;
}

/**
 * Generates a shopping list from one meal plan.
 */
export async function generateShoppingListFromMealPlan(
  mealPlanId: number,
  payload: GenerateShoppingListPayload = {},
): Promise<ShoppingList> {
  const shoppingList = await apiRequest<ShoppingListDto>(
    `/meal-plans/${mealPlanId}/generate-shopping-list/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return mapShoppingList(shoppingList);
}
