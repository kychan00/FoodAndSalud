import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Minus,
  Waves,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../../components/ui/Card";

import { buildTemporalPersistenceReport } from "../temporal.engine";

import type { FoodDetailReport } from "../foodDetail.types";

import type { TemporalPersistenceStatus } from "../temporal.types";

import "./FoodTemporalPersistence.css";

interface FoodTemporalPersistenceProps {
  report: FoodDetailReport;

  timeZone?: string;
}

const statusLabels: Record<TemporalPersistenceStatus, string> = {
  insufficient: "Datos insuficientes",

  persistent: "Persistente",

  recent: "Más reciente",

  weakened: "Se debilitó",

  stable: "Estable",

  variable: "Variable",
};

const statusDescriptions: Record<TemporalPersistenceStatus, string> = {
  insufficient:
    "Todavía no existen suficientes exposiciones evaluables del alimento y de su comparación en ambas mitades del historial.",

  persistent:
    "La diferencia observada aparece tanto en la mitad anterior como en la mitad reciente del historial.",

  recent:
    "La diferencia era pequeña en la mitad anterior y aparece con mayor claridad en la mitad reciente.",

  weakened:
    "La diferencia era clara en la mitad anterior y disminuyó en la mitad reciente.",

  stable:
    "La diferencia entre alimento y comparación cambió poco entre ambos periodos.",

  variable:
    "La magnitud cambió entre periodos, pero no sigue un patrón simple de aparición o debilitamiento.",
};

function getIcon(status: TemporalPersistenceStatus) {
  switch (status) {
    case "persistent":
      return <Waves size={18} />;

    case "recent":
      return <ArrowUpRight size={18} />;

    case "weakened":
      return <ArrowDownRight size={18} />;

    case "stable":
      return <Minus size={18} />;

    case "variable":
      return <Activity size={18} />;

    default:
      return <Clock3 size={18} />;
  }
}

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

function createDateFormatter(timeZone?: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",

    month: "short",

    ...(timeZone
      ? {
          timeZone,
        }
      : {}),
  });
}

export function FoodTemporalPersistence({
  report,
  timeZone,
}: FoodTemporalPersistenceProps) {
  const temporal = buildTemporalPersistenceReport(report);

  const dateFormatter = createDateFormatter(timeZone);

  const data = [temporal.older, temporal.recent].map((period) => ({
    period: period.id === "older" ? "Anterior" : "Reciente",

    food:
      period.foodEvaluableExposures > 0
        ? Math.round(period.foodAdverseRate * 100)
        : null,

    comparison:
      period.comparisonEvaluableExposures > 0
        ? Math.round(period.comparisonAdverseRate * 100)
        : null,

    foodEvaluable: period.foodEvaluableExposures,

    foodAdverse: period.foodAdverseExposures,

    comparisonEvaluable: period.comparisonEvaluableExposures,

    comparisonAdverse: period.comparisonAdverseExposures,
  }));

  return (
    <section className="food-temporal-section">
      <div className="food-temporal-heading">
        <span>Evolución temporal</span>

        <h2>¿El patrón se mantiene con el tiempo?</h2>

        <p>
          El historial de comidas se divide cronológicamente en dos mitades para
          comparar el periodo anterior con el más reciente.
        </p>
      </div>

      <Card className="food-temporal-status">
        <div
          className="food-temporal-status__icon"
          data-status={temporal.status}
        >
          {getIcon(temporal.status)}
        </div>

        <div>
          <span>Persistencia</span>

          <strong data-status={temporal.status}>
            {statusLabels[temporal.status]}
          </strong>

          <p>{statusDescriptions[temporal.status]}</p>
        </div>
      </Card>

      <Card className="food-temporal-chart">
        <div className="food-temporal-chart__legend">
          <span>
            <i className="food-temporal-chart__food" />

            {report.foodName}
          </span>

          <span>
            <i className="food-temporal-chart__comparison" />
            Comidas sin {report.foodName}
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            margin={{
              top: 15,

              right: 12,

              bottom: 5,

              left: -12,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.28}
            />

            <XAxis dataKey="period" />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const point = payload[0]?.payload as
                  | {
                      period: string;

                      food: number | null;

                      comparison: number | null;

                      foodEvaluable: number;

                      foodAdverse: number;

                      comparisonEvaluable: number;

                      comparisonAdverse: number;
                    }
                  | undefined;

                if (!point) {
                  return null;
                }

                return (
                  <div className="food-chart-tooltip">
                    <strong>{point.period}</strong>

                    <span>
                      {report.foodName}:{" "}
                      {point.food === null ? "No evaluable" : `${point.food}%`}
                    </span>

                    <span>
                      {point.foodAdverse} de {point.foodEvaluable} evaluables
                    </span>

                    <span>
                      Comparación:{" "}
                      {point.comparison === null
                        ? "No evaluable"
                        : `${point.comparison}%`}
                    </span>

                    <span>
                      {point.comparisonAdverse} de {point.comparisonEvaluable}{" "}
                      evaluables
                    </span>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="food"
              fill="var(--color-insight)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />

            <Bar
              dataKey="comparison"
              fill="var(--color-food)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="food-temporal-periods">
        {[temporal.older, temporal.recent].map((period) => (
          <Card key={period.id} className="food-temporal-period">
            <div>
              <span>{period.label}</span>

              <small>
                {period.startAt && period.endAt
                  ? `${dateFormatter.format(
                      new Date(period.startAt),
                    )} – ${dateFormatter.format(new Date(period.endAt))}`
                  : "Sin rango suficiente"}
              </small>
            </div>

            <div className="food-temporal-period__rates">
              <span>
                <small>{report.foodName}</small>

                <strong>
                  {period.foodEvaluableExposures > 0
                    ? percent(period.foodAdverseRate)
                    : "—"}
                </strong>

                <em>
                  {period.foodAdverseExposures}/{period.foodEvaluableExposures}
                </em>
              </span>

              <span>
                <small>Comparación</small>

                <strong>
                  {period.comparisonEvaluableExposures > 0
                    ? percent(period.comparisonAdverseRate)
                    : "—"}
                </strong>

                <em>
                  {period.comparisonAdverseExposures}/
                  {period.comparisonEvaluableExposures}
                </em>
              </span>

              <span>
                <small>Diferencia</small>

                <strong>{difference(period.absoluteRiskDifference)}</strong>
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="food-temporal-method">
        <strong>Cómo se calcula</strong>

        <p>
          Las comidas disponibles se ordenan por fecha y se dividen en dos
          mitades con un número parecido de comidas. No son necesariamente dos
          periodos con la misma cantidad de días.
        </p>

        <p>
          Para clasificar una tendencia se requieren al menos{" "}
          {temporal.minimumEvaluablePerGroup} exposiciones evaluables del
          alimento y {temporal.minimumEvaluablePerGroup} comidas comparadoras
          evaluables en cada mitad.
        </p>

        <p>
          “Persistente” describe repetición temporal del contraste observado. No
          significa que el alimento sea la causa.
        </p>
      </Card>
    </section>
  );
}
