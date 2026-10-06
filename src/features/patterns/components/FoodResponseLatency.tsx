import { Clock3, Gauge, Waves } from "lucide-react";

import { Card } from "../../../components/ui/Card";

import type { FoodDetailReport } from "../foodDetail.types";

import { buildResponseLatencyReport } from "../latency.engine";

import type { ResponseLatencyStatus } from "../latency.types";

import "./FoodResponseLatency.css";

interface FoodResponseLatencyProps {
  report: FoodDetailReport;
}

const statusLabels: Record<ResponseLatencyStatus, string> = {
  insufficient: "Pocos datos",

  early: "Principalmente temprana",

  intermediate: "Principalmente intermedia",

  late: "Principalmente tardía",

  diffuse: "Distribución variable",
};

const statusDescriptions: Record<ResponseLatencyStatus, string> = {
  insufficient:
    "Todavía no hay suficientes exposiciones con respuesta marcada para describir una latencia típica.",

  early:
    "La mayoría de las primeras respuestas marcadas aparece dentro de las primeras 6 horas.",

  intermediate:
    "La mayoría de las primeras respuestas marcadas aparece después de 6 horas y hasta las 12 horas.",

  late: "La mayoría de las primeras respuestas marcadas aparece después de 12 horas.",

  diffuse:
    "Las respuestas marcadas están repartidas entre distintos intervalos y no hay uno claramente dominante.",
};

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function hours(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)} h`;
}

export function FoodResponseLatency({ report }: FoodResponseLatencyProps) {
  const latency = buildResponseLatencyReport(report);

  return (
    <section className="food-latency-section">
      <div className="food-latency-heading">
        <span>Latencia</span>

        <h2>¿Cuándo aparece la primera respuesta marcada?</h2>

        <p>
          Se mide desde la hora de la comida hasta la primera evacuación marcada
          dentro de su ventana efectiva.
        </p>
      </div>

      <Card className="food-latency-status">
        <span
          className="food-latency-status__icon"
          data-status={latency.status}
        >
          <Clock3 size={19} />
        </span>

        <div>
          <span>Perfil temporal</span>

          <strong data-status={latency.status}>
            {statusLabels[latency.status]}
          </strong>

          <p>{statusDescriptions[latency.status]}</p>
        </div>
      </Card>

      <section className="food-latency-metrics">
        <Card className="food-latency-metric">
          <Gauge size={18} />

          <span>Respuestas marcadas</span>

          <strong>
            {latency.markedExposures}/{latency.totalExposures}
          </strong>

          <small>{percent(latency.markedShare)} de las exposiciones</small>
        </Card>

        <Card className="food-latency-metric">
          <Clock3 size={18} />

          <span>Mediana</span>

          <strong>{hours(latency.medianHours)}</strong>

          <small>primera respuesta marcada</small>
        </Card>

        <Card className="food-latency-metric">
          <Waves size={18} />

          <span>Rango observado</span>

          <strong>
            {latency.minHours === null || latency.maxHours === null
              ? "—"
              : `${latency.minHours.toFixed(1)}–${latency.maxHours.toFixed(
                  1,
                )} h`}
          </strong>

          <small>mínimo–máximo</small>
        </Card>
      </section>

      <Card className="food-latency-distribution">
        <div className="food-latency-distribution__header">
          <div>
            <span>Distribución</span>

            <strong>Primeras respuestas marcadas</strong>
          </div>

          {latency.dominantShare !== null ? (
            <small>Máximo {percent(latency.dominantShare)}</small>
          ) : null}
        </div>

        <div className="food-latency-bars">
          {latency.buckets.map((bucket) => (
            <div key={bucket.id} className="food-latency-bar">
              <div>
                <span>{bucket.label}</span>

                <strong>
                  {bucket.count} · {percent(bucket.share)}
                </strong>
              </div>

              <div className="food-latency-bar__track">
                <span
                  data-bucket={bucket.id}
                  style={{
                    width: `${Math.round(bucket.share * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="food-latency-method">
        <strong>Cómo se interpreta</strong>

        <p>
          Para declarar un perfil temporal se requieren al menos 3 exposiciones
          con respuesta marcada.
        </p>

        <p>
          Un intervalo se considera dominante cuando contiene al menos 60% de
          las primeras respuestas marcadas.
        </p>

        <p>
          Una evacuación normal anterior no sustituye a la primera respuesta
          marcada. Por ejemplo, Bristol 4 a las 4 h y Bristol 7 a las 10 h se
          registra aquí como latencia marcada de 10 h.
        </p>

        <p>
          La latencia describe proximidad temporal y no demuestra causalidad.
        </p>
      </Card>
    </section>
  );
}
