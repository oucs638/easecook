import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type FormEvent, useState} from "react";

import {createRecipe, type CreateRecipePayload, listRecipes, type RecipeDifficulty,} from "../api/recipes";

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

  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: listRecipes,
  });

  const createRecipeMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: async () => {
      setDraftRecipe(defaultRecipeForm);
      await queryClient.invalidateQueries({queryKey: ["recipes"]});
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await createRecipeMutation.mutateAsync(buildCreateRecipePayload(draftRecipe));
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

  const recipes = recipesQuery.data ?? [];

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
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
