import {
  Activity,
  ArrowLeft,
  Beaker,
  Clock3,
  Pill,
  Salad,
  Users,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type { AssociationSignal } from "../association.types";

import type { FoodDetailReport } from "../foodDetail.types";

import { FoodCombinationAnalysis } from "./FoodCombinationAnalysis";

import { FoodConcurrentFactors } from "./FoodConcurrentFactors";

import { FoodSpecificMedicines } from "./FoodSpecificMedicines";

import { FoodMedicineTiming } from "./FoodMedicineTiming";

import { FoodEffectMetrics } from "./FoodEffectMetrics";

import { FoodTemporalPersistence } from "./FoodTemporalPersistence";

import { FoodHistoryChart } from "./FoodHistoryChart";

import { FoodWindowChart } from "./FoodWindowChart";

interface FoodDetailContentProps {
  data: FoodDetailReport;

  onBack: () => void;

  timeZone?: string;

  qa?: boolean;

  qaScenarioTitle?: string;
}

const mealLabels: Record<string, string> = {
  breakfast: "Desayuno",

  lunch: "Comida",

  dinner: "Cena",

  snack: "Colación",

  other: "Otro",
};

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

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getSignalLabel(signal: AssociationSignal) {
  switch (signal) {
    case "high":
      return "Señal alta";

    case "medium":
      return "Señal media";

    case "low":
      return "Sin señal clara";

    default:
      return "Pocos datos";
  }
}

export function FoodDetailContent({
  data,
  onBack,
  timeZone,
  qa = false,
  qaScenarioTitle,
}: FoodDetailContentProps) {
  const dateTimeFormatter = createDateTimeFormatter(timeZone);

  return (
    <>
      <header className="food-detail-topbar">
        <button
          type="button"
          aria-label={qa ? "Volver al Laboratorio QA" : "Volver a Patrones"}
          onClick={onBack}
        >
          <ArrowLeft size={22} />
        </button>

        <span>{qa ? "Detalle QA" : "Detalle de alimento"}</span>
      </header>

      {qa ? (
        <Card className="food-detail-qa-banner">
          <Beaker size={20} />

          <div>
            <strong>Datos ficticios</strong>

            <span>{qaScenarioTitle ?? "Escenario QA"}</span>
          </div>
        </Card>
      ) : null}

      <section className="food-detail-hero">
        <span className="food-detail-hero__icon">
          <Salad size={28} />
        </span>

        <div>
          <p>Últimos {data.days} días</p>

          <h1>{data.foodName}</h1>
        </div>
      </section>

      <Card className="food-detail-signal">
        <div>
          <span>Señal actual</span>

          <strong data-signal={data.association?.signal ?? "insufficient"}>
            {data.association
              ? getSignalLabel(data.association.signal)
              : "Pocos datos"}
          </strong>
        </div>

        <p>
          {data.association && data.association.evaluableExposures > 0
            ? `${data.association.adverseExposures} de ${data.association.evaluableExposures} exposiciones evaluables tuvieron una respuesta marcada dentro de su ventana efectiva posterior a la comida.`
            : "Todavía no hay suficientes exposiciones evaluables para interpretar este alimento."}
        </p>
      </Card>

      <section className="food-detail-metrics">
        <Card className="food-detail-metric">
          <Salad size={20} />

          <strong>{data.totalExposures}</strong>

          <span>Exposiciones</span>
        </Card>

        <Card className="food-detail-metric">
          <Activity size={20} />

          <strong>{data.association?.evaluableExposures ?? 0}</strong>

          <span>Evaluables</span>
        </Card>

        <Card className="food-detail-metric">
          <Clock3 size={20} />

          <strong>
            {data.association ? percent(data.association.adverseRate) : "—"}
          </strong>

          <span>Coincidencia</span>
        </Card>

        <Card className="food-detail-metric">
          <Pill size={20} />

          <strong>{data.association?.medicineOverlapExposures ?? 0}</strong>

          <span>Con Medicina</span>
        </Card>
      </section>

      {data.association && data.association.truncatedExposures > 0 ? (
        <Card className="food-detail-censoring">
          <strong>Ventanas interrumpidas por otra comida</strong>

          <p>
            {data.association.truncatedExposures}{" "}
            {data.association.truncatedExposures === 1
              ? "exposición terminó"
              : "exposiciones terminaron"}{" "}
            antes del máximo de 24 horas porque se registró una comida
            posterior.
          </p>

          <p>
            Las evacuaciones registradas después de esa nueva comida no se
            atribuyen también a {data.foodName}.
          </p>
        </Card>
      ) : null}

      {data.association ? (
        <FoodEffectMetrics association={data.association} />
      ) : null}

      <FoodTemporalPersistence report={data} timeZone={timeZone} />

      <FoodWindowChart windows={data.windows} />

      <FoodConcurrentFactors report={data} />

      <FoodSpecificMedicines report={data} />

      <FoodMedicineTiming report={data} />

      <FoodCombinationAnalysis report={data} />

      <FoodHistoryChart
        foodName={data.foodName}
        history={data.history}
        timeZone={timeZone}
      />

      <section className="food-detail-section">
        <div className="food-detail-section__heading">
          <div>
            <span>Contexto</span>

            <h2>Consumido junto con</h2>
          </div>

          <Users size={21} />
        </div>

        {data.coOccurrences.length === 0 ? (
          <Card className="food-detail-empty">
            No hay otros alimentos registrados en las mismas comidas.
          </Card>
        ) : (
          <div className="food-detail-cofoods">
            {data.coOccurrences.map((item) => (
              <Card key={item.foodId} className="food-detail-cofood">
                <div>
                  <strong>{item.foodName}</strong>

                  <span>
                    {item.count} {item.count === 1 ? "vez" : "veces"}
                  </span>
                </div>

                <strong>{percent(item.share)}</strong>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="food-detail-section">
        <div className="food-detail-section__heading">
          <div>
            <span>Evidencia</span>

            <h2>Historial</h2>
          </div>
        </div>

        {data.history.length === 0 ? (
          <Card className="food-detail-empty">
            Todavía no hay exposiciones registradas para este alimento.
          </Card>
        ) : (
          <div className="food-detail-history">
            {data.history.map((item) => (
              <Card key={item.entryId} className="food-detail-history-item">
                <div className="food-detail-history-item__top">
                  <div>
                    <strong>
                      {dateTimeFormatter.format(new Date(item.eatenAt))}
                    </strong>

                    <span>{mealLabels[item.mealType] ?? "Comida"}</span>
                  </div>

                  {item.firstBathroom ? (
                    <span
                      className="food-detail-history-item__status"
                      data-adverse={item.windowAdverse}
                    >
                      {item.windowAdverse
                        ? "Respuesta marcada"
                        : "Sin respuesta marcada"}
                    </span>
                  ) : (
                    <span className="food-detail-history-item__status">
                      No evaluable
                    </span>
                  )}
                </div>

                {item.coFoods.length > 0 ? (
                  <p>
                    También consumió:{" "}
                    <strong>
                      {item.coFoods.map((food) => food.foodName).join(", ")}
                    </strong>
                  </p>
                ) : (
                  <p>Sin otros alimentos registrados en esta comida.</p>
                )}

                {item.firstBathroom ? (
                  <div className="food-detail-history-item__outcome">
                    <span>
                      Primera evacuación: Bristol{" "}
                      <strong>{item.firstBathroom.bristolType}</strong>
                    </span>

                    <span>
                      Urgencia{" "}
                      <strong>{item.firstBathroom.urgency ?? 0}</strong>
                    </span>

                    <span>
                      Dolor <strong>{item.firstBathroom.painLevel ?? 0}</strong>
                    </span>

                    <span>
                      <strong>
                        {item.firstBathroom.elapsedHours.toFixed(1)}
                      </strong>{" "}
                      h después
                    </span>
                  </div>
                ) : null}

                {item.firstAdverseBathroom &&
                item.firstBathroom &&
                item.firstAdverseBathroom.id !== item.firstBathroom.id ? (
                  <div className="food-detail-history-item__later-adverse">
                    <Activity size={16} />

                    <div>
                      <strong>Respuesta marcada posterior</strong>

                      <span>
                        Bristol {item.firstAdverseBathroom.bristolType} ·{" "}
                        {item.firstAdverseBathroom.elapsedHours.toFixed(1)} h
                        después
                      </span>
                    </div>
                  </div>
                ) : null}

                {item.windowTruncated ? (
                  <div className="food-detail-history-item__window">
                    <Clock3 size={16} />
                    Ventana efectiva:{" "}
                    <strong>{item.effectiveWindowHours.toFixed(1)} h</strong>.
                    Terminó al registrarse otra comida.
                  </div>
                ) : null}

                {item.medicineBeforeOverlap ? (
                  <div className="food-detail-history-item__medicine">
                    <Pill size={16} />
                    {item.medicinesBefore.some(
                      (medicine) => medicine.medicineName,
                    )
                      ? `Medicina antes: ${[
                          ...new Set(
                            item.medicinesBefore
                              .map((medicine) => medicine.medicineName)
                              .filter((name): name is string => Boolean(name)),
                          ),
                        ].join(", ")}`
                      : "Medicina registrada antes de la comida"}
                  </div>
                ) : null}

                {item.medicineOverlap ? (
                  <div className="food-detail-history-item__medicine">
                    <Pill size={16} />
                    {item.medicines.some((medicine) => medicine.medicineName)
                      ? `Medicina: ${[
                          ...new Set(
                            item.medicines
                              .map((medicine) => medicine.medicineName)
                              .filter((name): name is string => Boolean(name)),
                          ),
                        ].join(", ")}`
                      : "Medicina presente dentro de la ventana efectiva"}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="food-detail-method">
        <strong>Cómo leer esta pantalla</strong>

        <p>
          FoodAndSalud muestra coincidencias temporales. Otros alimentos,
          Medicina y factores que no se registraron pueden explicar parte del
          patrón.
        </p>

        <p>
          La diferencia absoluta, el RR descriptivo y la estabilidad sirven para
          describir sus propios registros. No son pruebas de causalidad ni un
          diagnóstico.
        </p>

        <p>
          Una asociación repetida no demuestra por sí misma que este alimento
          sea la causa.
        </p>
      </Card>
    </>
  );
}
