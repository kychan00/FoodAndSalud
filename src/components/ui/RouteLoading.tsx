import "./RouteLoading.css";

export function RouteLoading() {
  return (
    <div
      className="route-loading"
      role="status"
      aria-live="polite"
      aria-label="Cargando sección"
    >
      <span className="route-loading__spinner" />

      <span>Cargando…</span>
    </div>
  );
}
