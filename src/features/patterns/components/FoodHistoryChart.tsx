import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FoodExposureHistoryItem } from "../foodDetail.types";

import "./FoodDetailCharts.css";

interface FoodHistoryChartProps {
  foodName: string;

  history: FoodExposureHistoryItem[];

  timeZone?: string;
}

function createDateFormatter(timeZone?: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",

    month: "short",

    ...(timeZone
      ? {
          timeZone,
        }
      : {}),
  });
}

function createDateTimeFormatter(timeZone?: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",

    month: "short",

    hour: "2-digit",

    minute: "2-digit",

    ...(timeZone
      ? {
          timeZone,
        }
      : {}),
  });
}

export function FoodHistoryChart({
  foodName,
  history,
  timeZone,
}: FoodHistoryChartProps) {
  const dateFormatter = createDateFormatter(timeZone);

  const dateTimeFormatter = createDateTimeFormatter(timeZone);

  const chronological = [...history].reverse();

  const data = chronological.map((item) => ({
    entryId: item.entryId,

    date: dateFormatter.format(new Date(item.eatenAt)),

    eatenAt: item.eatenAt,

    bristol: item.firstBathroom?.bristolType ?? null,

    occurredAt: item.firstBathroom?.occurredAt ?? null,

    urgency: item.firstBathroom?.urgency ?? null,

    pain: item.firstBathroom?.painLevel ?? null,

    elapsed: item.firstBathroom?.elapsedHours ?? null,

    adverse: item.firstBathroom?.adverse ?? false,

    coFoods: item.coFoods.map((coFood) => coFood.foodName),

    medicine: item.medicineOverlap,
  }));

  const width = Math.max(620, data.length * 88);

  return (
    <section className="food-detail-chart">
      <div className="food-detail-chart__header">
        <span>Historial</span>

        <h2>Bristol después de {foodName}</h2>

        <p>
          Cada punto representa la primera evacuación registrada dentro de las
          24 horas posteriores.
        </p>
      </div>

      <div className="food-detail-chart__scroll">
        <div
          style={{
            width,
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 24,
                bottom: 55,
                left: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.3}
              />

              <ReferenceArea
                y1={3}
                y2={5}
                fill="var(--color-success)"
                fillOpacity={0.08}
              />

              <XAxis
                dataKey="date"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={65}
              />

              <YAxis
                domain={[1, 7]}
                ticks={[1, 2, 3, 4, 5, 6, 7]}
                allowDecimals={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const point = payload[0]?.payload as
                    | {
                        eatenAt: string;

                        bristol: number | null;

                        urgency: number | null;

                        pain: number | null;

                        elapsed: number | null;

                        coFoods: string[];

                        medicine: boolean;
                      }
                    | undefined;

                  if (!point) {
                    return null;
                  }

                  return (
                    <div className="food-chart-tooltip">
                      <strong>
                        {dateTimeFormatter.format(new Date(point.eatenAt))}
                      </strong>

                      {point.bristol === null ? (
                        <span>Sin evacuación registrada dentro de 24 h</span>
                      ) : (
                        <>
                          <span>Bristol {point.bristol}</span>

                          <span>{point.elapsed?.toFixed(1)} h después</span>

                          <span>
                            Urgencia {point.urgency ?? 0} · Dolor{" "}
                            {point.pain ?? 0}
                          </span>
                        </>
                      )}

                      {point.coFoods.length > 0 ? (
                        <span>También: {point.coFoods.join(", ")}</span>
                      ) : null}

                      {point.medicine ? (
                        <span className="food-chart-tooltip__medicine">
                          Medicina presente en la ventana
                        </span>
                      ) : null}
                    </div>
                  );
                }}
              />

              <Line
                type="linear"
                dataKey="bristol"
                stroke="var(--color-bathroom)"
                strokeWidth={3}
                connectNulls={false}
                dot={{
                  r: 5,

                  fill: "var(--surface-card)",

                  stroke: "var(--color-bathroom)",

                  strokeWidth: 3,
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="food-detail-chart__footnote">
        Las exposiciones sin evacuación posterior permanecen sin evaluar; no se
        consideran automáticamente resultados normales.
      </p>
    </section>
  );
}
