import { Activity, Scale, ShieldQuestion, Users } from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type {
  AssociationStability,
  FoodAssociation,
} from "../association.types";

import "./FoodEffectMetrics.css";

interface FoodEffectMetricsProps {
  association: FoodAssociation;
}

const stabilityLabels: Record<AssociationStability, string> = {
  insufficient: "No estimable",

  low: "Baja",

  medium: "Media",

  high: "Alta",
};

function formatDifference(value: number) {
  const pp = Math.round(value * 100);

  if (pp > 0) {
    return `+${pp} pp`;
  }

  return `${pp} pp`;
}

function formatRelativeRisk(association: FoodAssociation) {
  if (association.relativeRisk !== null) {
    return `${association.relativeRisk.toFixed(2)}×`;
  }

  if (association.comparisonSource !== "food_absent") {
    return "—";
  }

  if (association.baselineAdverseRate === 0 && association.adverseRate > 0) {
    return "No estimable";
  }

  return "—";
}

export function FoodEffectMetrics({ association }: FoodEffectMetricsProps) {
  const stabilityPercent =
    association.stabilityScore === null
      ? null
      : Math.round(association.stabilityScore * 100);

  return (
    <section className="food-effect-section">
      <div className="food-effect-heading">
        <span>Magnitud y robustez</span>

        <h2>¿Qué tan grande y estable es la diferencia?</h2>

        <p>
          Estas métricas describen sus registros. No convierten una asociación
          temporal en causalidad.
        </p>
      </div>

      <div className="food-effect-grid">
        <Card className="food-effect-card">
          <Scale size={20} />

          <span>Diferencia absoluta</span>

          <strong>
            {formatDifference(association.absoluteRiskDifference)}
          </strong>

          <small>alimento menos comparación</small>
        </Card>

        <Card className="food-effect-card">
          <Activity size={20} />

          <span>RR descriptivo</span>

          <strong>{formatRelativeRisk(association)}</strong>

          <small>razón de tasas observadas</small>
        </Card>

        <Card className="food-effect-card">
          <Users size={20} />

          <span>Muestra</span>

          <strong>
            {association.evaluableExposures} vs{" "}
            {association.comparisonEvaluableExposures}
          </strong>

          <small>alimento vs comparación</small>
        </Card>

        <Card className="food-effect-card">
          <ShieldQuestion size={20} />

          <span>Estabilidad</span>

          <strong data-stability={association.stability}>
            {stabilityLabels[association.stability]}
          </strong>

          <small>
            {stabilityPercent === null
              ? "sin control separado o muestra insuficiente"
              : `${stabilityPercent}% leave-one-out`}
          </small>
        </Card>
      </div>

      <Card className="food-effect-explanation">
        <strong>Cómo leer estas métricas</strong>

        <p>
          <b>Diferencia absoluta:</b> resta la tasa del comparador a la tasa del
          alimento. Por ejemplo, 75% frente a 25% equivale a +50 puntos
          porcentuales.
        </p>

        <p>
          <b>RR descriptivo:</b> divide ambas tasas. Sólo se muestra cuando
          existe un grupo separado de comidas sin el alimento y su tasa es mayor
          que cero.
        </p>

        <p>
          <b>Estabilidad:</b> retira una exposición evaluable a la vez y
          comprueba si la categoría de señal permanece igual. No es un intervalo
          de confianza ni una prueba estadística de causalidad.
        </p>
      </Card>
    </section>
  );
}
