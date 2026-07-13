interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({title, description}: PlaceholderPageProps) {
  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <p className="eyebrow">Coming next</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
    </div>
  );
}
