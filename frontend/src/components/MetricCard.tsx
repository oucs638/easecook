interface MetricCardProps {
  label: string;
  value: string;
  helperText: string;
}

export function MetricCard({label, value, helperText}: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{helperText}</p>
    </article>
  );
}
