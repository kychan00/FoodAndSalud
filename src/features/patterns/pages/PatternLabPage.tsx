import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Beaker,
  CheckCircle2,
  Database,
  LineChart,
  Pill,
  Salad,
  ShieldCheck,
} from "lucide-react";

import { Card } from "../../../components/ui/Card";
import { buildAssociationReport } from "../association.engine";
import { AssociationRateChart } from "../components/AssociationRateChart";
import { FoodAssociationCard } from "../components/FoodAssociationCard";
import { PatternTimelineChart } from "../components/PatternTimelineChart";
import { patternQaScenarios } from "../fixtures/association.fixtures";
import { formatQaDateTime } from "../fixtures/qaDate";

import "./PatternLabPage.css";

interface RawEvent {
  id: string;
  time: string;

  type: "food" | "bathroom" | "medicine";

  title: string;
  details: string;
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function PatternLabPage() {
  const navigate = useNavigate();

  const [scenarioId, setScenarioId] = useState(patternQaScenarios[0]?.id ?? "");

  const scenario =
    patternQaScenarios.find((item) => item.id === scenarioId) ??
    patternQaScenarios[0];

  const report = useMemo(
    () => (scenario ? buildAssociationReport(scenario.input) : null),
    [scenario],
  );

  const rawEvents = useMemo(() => {
    if (!scenario) {
      return [];
    }

    const events: RawEvent[] = [];

    for (const exposure of scenario.input.exposures) {
      events.push({
        id: `food-${exposure.entryId}-${exposure.foodId}`,

        time: exposure.eatenAt,

        type: "food",

        title: exposure.foodName,

        details: `Entrada ${exposure.entryId}`,
      });
    }

    for (const bathroom of scenario.input.bathrooms) {
      events.push({
        id: `bath-${bathroom.id}`,

        time: bathroom.occurredAt,

        type: "bathroom",

        title: `Bristol ${bathroom.bristolType}`,

        details: `Urgencia ${bathroom.urgency ?? 0} · Dolor ${bathroom.painLevel ?? 0}`,
      });
    }

    for (const medicine of scenario.input.medicines) {
      events.push({
        id: `medicine-${medicine.id}`,

        time: medicine.occurredAt,

        type: "medicine",

        title: "Medicina",

        details: "Evento sintético",
      });
    }

    return events.sort(
      (left, right) =>
        new Date(left.time).getTime() - new Date(right.time).getTime(),
    );
  }, [scenario]);

  if (!scenario || !report) {
    return null;
  }

  return (
    <main className="pattern-lab-page">
      <div className="pattern-lab-page__content">
        <header className="pattern-lab-header">
          <span className="pattern-lab-header__icon">
            <Beaker size={25} />
          </span>

          <div>
            <p>Desarrollo · QA</p>

            <h1>Laboratorio de Patrones</h1>
          </div>
        </header>

        <Card className="pattern-lab-safety">
          <ShieldCheck size={22} />

          <div>
            <strong>Datos ficticios</strong>

            <span>
              Este laboratorio no lee ni escribe registros en Supabase.
            </span>
          </div>
        </Card>

        <section className="pattern-lab-section">
          <label className="pattern-lab-label" htmlFor="qa-scenario">
            Escenario
          </label>

          <select
            id="qa-scenario"
            className="pattern-lab-select"
            value={scenario.id}
            onChange={(event) => setScenarioId(event.target.value)}
          >
            {patternQaScenarios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </section>

        <Card className="pattern-lab-description">
          <span className="pattern-lab-description__icon">
            <CheckCircle2 size={21} />
          </span>

          <div>
            <h2>{scenario.title}</h2>

            <p>{scenario.description}</p>

            <div className="pattern-lab-expectation">
              <strong>Resultado esperado</strong>

              <span>{scenario.expectedText}</span>
            </div>

            <div className="pattern-lab-bug-focus">
              <strong>Qué bug intenta detectar</strong>

              <span>{scenario.bugFocus}</span>
            </div>
          </div>
        </Card>

        <section className="pattern-lab-metrics">
          <Card className="pattern-lab-metric">
            <Salad size={20} />

            <strong>{scenario.input.totalFoodEntries}</strong>

            <span>Comidas</span>
          </Card>

          <Card className="pattern-lab-metric">
            <Database size={20} />

            <strong>{scenario.input.exposures.length}</strong>

            <span>Exposiciones</span>
          </Card>

          <Card className="pattern-lab-metric">
            <Activity size={20} />

            <strong>{scenario.input.bathrooms.length}</strong>

            <span>Bristol</span>
          </Card>

          <Card className="pattern-lab-metric">
            <Pill size={20} />

            <strong>{scenario.input.medicines.length}</strong>

            <span>Medicina</span>
          </Card>
        </section>

        <Card className="pattern-lab-baseline">
          <span>Referencia global de comidas sintéticas</span>

          <strong>{percent(report.baselineAdverseRate)}</strong>

          <p>
            Porcentaje de ventanas de comida ficticias evaluables que tuvieron
            al menos una respuesta marcada dentro de 24 horas.
          </p>

          <p>
            Eventos de baño marcados: {percent(report.bathroomEventAdverseRate)}
          </p>
        </Card>

        <section className="pattern-lab-charts">
          <div className="pattern-lab-section-heading">
            <div>
              <span>Lectura visual</span>

              <h2>Gráficas</h2>
            </div>

            <LineChart size={22} />
          </div>

          <div className="pattern-lab-chart-list">
            <PatternTimelineChart scenario={scenario} />

            <AssociationRateChart report={report} />
          </div>
        </section>

        <section className="pattern-lab-results">
          <div className="pattern-lab-section-heading">
            <div>
              <span>Resultado calculado</span>

              <h2>Asociaciones</h2>
            </div>

            <span>{report.associations.length} alimentos</span>
          </div>

          <div className="pattern-lab-association-list">
            {report.associations.map((association) => (
              <FoodAssociationCard
                key={association.foodId}
                association={association}
                onOpen={() =>
                  navigate(
                    `/qa/patterns/${scenario.id}/food/${association.foodId}`,
                  )
                }
              />
            ))}
          </div>
        </section>

        <details className="pattern-lab-dataset">
          <summary>Ver dataset ficticio</summary>

          <div className="pattern-lab-dataset__content">
            {rawEvents.map((event) => (
              <article
                key={event.id}
                className="pattern-lab-event"
                data-type={event.type}
              >
                <span className="pattern-lab-event__dot" />

                <div>
                  <strong>{event.title}</strong>

                  <span>{event.details}</span>
                </div>

                <time>{formatQaDateTime(event.time)}</time>
              </article>
            ))}
          </div>
        </details>
      </div>
    </main>
  );
}
