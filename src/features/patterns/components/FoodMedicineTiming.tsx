import {
  ArrowDown,
  ArrowUp,
  CircleHelp,
  Clock3,
  Link2,
  Minus,
  Pill,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type { FoodDetailReport } from "../foodDetail.types";

import { buildMedicineTimingReport } from "../medicineTiming.engine";

import type {
  MedicineTimingComparisonStatus,
  MedicineTimingStats,
} from "../medicineTiming.types";

import "./FoodMedicineTiming.css";

interface FoodMedicineTimingProps {
  report: FoodDetailReport;
}

const statusLabels: Record<MedicineTimingComparisonStatus, string> = {
  no_exposure: "Sin exposiciones",

  inseparable: "No se puede separar",

  insufficient: "Pocos datos",

  higher: "Mayor frecuencia",

  similar: "Diferencia pequeña",

  lower: "Menor frecuencia",
};

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function difference(value: number | null) {
  if (value === null) {
    return "—";
  }

  const pp = Math.round(value * 100);

  return `${pp > 0 ? "+" : ""}${pp} pp`;
}

function statusIcon(status: MedicineTimingComparisonStatus) {
  switch (status) {
    case "higher":
      return <ArrowUp size={15} />;

    case "lower":
      return <ArrowDown size={15} />;

    case "similar":
      return <Minus size={15} />;

    case "inseparable":
      return <Link2 size={15} />;

    default:
      return <CircleHelp size={15} />;
  }
}

function RateBox({
  label,
  stats,
  timing,
}: {
  label: string;

  stats: MedicineTimingStats;

  timing?: string | null;
}) {
  return (
    <span>
      <small>{label}</small>

      <strong>
        {stats.evaluableExposures > 0 ? percent(stats.adverseRate) : "—"}
      </strong>

      <em>
        {stats.adverseExposures}/{stats.evaluableExposures} evaluables
      </em>

      {timing ? <i>{timing}</i> : null}
    </span>
  );
}

export function FoodMedicineTiming({ report }: FoodMedicineTimingProps) {
  const analysis = buildMedicineTimingReport(report);

  if (analysis.factors.length === 0) {
    return null;
  }

  return (
    <section className="food-medicine-timing-section">
      <div className="food-medicine-timing-heading">
        <span>Momento de la Medicina</span>

        <h2>¿Aparece antes o después de la comida?</h2>

        <p>
          Miramos hasta {analysis.preWindowHours} horas antes y conservamos la
          ventana efectiva posterior a la comida. Es una clasificación temporal,
          no farmacológica.
        </p>
      </div>

      <div className="food-medicine-timing-list">
        {analysis.factors.map((factor) => (
          <Card key={factor.medicineId} className="food-medicine-timing-card">
            <div className="food-medicine-timing-card__header">
              <span className="food-medicine-timing-card__icon">
                <Pill size={19} />
              </span>

              <div>
                <span>Medicamento</span>

                <h3>{factor.medicineName}</h3>
              </div>
            </div>

            <div className="food-medicine-timing-rates">
              <RateBox
                label={`Antes (≤ ${analysis.preWindowHours} h)`}
                stats={factor.beforeOnly}
                timing={
                  factor.medianBeforeHours === null
                    ? null
                    : `mediana ${factor.medianBeforeHours.toFixed(1)} h antes`
                }
              />

              <RateBox
                label="Después"
                stats={factor.afterOnly}
                timing={
                  factor.medianAfterHours === null
                    ? null
                    : `mediana ${factor.medianAfterHours.toFixed(1)} h después`
                }
              />

              <RateBox
                label={`Sin ${factor.medicineName}`}
                stats={factor.none}
              />
            </div>

            <div className="food-medicine-timing-comparisons">
              <div>
                <span>Antes vs sin</span>

                <strong>{difference(factor.beforeDifference)}</strong>

                <em data-status={factor.beforeStatus}>
                  {statusIcon(factor.beforeStatus)}

                  {statusLabels[factor.beforeStatus]}
                </em>
              </div>

              <div>
                <span>Después vs sin</span>

                <strong>{difference(factor.afterDifference)}</strong>

                <em data-status={factor.afterStatus}>
                  {statusIcon(factor.afterStatus)}

                  {statusLabels[factor.afterStatus]}
                </em>
              </div>
            </div>

            <div className="food-medicine-timing-counts">
              <span>
                <Clock3 size={14} />
                Antes: {factor.beforeIntakeCount}{" "}
                {factor.beforeIntakeCount === 1 ? "toma" : "tomas"}
              </span>

              <span>
                <Clock3 size={14} />
                Después: {factor.afterIntakeCount}{" "}
                {factor.afterIntakeCount === 1 ? "toma" : "tomas"}
              </span>
            </div>

            {factor.both.totalExposures > 0 ? (
              <p className="food-medicine-timing-both">
                En <strong>{factor.both.totalExposures}</strong>{" "}
                {factor.both.totalExposures === 1
                  ? "exposición hubo"
                  : "exposiciones hubo"}{" "}
                {factor.medicineName} tanto antes como después. Esas
                exposiciones se mantienen separadas de las comparaciones
                principales.
              </p>
            ) : null}
          </Card>
        ))}
      </div>

      <Card className="food-medicine-timing-method">
        <strong>Qué significa “antes”</strong>

        <p>
          Es una ventana fija de {analysis.preWindowHours} horas previas. No
          intenta estimar cuánto tiempo permanece activo un medicamento.
        </p>

        <p>
          Una misma toma puede quedar cerca de más de una comida si las comidas
          están muy próximas. Por ahora se conserva como contexto temporal.
        </p>

        <p>
          Estas diferencias describen registros; no demuestran que el
          medicamento cause, prevenga o modifique la respuesta.
        </p>
      </Card>
    </section>
  );
}
