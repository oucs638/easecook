import {MetricCard} from "../components/MetricCard";

const workflowSteps = [
  {
    title: "Build a recipe library",
    description: "Create recipes with reusable ingredients and preparation time.",
  },
  {
    title: "Plan weekly meals",
    description: "Schedule recipes by date and meal type for a clear week view.",
  },
  {
    title: "Check pantry inventory",
    description: "Record existing ingredients before generating grocery needs.",
  },
  {
    title: "Generate shopping lists",
    description: "Create focused grocery lists from planned meals and pantry gaps.",
  },
];

export function DashboardPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Interview Demo</p>
          <h1>Recipe-to-shopping workflow</h1>
          <p>
            EaseCook connects recipe management, weekly meal planning, pantry tracking,
            and generated grocery lists in one full-stack workflow.
          </p>
        </div>
      </header>

      <section className="metric-grid" aria-label="Project status">
        <MetricCard
          label="Demo path"
          value="4 screens"
          helperText="Recipes, meal plans, pantry, shopping"
        />
        <MetricCard
          label="API surface"
          value="JWT + DRF"
          helperText="Authenticated REST endpoints"
        />
        <MetricCard
          label="Data model"
          value="PostgreSQL"
          helperText="Owned relational records"
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
