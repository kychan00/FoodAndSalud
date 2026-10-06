import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FoodCombinationComparison } from "../combination.types";

import "./FoodCombinationAnalysis.css";

interface FoodCombinationWindowChartProps {
  foodName: string;

  comparison: FoodCombinationComparison;
}

export function FoodCombinationWindowChart({
  foodName,
  comparison,
}: FoodCombinationWindowChartProps) {
  const data = comparison.windows.map((window) => ({
    window: `${window.hours} h`,

    together:
      window.together.evaluableExposures > 0
        ? Math.round(window.together.adverseRate * 100)
        : null,

    without:
      window.without.evaluableExposures > 0
        ? Math.round(window.without.adverseRate * 100)
        : null,

    togetherEvaluable: window.together.evaluableExposures,

    togetherAdverse: window.together.adverseExposures,

    withoutEvaluable: window.without.evaluableExposures,

    withoutAdverse: window.without.adverseExposures,
  }));

  return (
    <div className="combination-window-chart">
      <div className="combination-window-chart__heading">
        <strong>Evolución por ventana</strong>

        <span>6 h · 12 h · 24 h</span>
      </div>

      <div className="combination-window-chart__legend">
        <span>
          <i className="combination-window-chart__legend-together" />
          {foodName} + {comparison.coFoodName}
        </span>

        <span>
          <i className="combination-window-chart__legend-without" />
          {foodName} sin {comparison.coFoodName}
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

                    together: number | null;

                    without: number | null;

                    togetherEvaluable: number;

                    togetherAdverse: number;

                    withoutEvaluable: number;

                    withoutAdverse: number;
                  }
                | undefined;

              if (!point) {
                return null;
              }

              return (
                <div className="food-chart-tooltip">
                  <strong>Ventana {point.window}</strong>

                  <span>
                    {foodName} + {comparison.coFoodName}:{" "}
                    {point.together === null
                      ? "No evaluable"
                      : `${point.together}%`}
                  </span>

                  <span>
                    {point.togetherAdverse} de {point.togetherEvaluable}{" "}
                    evaluables
                  </span>

                  <span>
                    {foodName} sin {comparison.coFoodName}:{" "}
                    {point.without === null
                      ? "No evaluable"
                      : `${point.without}%`}
                  </span>

                  <span>
                    {point.withoutAdverse} de {point.withoutEvaluable}{" "}
                    evaluables
                  </span>
                </div>
              );
            }}
          />

          <Bar
            dataKey="together"
            fill="var(--color-insight)"
            radius={[7, 7, 0, 0]}
            isAnimationActive={false}
          />

          <Bar
            dataKey="without"
            fill="var(--color-food)"
            radius={[7, 7, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
