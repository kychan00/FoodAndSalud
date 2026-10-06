import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FoodDetailWindow } from "../foodDetail.types";

import "./FoodDetailCharts.css";

interface FoodWindowChartProps {
  windows: FoodDetailWindow[];
}

export function FoodWindowChart({ windows }: FoodWindowChartProps) {
  const data = windows.map((item) => ({
    window: `${item.hours} h`,

    rate: Math.round(item.adverseRate * 100),

    evaluable: item.evaluableExposures,

    adverse: item.adverseExposures,

    truncated: item.truncatedExposures,
  }));

  return (
    <section className="food-detail-chart">
      <div className="food-detail-chart__header">
        <span>Proximidad temporal</span>

        <h2>6 h · 12 h · 24 h</h2>

        <p>
          Qué porcentaje de exposiciones evaluables tuvo una respuesta marcada
          dentro de cada ventana. Si aparece otra comida antes, la ventana
          anterior termina en ese momento.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 18,
            bottom: 12,
            left: -8,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />

          <XAxis dataKey="window" />

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
                    window: string;

                    rate: number;

                    evaluable: number;

                    adverse: number;

                    truncated: number;
                  }
                | undefined;

              if (!point) {
                return null;
              }

              return (
                <div className="food-chart-tooltip">
                  <strong>Ventana {point.window}</strong>

                  <span>
                    {point.adverse} de {point.evaluable} exposiciones evaluables
                  </span>

                  <span>{point.rate}% con respuesta marcada</span>

                  {point.truncated > 0 ? (
                    <span>
                      {point.truncated} ventanas interrumpidas por otra comida
                    </span>
                  ) : null}
                </div>
              );
            }}
          />

          <Bar
            dataKey="rate"
            fill="var(--color-insight)"
            radius={[10, 10, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
