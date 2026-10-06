import {
  CircleHelp,
  Link2,
  Split,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import { buildFoodCombinationReport } from "../combination.engine";

import type { CombinationStatus } from "../combination.types";

import type { FoodDetailReport } from "../foodDetail.types";

import "./FoodCombinationAnalysis.css";

interface FoodCombinationAnalysisProps {
  report: FoodDetailReport;
}

const statusLabels: Record<CombinationStatus, string> = {
  inseparable: "No se puede separar",

  insufficient: "Pocos datos",

  higher_with: "Mayor con la combinación",

  similar: "Diferencia pequeña",

  lower_with: "Menor con la combinación",
};

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getStatusIcon(status: CombinationStatus) {
  switch (status) {
    case "higher_with":
      return <TrendingUp size={17} />;

    case "lower_with":
      return <TrendingDown size={17} />;

    case "inseparable":
      return <Link2 size={17} />;

    case "similar":
      return <Split size={17} />;

    default:
      return <CircleHelp size={17} />;
  }
}

function RateBar({
  label,
  rate,
  evaluable,
  adverse,
}: {
  label: string;
  rate: number;
  evaluable: number;
  adverse: number;
}) {
  const percentage = Math.round(rate * 100);

  return (
    <div className="combination-rate">
      <div className="combination-rate__header">
        <span>{label}</span>

        <strong>{evaluable > 0 ? `${percentage}%` : "—"}</strong>
      </div>

      <div className="combination-rate__track">
        <span
          style={{
            width: evaluable > 0 ? `${percentage}%` : "0%",
          }}
        />
      </div>

      <small>
        {evaluable > 0
          ? `${adverse} de ${evaluable} evaluables`
          : "Sin exposiciones evaluables"}
      </small>
    </div>
  );
}

export function FoodCombinationAnalysis({
  report,
}: FoodCombinationAnalysisProps) {
  const combinationReport = buildFoodCombinationReport(report);

  if (combinationReport.comparisons.length === 0) {
    return (
      <section className="food-combination-section">
        <div className="food-combination-heading">
          <span>Combinaciones</span>

          <h2>Alimento y contexto</h2>
        </div>

        <Card className="food-combination-empty">
          {report.foodName} no aparece acompañado por otros alimentos en los
          registros disponibles.
        </Card>
      </section>
    );
  }

  return (
    <section className="food-combination-section">
      <div className="food-combination-heading">
        <span>Desambiguación</span>

        <h2>¿Cambia según con qué se consume?</h2>

        <p>
          Comparamos {report.foodName} acompañado por cada alimento frente a las
          exposiciones donde ese alimento no estuvo presente.
        </p>
      </div>

      <Card className="food-combination-solo">
        <div>
          <span>{report.foodName} sin otros alimentos</span>

          <strong>
            {combinationReport.exactSolo.totalExposures}{" "}
            {combinationReport.exactSolo.totalExposures === 1
              ? "exposición"
              : "exposiciones"}
          </strong>
        </div>

        <strong>
          {combinationReport.exactSolo.evaluableExposures > 0
            ? percent(combinationReport.exactSolo.adverseRate)
            : "—"}
        </strong>
      </Card>

      <div className="food-combination-list">
        {combinationReport.comparisons.map((comparison) => (
          <Card key={comparison.coFoodId} className="food-combination-card">
            <div className="food-combination-card__header">
              <div>
                <span>Consumido junto con</span>

                <h3>{comparison.coFoodName}</h3>

                <small>
                  {Math.round(comparison.share * 100)}% de las exposiciones
                </small>
              </div>

              <span
                className="food-combination-status"
                data-status={comparison.status}
              >
                {getStatusIcon(comparison.status)}

                {statusLabels[comparison.status]}
              </span>
            </div>

            <div className="food-combination-bars">
              <RateBar
                label={`${report.foodName} + ${comparison.coFoodName}`}
                rate={comparison.together.adverseRate}
                evaluable={comparison.together.evaluableExposures}
                adverse={comparison.together.adverseExposures}
              />

              <RateBar
                label={`${report.foodName} sin ${comparison.coFoodName}`}
                rate={comparison.without.adverseRate}
                evaluable={comparison.without.evaluableExposures}
                adverse={comparison.without.adverseExposures}
              />
            </div>

            {comparison.status === "inseparable" ? (
              <p className="food-combination-note">
                {report.foodName} y {comparison.coFoodName} aparecen juntos en
                todas las exposiciones disponibles. Con estos datos todavía no
                podemos separar sus patrones.
              </p>
            ) : null}

            {comparison.status === "insufficient" ? (
              <p className="food-combination-note">
                Todavía faltan exposiciones evaluables en uno de los dos
                contextos para hacer una comparación útil.
              </p>
            ) : null}

            {comparison.status === "higher_with" ? (
              <p className="food-combination-note">
                La coincidencia temporal es mayor cuando {report.foodName} se
                registra junto con {comparison.coFoodName}. Esto sigue siendo
                una asociación observacional.
              </p>
            ) : null}

            {comparison.status === "lower_with" ? (
              <p className="food-combination-note">
                La coincidencia temporal es menor cuando aparece{" "}
                {comparison.coFoodName}. Esto no implica un efecto protector.
              </p>
            ) : null}

            {comparison.status === "similar" ? (
              <p className="food-combination-note">
                La frecuencia observada es parecida con y sin{" "}
                {comparison.coFoodName}.
              </p>
            ) : null}

            {comparison.difference !== null ? (
              <div className="food-combination-difference">
                Diferencia observada:{" "}
                <strong>
                  {comparison.difference > 0 ? "+" : ""}
                  {Math.round(comparison.difference * 100)} puntos porcentuales
                </strong>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
