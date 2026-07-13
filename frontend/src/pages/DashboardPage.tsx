import {MetricCard} from "../components/MetricCard";

const workflowSteps = [
  {
    title: "Create recipes",
    description: "Store ingredients, servings, difficulty, and ordered steps.",
  },
  {
    title: "Plan the week",
    description: "Schedule recipes into breakfast, lunch, dinner, or snack slots.",
  },
  {
    title: "Generate groceries",
    description: "Aggregate recipe ingredients and subtract pantry quantities.",
  },
];

export function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Portfolio MVP</p>
          <h1>Meal planning dashboard</h1>
          <p>
            A full-stack workflow for recipes, weekly meal plans, pantry tracking,
            and generated shopping lists.
          </p>
        </div>
      </header>

      <section className="metric-grid" aria-label="Project status">
        <MetricCard
          label="Core workflow"
          value="4 steps"
          helperText="Recipe, meal plan, pantry, shopping list"
        />
        <MetricCard
          label="Backend"
          value="DRF API"
          helperText="JWT authentication and OpenAPI docs"
        />
        <MetricCard
          label="Database"
          value="PostgreSQL"
          helperText="Relational models with user ownership"
        />
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Interview demo path</p>
          <h2>From recipe to grocery list</h2>
        </div>

        <div className="workflow-list">
          {workflowSteps.map((step, index) => (
            <article className="workflow-item" key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
