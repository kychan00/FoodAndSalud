import {
  CircleHelp,
  Clock3,
  Link2,
  Pill,
  Split,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type { FoodDetailReport } from "../foodDetail.types";

import { buildSpecificMedicineReport } from "../medicineSpecific.engine";

import type { SpecificMedicineStatus } from "../medicineSpecific.types";

import "./FoodSpecificMedicines.css";

interface FoodSpecificMedicinesProps {
  report: FoodDetailReport;
}

const labels: Record<SpecificMedicineStatus, string> = {
  inseparable: "No se puede separar",

  insufficient: "Pocos datos",

  higher_with: "Mayor cuando aparece",

  similar: "Diferencia pequeña",

  lower_with: "Menor cuando aparece",
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

function icon(status: SpecificMedicineStatus) {
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

export function FoodSpecificMedicines({ report }: FoodSpecificMedicinesProps) {
  const analysis = buildSpecificMedicineReport(report);

  if (analysis.factors.length === 0) {
    return null;
  }

  return (
    <section className="food-specific-medicine-section">
      <div className="food-specific-medicine-heading">
        <span>Medicina específica</span>

        <h2>¿Qué medicamento aparece en el contexto?</h2>

        <p>
          Separamos cada medicamento identificado por nombre. La comparación
          sigue siendo descriptiva y no demuestra que el medicamento explique la
          respuesta.
        </p>
      </div>

      <div className="food-specific-medicine-list">
        {analysis.factors.map((factor) => (
          <Card key={factor.medicineId} className="food-specific-medicine-card">
            <div className="food-specific-medicine-card__header">
              <div className="food-specific-medicine-card__title">
                <span className="food-specific-medicine-card__icon">
                  <Pill size={19} />
                </span>

                <div>
                  <span>Medicamento registrado</span>

                  <h3>{factor.medicineName}</h3>

                  <small>
                    {factor.exposureCount}/{analysis.totalExposures}{" "}
                    exposiciones · {percent(factor.exposureShare)}
                  </small>
                </div>
              </div>

              <span
                className="food-specific-medicine-status"
                data-status={factor.status}
              >
                {icon(factor.status)}

                {labels[factor.status]}
              </span>
            </div>

            <div className="food-specific-medicine-comparison">
              <span>
                <small>Con {factor.medicineName}</small>

                <strong>
                  {factor.withMedicine.evaluableExposures > 0
                    ? percent(factor.withMedicine.adverseRate)
                    : "—"}
                </strong>

                <em>
                  {factor.withMedicine.adverseExposures}/
                  {factor.withMedicine.evaluableExposures} evaluables
                </em>
              </span>

              <span>
                <small>Sin {factor.medicineName}</small>

                <strong>
                  {factor.withoutMedicine.evaluableExposures > 0
                    ? percent(factor.withoutMedicine.adverseRate)
                    : "—"}
                </strong>

                <em>
                  {factor.withoutMedicine.adverseExposures}/
                  {factor.withoutMedicine.evaluableExposures} evaluables
                </em>
              </span>

              <span>
                <small>Diferencia</small>

                <strong>{difference(factor.difference)}</strong>
              </span>
            </div>

            <div className="food-specific-medicine-context">
              <span>
                <Clock3 size={15} />

                {factor.medianTimingHours === null
                  ? "Hora relativa no disponible"
                  : `Mediana: ${factor.medianTimingHours.toFixed(
                      1,
                    )} h después de la comida`}
              </span>

              <span>
                <Pill size={15} />
                {factor.intakeCount}{" "}
                {factor.intakeCount === 1
                  ? "toma registrada"
                  : "tomas registradas"}
              </span>
            </div>

            {factor.doseLabels.length > 0 ? (
              <p className="food-specific-medicine-dose">
                Dosis registradas:{" "}
                <strong>{factor.doseLabels.join(" · ")}</strong>
              </p>
            ) : (
              <p className="food-specific-medicine-dose">
                Sin dosis registrada para estas tomas.
              </p>
            )}

            {factor.status === "inseparable" ? (
              <p className="food-specific-medicine-note">
                {factor.medicineName} aparece en todas las exposiciones
                disponibles de {report.foodName}. No existen registros
                suficientes de {report.foodName} sin este medicamento para
                separarlos.
              </p>
            ) : null}

            {factor.status === "higher_with" ? (
              <p className="food-specific-medicine-note">
                La frecuencia observada es mayor en las exposiciones donde
                también aparece {factor.medicineName}. Esto describe
                coincidencia temporal, no un efecto causal del medicamento.
              </p>
            ) : null}

            {factor.status === "lower_with" ? (
              <p className="food-specific-medicine-note">
                La frecuencia observada es menor cuando también aparece{" "}
                {factor.medicineName}. Esto no demuestra un efecto protector.
              </p>
            ) : null}

            {factor.status === "similar" ? (
              <p className="food-specific-medicine-note">
                Las frecuencias observadas son parecidas con y sin{" "}
                {factor.medicineName}.
              </p>
            ) : null}

            {factor.status === "insufficient" ? (
              <p className="food-specific-medicine-note">
                Todavía faltan exposiciones evaluables con o sin{" "}
                {factor.medicineName} para hacer una comparación útil.
              </p>
            ) : null}
          </Card>
        ))}
      </div>

      <Card className="food-specific-medicine-method">
        <strong>Alcance actual</strong>

        <p>
          La identidad del medicamento proviene del catálogo personal de
          Medicina. Las dosis y horarios se muestran únicamente como contexto.
        </p>

        <p>
          Esta fase todavía analiza tomas posteriores a la comida dentro de su
          ventana efectiva. No modela tomas previas, vida media, farmacocinética
          ni indicación.
        </p>
      </Card>
    </section>
  );
}
