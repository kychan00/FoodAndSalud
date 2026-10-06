import { Activity, ChartNoAxesCombined, Salad, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/useAuth";
import { getPatternSummary } from "../patterns.service";

import "./PatternsPage.css";

export function PatternsPage() {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patterns", user?.id, "30-days"],

    queryFn: () => {
      if (!user) {
        throw new Error("User required");
      }

      return getPatternSummary(user.id);
    },

    enabled: Boolean(user),
  });

  return (
    <main className="patterns-page">
      <div className="patterns-page__content">
        <header className="patterns-header">
          <span className="patterns-header__icon">
            <ChartNoAxesCombined size={24} />
          </span>

          <div>
            <p>Últimos 30 días</p>

            <h1>Patrones</h1>
          </div>
        </header>

        {isLoading ? (
          <Card className="patterns-state">Analizando sus registros…</Card>
        ) : null}

        {isError ? (
          <Card className="patterns-state">
            No pudimos cargar sus patrones.
          </Card>
        ) : null}

        {data ? (
          <>
            <section className="patterns-metrics">
              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--food">
                  <Salad size={21} />
                </span>

                <strong>{data.foodEntries}</strong>

                <span>Comidas</span>
              </Card>

              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--bathroom">
                  <Activity size={21} />
                </span>

                <strong>{data.bathroomEntries}</strong>

                <span>Bristol</span>
              </Card>

              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--insight">
                  <Sparkles size={21} />
                </span>

                <strong>
                  {data.averageBristol === null
                    ? "—"
                    : data.averageBristol.toFixed(1)}
                </strong>

                <span>Bristol promedio</span>
              </Card>
            </section>

            <Card className="pattern-insight">
              <span className="pattern-insight__icon">
                <Sparkles size={25} />
              </span>

              <div>
                <span className="pattern-insight__eyebrow">Análisis</span>

                <h2>
                  {data.totalEvents < 10
                    ? "Necesitamos algunos registros más"
                    : "Ya podemos empezar a observar tendencias"}
                </h2>

                <p>
                  {data.totalEvents < 10
                    ? "Registre varios días de comidas y evacuaciones. FoodAndSalud necesita historial antes de sugerir asociaciones."
                    : `En los últimos 30 días hay ${data.totalEvents} eventos registrados. La siguiente fase analizará qué alimentos aparecen antes de cambios Bristol, urgencia o dolor.`}
                </p>
              </div>
            </Card>

            {data.bristolHighCount > 0 ? (
              <Card className="pattern-observation">
                <strong>
                  {data.bristolHighCount}{" "}
                  {data.bristolHighCount === 1 ? "registro" : "registros"}{" "}
                  Bristol 6–7
                </strong>

                <span>
                  Este dato se utilizará más adelante para buscar asociaciones
                  temporales con alimentos.
                </span>
              </Card>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
