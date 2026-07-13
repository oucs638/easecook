import {apiRequest} from "./client";

export type RecipeDifficulty = "easy" | "medium" | "hard";

export type IngredientCategory =
  | "protein"
  | "vegetable"
  | "fruit"
  | "grain"
  | "dairy"
  | "seasoning"
  | "other";

export interface IngredientDto {
  id: number;
  name: string;
  category: IngredientCategory;
  default_unit: string;
  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: IngredientCategory;
  defaultUnit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientPayload {
  name: string;
  category: IngredientCategory;
  default_unit: string;
}

export interface CreateRecipeIngredientPayload {
  recipe: number;
  ingredient: number;
  quantity: string;
  unit: string;
  note: string;
  order: number;
}

export interface RecipeIngredientDto {
  id: number;
  recipe: number;
  ingredient: number;
  ingredient_name: string;
  quantity: string;
  unit: string;
  note: string;
  order: number;
}

export interface RecipeStepDto {
  id: number;
  recipe: number;
  order: number;
  instruction: string;
  tip: string;
}

export interface RecipeDto {
  id: number;
  owner: number;
  owner_username: string;
  title: string;
  description: string;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  total_minutes: number;
  difficulty: RecipeDifficulty;
  tags: string[];
  is_public: boolean;
  recipe_ingredients: RecipeIngredientDto[];
  steps: RecipeStepDto[];
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: string;
  unit: string;
  note: string;
  order: number;
}

export interface RecipeStep {
  id: number;
  recipeId: number;
  order: number;
  instruction: string;
  tip: string;
}

export interface Recipe {
  id: number;
  ownerId: number;
  ownerUsername: string;
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  difficulty: RecipeDifficulty;
  tags: string[];
  isPublic: boolean;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipePayload {
  title: string;
  description: string;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  difficulty: RecipeDifficulty;
  tags: string[];
  is_public: boolean;
}

/**
 * Converts an ingredient response from Django format to frontend format.
 */
export function mapIngredient(dto: IngredientDto): Ingredient {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    defaultUnit: dto.default_unit,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

/**
 * Converts a recipe response from Django serializer format to frontend format.
 */
export function mapRecipe(dto: RecipeDto): Recipe {
  return {
    id: dto.id,
    ownerId: dto.owner,
    ownerUsername: dto.owner_username,
    title: dto.title,
    description: dto.description,
    servings: dto.servings,
    prepMinutes: dto.prep_minutes,
    cookMinutes: dto.cook_minutes,
    totalMinutes: dto.total_minutes,
    difficulty: dto.difficulty,
    tags: dto.tags,
    isPublic: dto.is_public,
    ingredients: dto.recipe_ingredients.map((ingredient) => ({
      id: ingredient.id,
      recipeId: ingredient.recipe,
      ingredientId: ingredient.ingredient,
      ingredientName: ingredient.ingredient_name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      note: ingredient.note,
      order: ingredient.order,
    })),
    steps: dto.steps.map((step) => ({
      id: step.id,
      recipeId: step.recipe,
      order: step.order,
      instruction: step.instruction,
      tip: step.tip,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

/**
 * Fetches recipes visible to the current authenticated user.
 */
export async function listRecipes(): Promise<Recipe[]> {
  const recipes = await apiRequest<RecipeDto[]>("/recipes/");

  return recipes.map(mapRecipe);
}

/**
 * Creates a basic recipe owned by the current authenticated user.
 */
export async function createRecipe(payload: CreateRecipePayload): Promise<Recipe> {
  const recipe = await apiRequest<RecipeDto>("/recipes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapRecipe(recipe);
}

/**
 * Fetches reusable ingredients.
 */
export async function listIngredients(): Promise<Ingredient[]> {
  const ingredients = await apiRequest<IngredientDto[]>("/ingredients/");

  return ingredients.map(mapIngredient);
}

/**
 * Creates a reusable ingredient.
 */
export async function createIngredient(
  payload: CreateIngredientPayload,
): Promise<Ingredient> {
  const ingredient = await apiRequest<IngredientDto>("/ingredients/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapIngredient(ingredient);
}

/**
 * Adds one ingredient requirement to a recipe.
 */
export async function createRecipeIngredient(
  payload: CreateRecipeIngredientPayload,
): Promise<RecipeIngredient> {
  const recipeIngredient = await apiRequest<RecipeIngredientDto>(
    "/recipe-ingredients/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return {
    id: recipeIngredient.id,
    recipeId: recipeIngredient.recipe,
    ingredientId: recipeIngredient.ingredient,
    ingredientName: recipeIngredient.ingredient_name,
    quantity: recipeIngredient.quantity,
    unit: recipeIngredient.unit,
    note: recipeIngredient.note,
    order: recipeIngredient.order,
  };
}
