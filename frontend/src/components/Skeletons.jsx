export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-sm" />
      <div className="skeleton-line skeleton-lg" />
      <div className="skeleton-line skeleton-md" />
      <div className="skeleton-line skeleton-full" />
      <div className="skeleton-line skeleton-full" />
      <div className="skeleton-line skeleton-half" />
    </div>
  );
}

export function SchemeGridSkeleton({ count = 6 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 20,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div className="skeleton-line skeleton-sm" style={{ marginBottom: 20 }} />
      <div
        className="skeleton-line skeleton-lg"
        style={{ height: 32, marginBottom: 12 }}
      />
      <div className="skeleton-line skeleton-md" style={{ marginBottom: 32 }} />
      <div className="skeleton-line skeleton-full" />
      <div className="skeleton-line skeleton-full" />
      <div className="skeleton-line skeleton-half" />
    </div>
  );
}