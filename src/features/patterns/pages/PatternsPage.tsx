import {
  Activity,
  ChartNoAxesCombined,
  Info,
  Pill,
  Salad,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/useAuth";
import { getFoodAssociationReport } from "../association.service";
import { FoodAssociationCard } from "../components/FoodAssociationCard";
import { getPatternSummary } from "../patterns.service";

import "./PatternsPage.css";

export function PatternsPage() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patterns", user?.id, "analysis"],

    queryFn: async () => {
      if (!user) {
        throw new Error("User required");
      }

      const [summary, associations] = await Promise.all([
        getPatternSummary(user.id),

        getFoodAssociationReport(user.id, 90),
      ]);

      return {
        summary,
        associations,
      };
    },

    enabled: Boolean(user),

    staleTime: 30_000,
  });

  const summary = data?.summary;

  const associationReport = data?.associations;

  const visibleAssociations = associationReport?.associations.slice(0, 8) ?? [];

  return (
    <main className="patterns-page">
      <div className="patterns-page__content">
        <header className="patterns-header">
          <span className="patterns-header__icon">
            <ChartNoAxesCombined size={24} />
          </span>

          <div>
            <p>Su historial</p>

            <h1>Patrones</h1>
          </div>
        </header>

        {isLoading ? (
          <Card className="patterns-state">Analizando sus registros…</Card>
        ) : null}

        {isError ? (
          <Card className="patterns-state">
            No pudimos analizar sus patrones.
          </Card>
        ) : null}

        {summary && associationReport ? (
          <>
            <section className="patterns-metrics">
              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--food">
                  <Salad size={21} />
                </span>

                <strong>{summary.foodEntries}</strong>

                <span>
                  Comidas
                  <br />
                  30 días
                </span>
              </Card>

              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--bathroom">
                  <Activity size={21} />
                </span>

                <strong>{summary.bathroomEntries}</strong>

                <span>
                  Bristol
                  <br />
                  30 días
                </span>
              </Card>

              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--medicine">
                  <Pill size={21} />
                </span>

                <strong>{summary.medicineEntries}</strong>

                <span>
                  Medicina
                  <br />
                  30 días
                </span>
              </Card>

              <Card className="pattern-metric">
                <span className="pattern-metric__icon pattern-metric__icon--insight">
                  <Sparkles size={21} />
                </span>

                <strong>
                  {summary.averageBristol === null
                    ? "—"
                    : summary.averageBristol.toFixed(1)}
                </strong>

                <span>
                  Bristol
                  <br />
                  promedio
                </span>
              </Card>
            </section>

            <Card className="pattern-method">
              <span className="pattern-method__icon">
                <Info size={21} />
              </span>

              <div>
                <strong>¿Cómo se calculan las señales?</strong>

                <p>
                  FoodAndSalud observa qué ocurre durante las 24 horas
                  posteriores a cada alimento. Una respuesta marcada significa
                  Bristol 1–2 o 6–7, urgencia de 2 o más, o dolor de 2 o más.
                </p>

                <p>
                  Son asociaciones temporales personales, no una demostración de
                  que un alimento sea la causa.
                </p>
              </div>
            </Card>

            <section className="pattern-associations">
              <div className="pattern-section-heading">
                <div>
                  <span>Últimos 90 días</span>

                  <h2>Posibles asociaciones</h2>
                </div>

                <span className="pattern-section-heading__count">
                  {associationReport.associations.length} alimentos
                </span>
              </div>

              {visibleAssociations.length === 0 ? (
                <Card className="patterns-state">
                  Registre algunas comidas y evacuaciones para comenzar a
                  comparar alimentos.
                </Card>
              ) : (
                <div className="pattern-association-list">
                  {visibleAssociations.map((association) => (
                    <FoodAssociationCard
                      key={association.foodId}
                      association={association}
                      onOpen={() =>
                        navigate(`/patterns/food/${association.foodId}`)
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <Card className="pattern-baseline">
              <span>Referencia global de comidas</span>

              <strong>
                {Math.round(associationReport.baselineAdverseRate * 100)}%
              </strong>

              <p>
                de sus ventanas de comida evaluables en los últimos 90 días
                tuvieron al menos una respuesta marcada dentro de las siguientes
                24 horas. Esta es la referencia global de comidas.
              </p>

              <p>
                Como dato descriptivo independiente,{" "}
                {Math.round(associationReport.bathroomEventAdverseRate * 100)}%
                de los registros individuales de baño fueron marcados.
              </p>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  );
}
