import {apiRequest} from "./client";

export type ShoppingListStatus = "active" | "completed" | "archived";

export interface ShoppingListItemDto {
  id: number;
  shopping_list: number;
  ingredient: number;
  ingredient_name: string;
  quantity: string;
  unit: string;
  is_checked: boolean;
  note: string;
  source_meal_plan_item: number | null;
}

export interface ShoppingListDto {
  id: number;
  owner: number;
  owner_username: string;
  name: string;
  status: ShoppingListStatus;
  items: ShoppingListItemDto[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: string;
  unit: string;
  isChecked: boolean;
  note: string;
  sourceMealPlanItemId: number | null;
}

export interface ShoppingList {
  id: number;
  ownerId: number;
  ownerUsername: string;
  name: string;
  status: ShoppingListStatus;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateShoppingListItemPayload {
  is_checked: boolean;
}

/**
 * Converts a shopping list response from Django format to frontend format.
 */
export function mapShoppingList(dto: ShoppingListDto): ShoppingList {
  return {
    id: dto.id,
    ownerId: dto.owner,
    ownerUsername: dto.owner_username,
    name: dto.name,
    status: dto.status,
    items: dto.items.map((item) => ({
      id: item.id,
      shoppingListId: item.shopping_list,
      ingredientId: item.ingredient,
      ingredientName: item.ingredient_name,
      quantity: item.quantity,
      unit: item.unit,
      isChecked: item.is_checked,
      note: item.note,
      sourceMealPlanItemId: item.source_meal_plan_item,
    })),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

/**
 * Fetches shopping lists owned by the current authenticated user.
 */
export async function listShoppingLists(): Promise<ShoppingList[]> {
  const shoppingLists = await apiRequest<ShoppingListDto[]>("/shopping-lists/");

  return shoppingLists.map(mapShoppingList);
}

/**
 * Updates one shopping list item.
 */
export async function updateShoppingListItem(
  id: number,
  payload: UpdateShoppingListItemPayload,
): Promise<ShoppingListItem> {
  const item = await apiRequest<ShoppingListItemDto>(`/shopping-list-items/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return {
    id: item.id,
    shoppingListId: item.shopping_list,
    ingredientId: item.ingredient,
    ingredientName: item.ingredient_name,
    quantity: item.quantity,
    unit: item.unit,
    isChecked: item.is_checked,
    note: item.note,
    sourceMealPlanItemId: item.source_meal_plan_item,
  };
}

export interface PantryItemDto {
  id: number;
  owner: number;
  ingredient: number;
  ingredient_name: string;
  quantity: string;
  unit: string;
  expiration_date: string | null;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface PantryItem {
  id: number;
  ownerId: number;
  ingredientId: number;
  ingredientName: string;
  quantity: string;
  unit: string;
  expirationDate: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePantryItemPayload {
  ingredient: number;
  quantity: string;
  unit: string;
  expiration_date: string | null;
  note: string;
}

/**
 * Converts a pantry item response from Django format to frontend format.
 */
export function mapPantryItem(dto: PantryItemDto): PantryItem {
  return {
    id: dto.id,
    ownerId: dto.owner,
    ingredientId: dto.ingredient,
    ingredientName: dto.ingredient_name,
    quantity: dto.quantity,
    unit: dto.unit,
    expirationDate: dto.expiration_date,
    note: dto.note,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

/**
 * Fetches pantry items owned by the current authenticated user.
 */
export async function listPantryItems(): Promise<PantryItem[]> {
  const pantryItems = await apiRequest<PantryItemDto[]>("/pantry-items/");

  return pantryItems.map(mapPantryItem);
}

/**
 * Creates one pantry item for the current authenticated user.
 */
export async function createPantryItem(
  payload: CreatePantryItemPayload,
): Promise<PantryItem> {
  const pantryItem = await apiRequest<PantryItemDto>("/pantry-items/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapPantryItem(pantryItem);
}
