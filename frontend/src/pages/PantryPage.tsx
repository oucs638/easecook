import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {type FormEvent, useState} from "react";

import {type Ingredient, listIngredients} from "../api/recipes";
import {createPantryItem, listPantryItems, type PantryItem,} from "../api/shopping";

interface PantryFormState {
  ingredientId: string;
  quantity: string;
  unit: string;
  expirationDate: string;
  note: string;
}

const defaultPantryForm: PantryFormState = {
  ingredientId: "",
  quantity: "1.00",
  unit: "",
  expirationDate: "",
  note: "",
};

const emptyIngredients: Ingredient[] = [];
const emptyPantryItems: PantryItem[] = [];

export function PantryPage() {
  const queryClient = useQueryClient();
  const [pantryDraft, setPantryDraft] = useState(defaultPantryForm);

  const ingredientsQuery = useQuery({
    queryKey: ["ingredients"],
    queryFn: listIngredients,
  });

  const pantryItemsQuery = useQuery({
    queryKey: ["pantryItems"],
    queryFn: listPantryItems,
  });

  const createPantryItemMutation = useMutation({
    mutationFn: createPantryItem,
    onSuccess: async () => {
      setPantryDraft(defaultPantryForm);
      await queryClient.invalidateQueries({queryKey: ["pantryItems"]});
    },
  });

  const ingredients = ingredientsQuery.data ?? emptyIngredients;
  const pantryItems = pantryItemsQuery.data ?? emptyPantryItems;

  async function handleCreatePantryItem(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    await createPantryItemMutation.mutateAsync({
      ingredient: Number(pantryDraft.ingredientId),
      quantity: pantryDraft.quantity,
      unit: pantryDraft.unit.trim(),
      expiration_date: pantryDraft.expirationDate || null,
      note: pantryDraft.note.trim(),
    });
  }

  function updatePantryDraft<TField extends keyof PantryFormState>(
    field: TField,
    value: PantryFormState[TField],
  ): void {
    setPantryDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pantry</p>
          <h1>Pantry Inventory</h1>
          <p>
            Track ingredients already available at home so generated shopping
            lists only include what still needs to be bought.
          </p>
        </div>
      </header>

      <div className="content-layout">
        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Inventory</p>
            <h2>Add pantry item</h2>
          </div>

          <form className="pantry-form" onSubmit={handleCreatePantryItem}>
            <label>
              Ingredient
              <select
                required
                value={pantryDraft.ingredientId}
                onChange={(event) => {
                  const ingredient = ingredients.find(
                    (currentIngredient) =>
                      currentIngredient.id === Number(event.target.value),
                  );

                  updatePantryDraft("ingredientId", event.target.value);
                  updatePantryDraft(
                    "unit",
                    ingredient?.defaultUnit ?? pantryDraft.unit,
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
                  value={pantryDraft.quantity}
                  onChange={(event) =>
                    updatePantryDraft("quantity", event.target.value)
                  }
                />
              </label>

              <label>
                Unit
                <input
                  maxLength={30}
                  required
                  type="text"
                  value={pantryDraft.unit}
                  onChange={(event) =>
                    updatePantryDraft("unit", event.target.value)
                  }
                />
              </label>
            </div>

            <label>
              Expiration date
              <input
                type="date"
                value={pantryDraft.expirationDate}
                onChange={(event) =>
                  updatePantryDraft("expirationDate", event.target.value)
                }
              />
            </label>

            <label>
              Note
              <input
                maxLength={255}
                type="text"
                value={pantryDraft.note}
                onChange={(event) =>
                  updatePantryDraft("note", event.target.value)
                }
              />
            </label>

            {createPantryItemMutation.isError ? (
              <p className="form-error">Unable to create pantry item.</p>
            ) : null}

            <button
              disabled={
                createPantryItemMutation.isPending || ingredients.length === 0
              }
              type="submit"
            >
              {createPantryItemMutation.isPending ? "Adding..." : "Add item"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <p className="eyebrow">Available</p>
            <h2>Current pantry</h2>
          </div>

          {ingredientsQuery.isLoading || pantryItemsQuery.isLoading ? (
            <p className="status-text">Loading pantry...</p>
          ) : null}

          {pantryItemsQuery.isError ? (
            <p className="form-error">Unable to load pantry items.</p>
          ) : null}

          {!pantryItemsQuery.isLoading && pantryItems.length === 0 ? (
            <p className="status-text">No pantry items yet.</p>
          ) : null}

          <div className="pantry-list">
            {pantryItems.map((item) => (
              <article className="pantry-card" key={item.id}>
                <div>
                  <h3>{item.ingredientName}</h3>
                  <p>
                    {item.quantity} {item.unit}
                  </p>
                </div>

                {item.expirationDate ? (
                  <span className="recipe-card-badge">
                    Expires {item.expirationDate}
                  </span>
                ) : null}

                {item.note ? <p>{item.note}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
