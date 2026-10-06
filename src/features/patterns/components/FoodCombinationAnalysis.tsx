import {
  CircleHelp,
  Clock3,
  Link2,
  Split,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import { buildFoodCombinationReport } from "../combination.engine";

import type { CombinationStatus } from "../combination.types";

import type { FoodDetailReport } from "../foodDetail.types";

import { FoodCombinationWindowChart } from "./FoodCombinationWindowChart";

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

function getWindowInterpretation(status: CombinationStatus) {
  switch (status) {
    case "higher_with":
      return "Mayor con combinación";

    case "lower_with":
      return "Menor con combinación";

    case "similar":
      return "Parecida";

    case "inseparable":
      return "Inseparable";

    default:
      return "Pocos datos";
  }
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

            <FoodCombinationWindowChart
              foodName={report.foodName}
              comparison={comparison}
            />

            <div className="combination-window-summary">
              {comparison.windows.map((window) => (
                <div
                  key={window.hours}
                  className="combination-window-summary__item"
                >
                  <span>
                    <Clock3 size={14} />
                    {window.hours} h
                  </span>

                  <strong data-status={window.status}>
                    {getWindowInterpretation(window.status)}
                  </strong>

                  <small>
                    {window.difference === null
                      ? "Sin comparación"
                      : `${window.difference > 0 ? "+" : ""}${Math.round(
                          window.difference * 100,
                        )} pp`}
                  </small>
                </div>
              ))}
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
                Durante las primeras 24 horas la coincidencia temporal es mayor
                cuando {report.foodName} se registra junto con{" "}
                {comparison.coFoodName}. Revise las ventanas para ver cuándo
                empieza a aparecer la diferencia.
              </p>
            ) : null}

            {comparison.status === "lower_with" ? (
              <p className="food-combination-note">
                Durante 24 horas la coincidencia temporal es menor cuando
                aparece {comparison.coFoodName}. Esto no implica un efecto
                protector.
              </p>
            ) : null}

            {comparison.status === "similar" ? (
              <p className="food-combination-note">
                Durante 24 horas las frecuencias observadas son parecidas con y
                sin {comparison.coFoodName}.
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </section>
  );
}
