import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AssociationComparisonSource,
  AssociationReport,
} from "../association.types";

import "./PatternCharts.css";

interface AssociationRateChartProps {
  report: AssociationReport;
}

interface AssociationChartPoint {
  foodName: string;

  coincidence: number;

  adjusted: number;

  comparison: number;

  comparisonSource: AssociationComparisonSource;

  evidence: number;

  controls: number;
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

      comparison: toPercent(association.baselineAdverseRate),

      comparisonSource: association.comparisonSource,

      evidence: association.evaluableExposures,

      controls: association.controlEvaluableExposures,
    }),
  );

  const chartWidth = Math.max(560, data.length * 170);

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
        Cada alimento se compara con ventanas de comida donde no estuvo
        presente. Si no existe ese control, se utiliza la referencia global de
        comidas.
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
          Comparación
        </span>
      </div>

      <div className="pattern-chart-scroll">
        <div
          className="pattern-chart-canvas"
          style={{
            width: chartWidth,
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
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

                      <span>Comparación: {point.comparison}%</span>

                      <span>
                        Fuente:{" "}
                        {point.comparisonSource === "food_absent"
                          ? `${point.controls} comidas evaluables sin el alimento`
                          : "referencia global de comidas"}
                      </span>

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

              <Bar
                dataKey="comparison"
                name="Comparación"
                fill="var(--color-primary)"
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="pattern-chart-footnote">
        Todas las columnas utilizan ahora el mismo tipo de unidad: ventanas de
        comida evaluables. Las evacuaciones individuales se conservan como dato
        descriptivo, no como baseline comparador.
      </p>
    </section>
  );
}
