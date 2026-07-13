import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type FormEvent, useMemo, useState} from "react";

import {
  createMealPlan,
  createMealPlanItem,
  generateShoppingListFromMealPlan,
  listMealPlans,
  type MealPlan,
  type MealType,
} from "../api/mealPlans";
import {listRecipes, type Recipe} from "../api/recipes";

interface MealPlanFormState {
  name: string;
  startDate: string;
  endDate: string;
}

interface MealPlanItemFormState {
  mealPlanId: string;
  recipeId: string;
  plannedDate: string;
  mealType: MealType;
  servings: number;
  note: string;
}

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

const today = new Date();

const defaultMealPlanForm: MealPlanFormState = {
  name: "Weekly Meal Plan",
  startDate: formatDateInput(today),
  endDate: formatDateInput(addDays(today, 6)),
};

const defaultMealPlanItemForm: MealPlanItemFormState = {
  mealPlanId: "",
  recipeId: "",
  plannedDate: formatDateInput(today),
  mealType: "dinner",
  servings: 2,
  note: "",
};

const emptyMealPlans: MealPlan[] = [];
const emptyRecipes: Recipe[] = [];

function formatMealType(mealType: MealType): string {
  const labels: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  return labels[mealType];
}

export function MealPlanPage() {
  const queryClient = useQueryClient();
  const [mealPlanDraft, setMealPlanDraft] = useState(defaultMealPlanForm);
  const [mealPlanItemDraft, setMealPlanItemDraft] = useState(
    defaultMealPlanItemForm,
  );

  const mealPlansQuery = useQuery({
    queryKey: ["mealPlans"],
    queryFn: listMealPlans,
  });

  const recipesQuery = useQuery({
    queryKey: ["recipes"],
    queryFn: listRecipes,
  });

  const mealPlans = mealPlansQuery.data ?? emptyMealPlans;
  const recipes = recipesQuery.data ?? emptyRecipes;

  const latestMealPlanId = useMemo(() => {
    return mealPlans.length > 0 ? String(mealPlans[0].id) : "";
  }, [mealPlans]);

  const createMealPlanMutation = useMutation({
    mutationFn: createMealPlan,
    onSuccess: async (mealPlan) => {
      setMealPlanDraft(defaultMealPlanForm);
      setMealPlanItemDraft((currentDraft) => ({
        ...currentDraft,
        mealPlanId: String(mealPlan.id),
        plannedDate: mealPlan.startDate,
      }));
      await queryClient.invalidateQueries({queryKey: ["mealPlans"]});
    },
  });

  const createMealPlanItemMutation = useMutation({
    mutationFn: createMealPlanItem,
    onSuccess: async () => {
      setMealPlanItemDraft((currentDraft) => ({
        ...currentDraft,
        recipeId: "",
        note: "",
      }));
      await queryClient.invalidateQueries({queryKey: ["mealPlans"]});
    },
  });

  const generateShoppingListMutation = useMutation({
    mutationFn: (mealPlanId: number) =>
      generateShoppingListFromMealPlan(mealPlanId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["shoppingLists"]});
    },
  });

  async function handleCreateMealPlan(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await createMealPlanMutation.mutateAsync({
      name: mealPlanDraft.name.trim(),
      start_date: mealPlanDraft.startDate,
      end_date: mealPlanDraft.endDate,
    });
  }

  async function handleCreateMealPlanItem(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const selectedMealPlanId = mealPlanItemDraft.mealPlanId || latestMealPlanId;

    await createMealPlanItemMutation.mutateAsync({
      meal_plan: Number(selectedMealPlanId),
      recipe: Number(mealPlanItemDraft.recipeId),
      planned_date: mealPlanItemDraft.plannedDate,
      meal_type: mealPlanItemDraft.mealType,
      servings: mealPlanItemDraft.servings,
      note: mealPlanItemDraft.note.trim(),
    });
  }

  function updateMealPlanDraft<TField extends keyof MealPlanFormState>(
    field: TField,
    value: MealPlanFormState[TField],
  ): void {
    setMealPlanDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function updateMealPlanItemDraft<TField extends keyof MealPlanItemFormState>(
    field: TField,
    value: MealPlanItemFormState[TField],
  ): void {
    setMealPlanItemDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  const selectedMealPlanValue = mealPlanItemDraft.mealPlanId || latestMealPlanId;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Meal Plan</p>
          <h1>Weekly Meal Planner</h1>
          <p>
            Build a date-range meal plan and schedule recipes into daily meal
            slots.
          </p>
        </div>
      </header>

      <div className="content-layout">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">New plan</p>
            <h2>Create meal plan</h2>
          </div>

          <form className="meal-plan-form" onSubmit={handleCreateMealPlan}>
            <label>
              Name
              <input
                maxLength={160}
                required
                type="text"
                value={mealPlanDraft.name}
                onChange={(event) =>
                  updateMealPlanDraft("name", event.target.value)
                }
              />
            </label>

            <div className="form-row">
              <label>
                Start date
                <input
                  required
                  type="date"
                  value={mealPlanDraft.startDate}
                  onChange={(event) =>
                    updateMealPlanDraft("startDate", event.target.value)
                  }
                />
              </label>

              <label>
                End date
                <input
                  required
                  type="date"
                  value={mealPlanDraft.endDate}
                  onChange={(event) =>
                    updateMealPlanDraft("endDate", event.target.value)
                  }
                />
              </label>
            </div>

            {createMealPlanMutation.isError ? (
              <p className="form-error">Unable to create meal plan.</p>
            ) : null}

            <button disabled={createMealPlanMutation.isPending} type="submit">
              {createMealPlanMutation.isPending ? "Creating..." : "Create plan"}
            </button>
          </form>

          <div className="section-divider"/>

          <div className="section-heading">
            <p className="eyebrow">Schedule</p>
            <h2>Add planned meal</h2>
          </div>

          <form className="meal-plan-form" onSubmit={handleCreateMealPlanItem}>
            <label>
              Meal plan
              <select
                required
                value={selectedMealPlanValue}
                onChange={(event) =>
                  updateMealPlanItemDraft("mealPlanId", event.target.value)
                }
              >
                <option value="">Choose a meal plan</option>
                {mealPlans.map((mealPlan) => (
                  <option key={mealPlan.id} value={mealPlan.id}>
                    {mealPlan.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Recipe
              <select
                required
                value={mealPlanItemDraft.recipeId}
                onChange={(event) =>
                  updateMealPlanItemDraft("recipeId", event.target.value)
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

            <div className="form-row">
              <label>
                Planned date
                <input
                  required
                  type="date"
                  value={mealPlanItemDraft.plannedDate}
                  onChange={(event) =>
                    updateMealPlanItemDraft("plannedDate", event.target.value)
                  }
                />
              </label>

              <label>
                Meal type
                <select
                  value={mealPlanItemDraft.mealType}
                  onChange={(event) =>
                    updateMealPlanItemDraft(
                      "mealType",
                      event.target.value as MealType,
                    )
                  }
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </label>
            </div>

            <label>
              Servings
              <input
                min={1}
                required
                type="number"
                value={mealPlanItemDraft.servings}
                onChange={(event) =>
                  updateMealPlanItemDraft("servings", Number(event.target.value))
                }
              />
            </label>

            <label>
              Note
              <input
                maxLength={255}
                type="text"
                value={mealPlanItemDraft.note}
                onChange={(event) =>
                  updateMealPlanItemDraft("note", event.target.value)
                }
              />
            </label>

            {createMealPlanItemMutation.isError ? (
              <p className="form-error">Unable to add planned meal.</p>
            ) : null}

            <button
              disabled={
                createMealPlanItemMutation.isPending ||
                mealPlans.length === 0 ||
                recipes.length === 0
              }
              type="submit"
            >
              {createMealPlanItemMutation.isPending
                ? "Adding..."
                : "Add planned meal"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Plans</p>
            <h2>Your meal plans</h2>
          </div>

          {mealPlansQuery.isLoading || recipesQuery.isLoading ? (
            <p className="status-text">Loading meal plans...</p>
          ) : null}

          {mealPlansQuery.isError ? (
            <p className="form-error">Unable to load meal plans.</p>
          ) : null}

          {!mealPlansQuery.isLoading && mealPlans.length === 0 ? (
            <p className="status-text">No meal plans yet.</p>
          ) : null}

          <div className="meal-plan-list">
            {mealPlans.map((mealPlan) => (
              <article className="meal-plan-card" key={mealPlan.id}>
                <div className="recipe-card-header">
                  <div>
                    <h3>{mealPlan.name}</h3>
                    <p>
                      {mealPlan.startDate} to {mealPlan.endDate}
                    </p>
                  </div>

                  <span className="recipe-card-badge">
                    {mealPlan.items.length} meals
                  </span>
                  <button
                    className="secondary-action-button"
                    disabled={
                      mealPlan.items.length === 0 || generateShoppingListMutation.isPending
                    }
                    type="button"
                    onClick={() => generateShoppingListMutation.mutate(mealPlan.id)}
                  >
                    Generate shopping list
                  </button>
                </div>

                {mealPlan.items.length > 0 ? (
                  <div className="planned-meal-list">
                    {mealPlan.items.map((item) => (
                      <div className="planned-meal" key={item.id}>
                        <strong>{item.recipeTitle}</strong>
                        <span>
                          {item.plannedDate} · {formatMealType(item.mealType)} ·{" "}
                          {item.servings} servings
                        </span>
                        {item.note ? <p>{item.note}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="status-text">No meals scheduled yet.</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
