import {
  CircleHelp,
  Link2,
  Pill,
  Salad,
  Split,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import { buildConcurrentContextReport } from "../concurrent.engine";

import type { ConcurrentMedicineStatus } from "../concurrent.types";

import type { CombinationStatus } from "../combination.types";

import type { FoodDetailReport } from "../foodDetail.types";

import "./FoodConcurrentFactors.css";

interface FoodConcurrentFactorsProps {
  report: FoodDetailReport;
}

const medicineLabels: Record<ConcurrentMedicineStatus, string> = {
  none: "Sin Medicina concurrente",

  inseparable: "No se puede separar",

  insufficient: "Pocos datos",

  higher_with: "Mayor con Medicina",

  similar: "Diferencia pequeña",

  lower_with: "Menor con Medicina",
};

const foodLabels: Record<CombinationStatus, string> = {
  inseparable: "No se puede separar",

  insufficient: "Pocos datos",

  higher_with: "Mayor juntos",

  similar: "Diferencia pequeña",

  lower_with: "Menor juntos",
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

function getStatusIcon(status: ConcurrentMedicineStatus | CombinationStatus) {
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

export function FoodConcurrentFactors({ report }: FoodConcurrentFactorsProps) {
  const context = buildConcurrentContextReport(report);

  const medicine = context.medicine;

  const visibleFoodFactors = context.foodFactors.slice(0, 3);

  return (
    <section className="food-concurrent-section">
      <div className="food-concurrent-heading">
        <span>Factores concurrentes</span>

        <h2>¿Qué aparece al mismo tiempo?</h2>

        <p>
          Estas comparaciones ayudan a detectar contextos que acompañan al
          patrón. No realizan un ajuste causal ni identifican por sí solas qué
          factor explica la respuesta.
        </p>
      </div>

      <Card className="food-concurrent-card">
        <div className="food-concurrent-card__header">
          <div className="food-concurrent-card__title">
            <span className="food-concurrent-card__icon">
              <Pill size={19} />
            </span>

            <div>
              <span>Medicina</span>

              <h3>Después de {report.foodName}</h3>
            </div>
          </div>

          <span
            className="food-concurrent-status"
            data-status={medicine.status}
          >
            {getStatusIcon(medicine.status)}

            {medicineLabels[medicine.status]}
          </span>
        </div>

        {medicine.status === "none" ? (
          <p className="food-concurrent-note">
            No hay registros de Medicina dentro de las ventanas efectivas de
            este alimento.
          </p>
        ) : (
          <>
            <div className="food-concurrent-overlap">
              <span>Medicina apareció en</span>

              <strong>
                {medicine.overlapExposures}/{report.totalExposures}
              </strong>

              <small>
                {percent(medicine.overlapShare)} de las exposiciones
              </small>
            </div>

            <div className="food-concurrent-comparison">
              <span>
                <small>Con Medicina</small>

                <strong>
                  {medicine.withMedicine.evaluableExposures > 0
                    ? percent(medicine.withMedicine.adverseRate)
                    : "—"}
                </strong>

                <em>
                  {medicine.withMedicine.adverseExposures}/
                  {medicine.withMedicine.evaluableExposures} evaluables
                </em>
              </span>

              <span>
                <small>Sin Medicina</small>

                <strong>
                  {medicine.withoutMedicine.evaluableExposures > 0
                    ? percent(medicine.withoutMedicine.adverseRate)
                    : "—"}
                </strong>

                <em>
                  {medicine.withoutMedicine.adverseExposures}/
                  {medicine.withoutMedicine.evaluableExposures} evaluables
                </em>
              </span>

              <span>
                <small>Diferencia</small>

                <strong>{difference(medicine.difference)}</strong>
              </span>
            </div>

            {medicine.status === "inseparable" ? (
              <p className="food-concurrent-note">
                Medicina aparece en todas las exposiciones disponibles de{" "}
                {report.foodName}. Con estos registros no podemos separar ambos
                contextos.
              </p>
            ) : null}

            {medicine.status === "higher_with" ? (
              <p className="food-concurrent-note">
                La frecuencia observada es mayor en las exposiciones donde
                también hubo Medicina dentro de la ventana efectiva.
              </p>
            ) : null}

            {medicine.status === "lower_with" ? (
              <p className="food-concurrent-note">
                La frecuencia observada es menor cuando también aparece
                Medicina. Esto no implica un efecto protector.
              </p>
            ) : null}

            {medicine.status === "similar" ? (
              <p className="food-concurrent-note">
                Las frecuencias observadas son parecidas con y sin Medicina.
              </p>
            ) : null}

            {medicine.status === "insufficient" ? (
              <p className="food-concurrent-note">
                Todavía faltan exposiciones evaluables en alguno de los dos
                contextos para compararlos.
              </p>
            ) : null}
          </>
        )}

        <p className="food-concurrent-limitation">
          Actualmente “con Medicina” significa que se registró una toma después
          de la comida y antes de terminar su ventana efectiva. No modela dosis,
          duración del efecto ni tomas anteriores a la comida.
        </p>
      </Card>

      <Card className="food-concurrent-card">
        <div className="food-concurrent-card__header">
          <div className="food-concurrent-card__title">
            <span className="food-concurrent-card__icon">
              <Salad size={19} />
            </span>

            <div>
              <span>Otros alimentos</span>

              <h3>Contexto de la comida</h3>
            </div>
          </div>
        </div>

        <div className="food-concurrent-solo">
          <div>
            <span>{report.foodName} sin otros alimentos</span>

            <small>
              {context.exactSolo.totalExposures}{" "}
              {context.exactSolo.totalExposures === 1
                ? "exposición"
                : "exposiciones"}
            </small>
          </div>

          <strong>
            {context.exactSolo.evaluableExposures > 0
              ? percent(context.exactSolo.adverseRate)
              : "—"}
          </strong>
        </div>

        {visibleFoodFactors.length === 0 ? (
          <p className="food-concurrent-note">
            No hay alimentos acompañantes suficientes para analizar.
          </p>
        ) : (
          <div className="food-concurrent-foods">
            {visibleFoodFactors.map((factor) => (
              <div key={factor.foodId} className="food-concurrent-food">
                <div>
                  <strong>{factor.foodName}</strong>

                  <small>{percent(factor.share)} de las exposiciones</small>
                </div>

                <span
                  className="food-concurrent-status"
                  data-status={factor.status}
                >
                  {getStatusIcon(factor.status)}

                  {foodLabels[factor.status]}
                </span>

                <em>
                  {factor.status === "inseparable"
                    ? "Sin exposiciones separables"
                    : `${factor.togetherEvaluable} vs ${factor.withoutEvaluable} evaluables · ${difference(
                        factor.difference,
                      )}`}
                </em>
              </div>
            ))}
          </div>
        )}

        {context.foodFactors.length > visibleFoodFactors.length ? (
          <p className="food-concurrent-note">
            Hay {context.foodFactors.length - visibleFoodFactors.length}{" "}
            alimentos adicionales. El análisis detallado de combinaciones
            aparece más abajo.
          </p>
        ) : null}

        <p className="food-concurrent-limitation">
          Los alimentos acompañantes son los registrados dentro de la misma
          comida. “No se puede separar” significa que ambos aparecen juntos en
          todas las exposiciones disponibles.
        </p>
      </Card>
    </section>
  );
}
