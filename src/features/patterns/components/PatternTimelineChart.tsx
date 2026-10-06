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

import type { PatternQaScenario } from "../fixtures/association.fixtures";
import {
  formatQaDateTime,
  formatQaShortDate,
  formatQaTime,
} from "../fixtures/qaDate";

import "./PatternCharts.css";

interface PatternTimelineChartProps {
  scenario: PatternQaScenario;
}

interface TimelinePoint {
  id: string;
  axisLabel: string;
  dateLabel: string;
  fullDate: string;

  bristol: number;
  urgency: number;
  pain: number;

  foods: string[];
  foodLabel: string;

  medicine: boolean;
}

const WINDOW_MS = 24 * 60 * 60 * 1000;

function getFoodsBeforeBathroom(
  scenario: PatternQaScenario,
  bathroomTime: string,
) {
  const end = new Date(bathroomTime).getTime();

  const foods = scenario.input.exposures
    .filter((exposure) => {
      const start = new Date(exposure.eatenAt).getTime();

      const difference = end - start;

      return difference > 0 && difference <= WINDOW_MS;
    })
    .map((exposure) => exposure.foodName);

  return [...new Set(foods)];
}

function hasMedicineBeforeBathroom(
  scenario: PatternQaScenario,
  bathroomTime: string,
) {
  const end = new Date(bathroomTime).getTime();

  return scenario.input.medicines.some((medicine) => {
    const start = new Date(medicine.occurredAt).getTime();

    const difference = end - start;

    return difference > 0 && difference <= WINDOW_MS;
  });
}

export function PatternTimelineChart({ scenario }: PatternTimelineChartProps) {
  const data: TimelinePoint[] = [...scenario.input.bathrooms]
    .sort(
      (left, right) =>
        new Date(left.occurredAt).getTime() -
        new Date(right.occurredAt).getTime(),
    )
    .map((bathroom) => {
      const foods = getFoodsBeforeBathroom(scenario, bathroom.occurredAt);

      const medicine = hasMedicineBeforeBathroom(scenario, bathroom.occurredAt);

      const foodLabel = foods.length > 0 ? foods.join(" + ") : "Sin alimento";

      const axisFoodLabel =
        foodLabel.length > 18 ? `${foodLabel.slice(0, 16)}…` : foodLabel;

      const medicineLabel = medicine ? " + Med." : "";

      return {
        id: bathroom.id,

        axisLabel: `${formatQaShortDate(
          bathroom.occurredAt,
        )} · ${axisFoodLabel}${medicineLabel}`,

        dateLabel: formatQaShortDate(bathroom.occurredAt),

        fullDate: formatQaDateTime(bathroom.occurredAt),

        bristol: bathroom.bristolType,

        urgency: bathroom.urgency ?? 0,

        pain: bathroom.painLevel ?? 0,

        foods,
        foodLabel,

        medicine,
      };
    });

  const chartWidth = Math.max(680, data.length * 92);

  return (
    <section className="pattern-chart-card">
      <div className="pattern-chart-header">
        <div>
          <span>Secuencia temporal</span>

          <h3>Bristol por fecha</h3>
        </div>

        <span className="pattern-chart-header__range">1–7</span>
      </div>

      <p className="pattern-chart-description">
        Cada punto es una evacuación. Debajo aparece la fecha y el alimento
        registrado antes de ese evento.
      </p>

      <div className="pattern-chart-legend">
        <span>
          <i className="pattern-chart-legend__zone" />
          Bristol 3–5
        </span>

        <span>
          <i className="pattern-chart-legend__line" />
          Bristol observado
        </span>
      </div>

      <div className="pattern-chart-scroll">
        <div
          className="pattern-chart-canvas"
          style={{
            width: chartWidth,
          }}
        >
          <ResponsiveContainer width="100%" height={330}>
            <LineChart
              data={data}
              margin={{
                top: 24,
                right: 24,
                bottom: 88,
                left: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.32}
              />

              <ReferenceArea
                y1={3}
                y2={5}
                fill="var(--color-success)"
                fillOpacity={0.08}
              />

              <XAxis
                dataKey="axisLabel"
                interval={0}
                angle={-38}
                textAnchor="end"
                height={100}
                tick={{
                  fontSize: 11,
                }}
                tickMargin={10}
              />

              <YAxis
                domain={[1, 7]}
                ticks={[1, 2, 3, 4, 5, 6, 7]}
                allowDecimals={false}
                width={34}
                tick={{
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  strokeDasharray: "4 4",
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const point = payload[0]?.payload as
                    TimelinePoint | undefined;

                  if (!point) {
                    return null;
                  }

                  return (
                    <div className="pattern-chart-tooltip">
                      <strong>{point.fullDate}</strong>

                      <span>Alimento: {point.foodLabel}</span>

                      <span>Bristol: {point.bristol}</span>

                      <span>Urgencia: {point.urgency}</span>

                      <span>Dolor: {point.pain}</span>

                      {point.medicine ? (
                        <span className="pattern-chart-tooltip__medicine">
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
                name="Bristol"
                stroke="var(--color-bathroom)"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "var(--surface-card)",
                  stroke: "var(--color-bathroom)",
                  strokeWidth: 3,
                }}
                activeDot={{
                  r: 7,
                  fill: "var(--color-bathroom)",
                }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="pattern-chart-footnote">
        La línea únicamente ayuda a seguir el orden temporal entre
        observaciones; no representa valores intermedios no registrados.
      </p>

      <div className="pattern-chart-time-example">
        Primer evento visible:{" "}
        <strong>
          {data[0]
            ? `${data[0].dateLabel} · ${formatQaTime(
                scenario.input.bathrooms[0]?.occurredAt ?? "",
              )}`
            : "—"}
        </strong>
      </div>
    </section>
  );
}
