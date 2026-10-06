import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AssociationReport } from "../association.types";

import "./PatternCharts.css";

interface AssociationRateChartProps {
  report: AssociationReport;
}

interface AssociationChartPoint {
  foodName: string;
  coincidence: number;
  adjusted: number;
  evidence: number;
}

function toPercent(value: number) {
  return Math.round(value * 100);
}

export function AssociationRateChart({ report }: AssociationRateChartProps) {
  const data: AssociationChartPoint[] = report.associations.map(
    (association) => ({
      foodName: association.foodName,

      coincidence: toPercent(association.adverseRate),

      adjusted: toPercent(association.adjustedAdverseRate),

      evidence: association.evaluableExposures,
    }),
  );

  const baseline = toPercent(report.baselineAdverseRate);

  const chartWidth = Math.max(520, data.length * 150);

  return (
    <section className="pattern-chart-card">
      <div className="pattern-chart-header">
        <div>
          <span>Comparación</span>

          <h3>Coincidencia por alimento</h3>
        </div>

        <span className="pattern-chart-header__range">%</span>
      </div>

      <p className="pattern-chart-description">
        Compara la coincidencia observada de cada alimento contra la referencia
        personal del escenario.
      </p>

      <div className="pattern-chart-legend">
        <span>
          <i className="pattern-chart-legend__bar" />
          Observada
        </span>

        <span>
          <i className="pattern-chart-legend__bar-adjusted" />
          Ajustada
        </span>

        <span>
          <i className="pattern-chart-legend__baseline" />
          Referencia
        </span>
      </div>

      <div className="pattern-chart-scroll">
        <div
          className="pattern-chart-canvas"
          style={{
            width: chartWidth,
          }}
        >
          <ResponsiveContainer width="100%" height={310}>
            <BarChart
              data={data}
              margin={{
                top: 28,
                right: 24,
                bottom: 60,
                left: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.32}
              />

              <XAxis
                dataKey="foodName"
                interval={0}
                tick={{
                  fontSize: 11,
                }}
                tickMargin={10}
              />

              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(value) => `${value}%`}
                width={42}
                tick={{
                  fontSize: 11,
                }}
              />

              <ReferenceLine
                y={baseline}
                stroke="var(--color-primary)"
                strokeDasharray="6 5"
                strokeWidth={2}
                label={{
                  value: `Referencia ${baseline}%`,
                  position: "insideTopRight",
                  fill: "var(--color-primary)",
                  fontSize: 11,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "var(--surface-muted)",
                  opacity: 0.6,
                }}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const point = payload[0]?.payload as
                    AssociationChartPoint | undefined;

                  if (!point) {
                    return null;
                  }

                  return (
                    <div className="pattern-chart-tooltip">
                      <strong>{point.foodName}</strong>

                      <span>Coincidencia observada: {point.coincidence}%</span>

                      <span>Coincidencia ajustada: {point.adjusted}%</span>

                      <span>Referencia personal: {baseline}%</span>

                      <span>Exposiciones evaluables: {point.evidence}</span>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="coincidence"
                name="Observada"
                fill="var(--color-food)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              />

              <Bar
                dataKey="adjusted"
                name="Ajustada"
                fill="var(--color-insight)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="pattern-chart-footnote">
        La columna ajustada aplica el suavizado estadístico usado por el motor
        para evitar conclusiones fuertes con pocas observaciones.
      </p>
    </section>
  );
}
