import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type FormEvent, useState} from "react";

import {
  createIngredient,
  createRecipe,
  createRecipeIngredient,
  type CreateRecipePayload,
  type Ingredient,
  type IngredientCategory,
  listIngredients,
  listRecipes,
  type Recipe,
  type RecipeDifficulty,
} from "../api/recipes";

interface RecipeFormState {
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: RecipeDifficulty;
  tagsText: string;
  isPublic: boolean;
}

interface IngredientFormState {
  name: string;
  category: IngredientCategory;
  defaultUnit: string;
}

interface RecipeIngredientFormState {
  recipeId: string;
  ingredientId: string;
  quantity: string;
  unit: string;
  note: string;
  order: number;
}

const defaultRecipeForm: RecipeFormState = {
  title: "",
  description: "",
  servings: 2,
  prepMinutes: 10,
  cookMinutes: 20,
  difficulty: "easy",
  tagsText: "",
  isPublic: false,
};

const defaultIngredientForm: IngredientFormState = {
  name: "",
  category: "other",
  defaultUnit: "",
};

const defaultRecipeIngredientForm: RecipeIngredientFormState = {
  recipeId: "",
  ingredientId: "",
  quantity: "1.00",
  unit: "",
  note: "",
  order: 1,
};

const emptyRecipes: Recipe[] = [];
const emptyIngredients: Ingredient[] = [];

/**
 * Converts form-only fields into the backend create payload.
 */
function buildCreateRecipePayload(form: RecipeFormState): CreateRecipePayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    servings: form.servings,
    prep_minutes: form.prepMinutes,
    cook_minutes: form.cookMinutes,
    difficulty: form.difficulty,
    tags: form.tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    is_public: form.isPublic,
  };
}

function formatDifficulty(difficulty: RecipeDifficulty): string {
  const labels: Record<RecipeDifficulty, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return labels[difficulty];
}

export function RecipesPage() {
  const queryClient = useQueryClient();
  const [draftRecipe, setDraftRecipe] = useState(defaultRecipeForm);
  const [ingredientDraft, setIngredientDraft] = useState(defaultIngredientForm);
  const [recipeIngredientDraft, setRecipeIngredientDraft] = useState(
    defaultRecipeIngredientForm,
  );

  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: listRecipes,
  });

  const ingredientsQuery = useQuery({
    queryKey: ["ingredients"],
    queryFn: listIngredients,
  });

  const createRecipeMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: async () => {
      setDraftRecipe(defaultRecipeForm);
      await queryClient.invalidateQueries({queryKey: ["recipes"]});
    },
  });

  const createIngredientMutation = useMutation({
    mutationFn: createIngredient,
    onSuccess: async (ingredient) => {
      setIngredientDraft(defaultIngredientForm);
      setRecipeIngredientDraft((currentDraft) => ({
        ...currentDraft,
        ingredientId: String(ingredient.id),
        unit: ingredient.defaultUnit,
      }));
      await queryClient.invalidateQueries({queryKey: ["ingredients"]});
    },
  });

  const createRecipeIngredientMutation = useMutation({
    mutationFn: createRecipeIngredient,
    onSuccess: async () => {
      setRecipeIngredientDraft((currentDraft) => ({
        ...currentDraft,
        quantity: "1.00",
        note: "",
        order: currentDraft.order + 1,
      }));
      await queryClient.invalidateQueries({queryKey: ["recipes"]});
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await createRecipeMutation.mutateAsync(buildCreateRecipePayload(draftRecipe));
  }

  async function handleCreateIngredient(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await createIngredientMutation.mutateAsync({
      name: ingredientDraft.name.trim(),
      category: ingredientDraft.category,
      default_unit: ingredientDraft.defaultUnit.trim(),
    });
  }

  async function handleCreateRecipeIngredient(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await createRecipeIngredientMutation.mutateAsync({
      recipe: Number(recipeIngredientDraft.recipeId),
      ingredient: Number(recipeIngredientDraft.ingredientId),
      quantity: recipeIngredientDraft.quantity,
      unit: recipeIngredientDraft.unit.trim(),
      note: recipeIngredientDraft.note.trim(),
      order: recipeIngredientDraft.order,
    });
  }

  function updateDraftRecipe<TField extends keyof RecipeFormState>(
    field: TField,
    value: RecipeFormState[TField],
  ): void {
    setDraftRecipe((currentRecipe) => ({
      ...currentRecipe,
      [field]: value,
    }));
  }

  function updateIngredientDraft<TField extends keyof IngredientFormState>(
    field: TField,
    value: IngredientFormState[TField],
  ): void {
    setIngredientDraft((currentIngredient) => ({
      ...currentIngredient,
      [field]: value,
    }));
  }

  function updateRecipeIngredientDraft<
    TField extends keyof RecipeIngredientFormState,
  >(field: TField, value: RecipeIngredientFormState[TField]): void {
    setRecipeIngredientDraft((currentIngredient) => ({
      ...currentIngredient,
      [field]: value,
    }));
  }

  const recipes = recipesQuery.data ?? emptyRecipes;
  const ingredients = ingredientsQuery.data ?? emptyIngredients;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Recipes</p>
          <h1>Recipe Library</h1>
          <p>
            Create interview-ready recipe records and review recipes available to
            the current user.
          </p>
        </div>
      </header>

      <div className="content-layout">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">New recipe</p>
            <h2>Create a basic recipe</h2>
          </div>

          <form className="recipe-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                maxLength={160}
                required
                type="text"
                value={draftRecipe.title}
                onChange={(event) =>
                  updateDraftRecipe("title", event.target.value)
                }
              />
            </label>

            <label>
              Description
              <textarea
                rows={4}
                value={draftRecipe.description}
                onChange={(event) =>
                  updateDraftRecipe("description", event.target.value)
                }
              />
            </label>

            <div className="form-row">
              <label>
                Servings
                <input
                  min={1}
                  required
                  type="number"
                  value={draftRecipe.servings}
                  onChange={(event) =>
                    updateDraftRecipe("servings", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Difficulty
                <select
                  value={draftRecipe.difficulty}
                  onChange={(event) =>
                    updateDraftRecipe(
                      "difficulty",
                      event.target.value as RecipeDifficulty,
                    )
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Prep minutes
                <input
                  min={0}
                  required
                  type="number"
                  value={draftRecipe.prepMinutes}
                  onChange={(event) =>
                    updateDraftRecipe("prepMinutes", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Cook minutes
                <input
                  min={0}
                  required
                  type="number"
                  value={draftRecipe.cookMinutes}
                  onChange={(event) =>
                    updateDraftRecipe("cookMinutes", Number(event.target.value))
                  }
                />
              </label>
            </div>

            <label>
              Tags
              <input
                placeholder="quick, pasta, vegetarian"
                type="text"
                value={draftRecipe.tagsText}
                onChange={(event) =>
                  updateDraftRecipe("tagsText", event.target.value)
                }
              />
            </label>

            <label className="checkbox-field">
              <input
                checked={draftRecipe.isPublic}
                type="checkbox"
                onChange={(event) =>
                  updateDraftRecipe("isPublic", event.target.checked)
                }
              />
              Public recipe
            </label>

            {createRecipeMutation.isError ? (
              <p className="form-error">Unable to create recipe.</p>
            ) : null}

            <button disabled={createRecipeMutation.isPending} type="submit">
              {createRecipeMutation.isPending ? "Creating..." : "Create recipe"}
            </button>
          </form>
          <div className="section-divider"/>

          <div className="section-heading">
            <p className="eyebrow">Ingredients</p>
            <h2>Create ingredient</h2>
          </div>

          <form className="recipe-form" onSubmit={handleCreateIngredient}>
            <label>
              Name
              <input
                maxLength={120}
                required
                type="text"
                value={ingredientDraft.name}
                onChange={(event) =>
                  updateIngredientDraft("name", event.target.value)
                }
              />
            </label>

            <label>
              Category
              <select
                value={ingredientDraft.category}
                onChange={(event) =>
                  updateIngredientDraft(
                    "category",
                    event.target.value as IngredientCategory,
                  )
                }
              >
                <option value="protein">Protein</option>
                <option value="vegetable">Vegetable</option>
                <option value="fruit">Fruit</option>
                <option value="grain">Grain</option>
                <option value="dairy">Dairy</option>
                <option value="seasoning">Seasoning</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Default unit
              <input
                maxLength={30}
                placeholder="g, ml, piece"
                type="text"
                value={ingredientDraft.defaultUnit}
                onChange={(event) =>
                  updateIngredientDraft("defaultUnit", event.target.value)
                }
              />
            </label>

            {createIngredientMutation.isError ? (
              <p className="form-error">Unable to create ingredient.</p>
            ) : null}

            <button disabled={createIngredientMutation.isPending} type="submit">
              {createIngredientMutation.isPending
                ? "Creating..."
                : "Create ingredient"}
            </button>
          </form>
          <div className="section-divider"/>

          <div className="section-heading">
            <p className="eyebrow">Recipe ingredients</p>
            <h2>Add ingredient to recipe</h2>
          </div>

          <form className="recipe-form" onSubmit={handleCreateRecipeIngredient}>
            <label>
              Recipe
              <select
                required
                value={recipeIngredientDraft.recipeId}
                onChange={(event) =>
                  updateRecipeIngredientDraft("recipeId", event.target.value)
                }
              >
                <option value="">Choose a recipe</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Ingredient
              <select
                required
                value={recipeIngredientDraft.ingredientId}
                onChange={(event) => {
                  const ingredient = ingredients.find(
                    (currentIngredient) =>
                      currentIngredient.id === Number(event.target.value),
                  );

                  updateRecipeIngredientDraft("ingredientId", event.target.value);
                  updateRecipeIngredientDraft(
                    "unit",
                    ingredient?.defaultUnit ?? recipeIngredientDraft.unit,
                  );
                }}
              >
                <option value="">Choose an ingredient</option>
                {ingredients.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-row">
              <label>
                Quantity
                <input
                  min="0.01"
                  required
                  step="0.01"
                  type="number"
                  value={recipeIngredientDraft.quantity}
                  onChange={(event) =>
                    updateRecipeIngredientDraft("quantity", event.target.value)
                  }
                />
              </label>

              <label>
                Unit
                <input
                  maxLength={30}
                  required
                  type="text"
                  value={recipeIngredientDraft.unit}
                  onChange={(event) =>
                    updateRecipeIngredientDraft("unit", event.target.value)
                  }
                />
              </label>
            </div>

            <label>
              Note
              <input
                maxLength={160}
                type="text"
                value={recipeIngredientDraft.note}
                onChange={(event) =>
                  updateRecipeIngredientDraft("note", event.target.value)
                }
              />
            </label>

            {createRecipeIngredientMutation.isError ? (
              <p className="form-error">Unable to add ingredient to recipe.</p>
            ) : null}

            <button
              disabled={
                createRecipeIngredientMutation.isPending ||
                recipes.length === 0 ||
                ingredients.length === 0
              }
              type="submit"
            >
              {createRecipeIngredientMutation.isPending
                ? "Adding..."
                : "Add to recipe"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Library</p>
            <h2>Available recipes</h2>
          </div>

          {recipesQuery.isLoading ? (
            <p className="status-text">Loading recipes...</p>
          ) : null}

          {recipesQuery.isError ? (
            <p className="form-error">Unable to load recipes.</p>
          ) : null}

          {!recipesQuery.isLoading && recipes.length === 0 ? (
            <p className="status-text">No recipes yet.</p>
          ) : null}

          <div className="recipe-list">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <div className="recipe-card-header">
                  <div>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description || "No description yet."}</p>
                  </div>

                  <span className="recipe-card-badge">
                    {recipe.isPublic ? "Public" : "Private"}
                  </span>
                </div>

                <div className="recipe-card-meta">
                  <span>{recipe.servings} servings</span>
                  <span>{recipe.totalMinutes} min</span>
                  <span>{formatDifficulty(recipe.difficulty)}</span>
                  <span>By {recipe.ownerUsername}</span>
                </div>

                {recipe.tags.length > 0 ? (
                  <div className="tag-list">
                    {recipe.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
                {recipe.ingredients.length > 0 ? (
                  <div className="recipe-ingredient-list">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient.id}>
        {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
      </span>
                    ))}
                  </div>
                ) : (
                  <p className="status-text">No ingredients yet.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
