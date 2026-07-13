import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {listShoppingLists, type ShoppingList, type ShoppingListStatus, updateShoppingListItem,} from "../api/shopping";

const emptyShoppingLists: ShoppingList[] = [];

function formatStatus(status: ShoppingListStatus): string {
  const labels: Record<ShoppingListStatus, string> = {
    active: "Active",
    completed: "Completed",
    archived: "Archived",
  };

  return labels[status];
}

export function ShoppingPage() {
  const queryClient = useQueryClient();

  const shoppingListsQuery = useQuery({
    queryKey: ["shoppingLists"],
    queryFn: listShoppingLists,
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
                   id,
                   isChecked,
                 }: {
      id: number;
      isChecked: boolean;
    }) => updateShoppingListItem(id, {is_checked: isChecked}),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["shoppingLists"]});
    },
  });

  const shoppingLists = shoppingListsQuery.data ?? emptyShoppingLists;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Shopping</p>
          <h1>Generated Shopping Lists</h1>
          <p>
            Review ingredients generated from meal plans and mark items as
            purchased.
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading">
          <p className="eyebrow">Lists</p>
          <h2>Your shopping lists</h2>
        </div>

        {shoppingListsQuery.isLoading ? (
          <p className="status-text">Loading shopping lists...</p>
        ) : null}

        {shoppingListsQuery.isError ? (
          <p className="form-error">Unable to load shopping lists.</p>
        ) : null}

        {!shoppingListsQuery.isLoading && shoppingLists.length === 0 ? (
          <p className="status-text">
            No shopping lists yet. Generate one from a meal plan.
          </p>
        ) : null}

        <div className="shopping-list-grid">
          {shoppingLists.map((shoppingList) => (
            <article className="shopping-list-card" key={shoppingList.id}>
              <div className="recipe-card-header">
                <div>
                  <h3>{shoppingList.name}</h3>
                  <p>{shoppingList.items.length} items to review</p>
                </div>

                <span className="recipe-card-badge">
                  {formatStatus(shoppingList.status)}
                </span>
              </div>

              {shoppingList.items.length > 0 ? (
                <div className="shopping-item-list">
                  {shoppingList.items.map((item) => (
                    <label className="shopping-item" key={item.id}>
                      <input
                        checked={item.isChecked}
                        type="checkbox"
                        onChange={(event) =>
                          updateItemMutation.mutate({
                            id: item.id,
                            isChecked: event.target.checked,
                          })
                        }
                      />

                      <span>
                        <strong>{item.ingredientName}</strong>
                        {item.quantity} {item.unit}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="status-text">Nothing to buy for this plan.</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
