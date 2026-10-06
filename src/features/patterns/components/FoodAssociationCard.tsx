import {
  AlertTriangle,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type {
  AssociationConfidence,
  AssociationSignal,
  FoodAssociation,
} from "../association.types";

import "./FoodAssociationCard.css";

interface FoodAssociationCardProps {
  association: FoodAssociation;

  onOpen?: () => void;
}

const signalLabels: Record<AssociationSignal, string> = {
  insufficient: "Pocos datos",

  low: "Sin señal clara",

  medium: "Señal media",

  high: "Señal alta",
};

const confidenceLabels: Record<AssociationConfidence, string> = {
  low: "Evidencia baja",

  medium: "Evidencia media",

  high: "Evidencia mayor",
};

function getSignalIcon(signal: AssociationSignal) {
  if (signal === "high") {
    return <AlertTriangle size={18} />;
  }

  if (signal === "medium") {
    return <TrendingUp size={18} />;
  }

  if (signal === "low") {
    return <ShieldCheck size={18} />;
  }

  return <CircleHelp size={18} />;
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function FoodAssociationCard({
  association,
  onOpen,
}: FoodAssociationCardProps) {
  const hasEvaluation = association.evaluableExposures > 0;

  const comparisonLabel =
    association.comparisonSource === "food_absent"
      ? "Comidas sin alimento"
      : "Referencia de comidas";

  return (
    <Card className="food-association">
      <div className="food-association__header">
        <div>
          <h3>{association.foodName}</h3>

          <span>
            {association.totalExposures}{" "}
            {association.totalExposures === 1 ? "registro" : "registros"}
          </span>
        </div>

        <span
          className="food-association__signal"
          data-signal={association.signal}
        >
          {getSignalIcon(association.signal)}

          {signalLabels[association.signal]}
        </span>
      </div>

      <div className="food-association__body">
        {hasEvaluation ? (
          <p>
            <strong>
              {association.adverseExposures} de {association.evaluableExposures}
            </strong>{" "}
            exposiciones evaluables coincidieron con una respuesta digestiva
            marcada dentro de su ventana efectiva posterior a la comida.
          </p>
        ) : (
          <p>
            Todavía no existen evacuaciones posteriores suficientes para evaluar
            este alimento.
          </p>
        )}

        <div className="food-association__metrics">
          <span>
            <small>Coincidencia</small>

            <strong>
              {hasEvaluation ? formatPercent(association.adverseRate) : "—"}
            </strong>
          </span>

          <span>
            <small>{comparisonLabel}</small>

            <strong>{formatPercent(association.baselineAdverseRate)}</strong>
          </span>

          <span>
            <small>Evidencia</small>

            <strong>{confidenceLabels[association.confidence]}</strong>
          </span>
        </div>

        {association.comparisonSource === "food_absent" ? (
          <p className="food-association__comparison">
            Comparación basada en{" "}
            <strong>{association.controlEvaluableExposures}</strong>{" "}
            {association.controlEvaluableExposures === 1
              ? "comida evaluable"
              : "comidas evaluables"}{" "}
            donde {association.foodName} no estuvo presente.
          </p>
        ) : (
          <p className="food-association__comparison">
            No hay suficientes comidas evaluables sin {association.foodName}. Se
            usa como referencia la frecuencia global por ventanas de comida.
          </p>
        )}

        {association.truncatedExposures > 0 ? (
          <p className="food-association__censoring">
            <strong>{association.truncatedExposures}</strong>{" "}
            {association.truncatedExposures === 1
              ? "ventana terminó"
              : "ventanas terminaron"}{" "}
            antes del máximo de 24 horas porque se registró otra comida. Los
            eventos posteriores a esa nueva comida no se atribuyen también a{" "}
            {association.foodName}.
          </p>
        ) : null}

        {association.medicineOverlapExposures > 0 ? (
          <p className="food-association__confounder">
            Medicina estuvo presente en {association.medicineOverlapExposures}{" "}
            {association.medicineOverlapExposures === 1
              ? "ocasión"
              : "ocasiones"}{" "}
            dentro de la misma ventana temporal.
          </p>
        ) : null}

        {onOpen ? (
          <button
            type="button"
            className="food-association__open"
            onClick={onOpen}
          >
            <span>Ver detalle</span>

            <ChevronRight size={18} />
          </button>
        ) : null}
      </div>
    </Card>
  );
}
