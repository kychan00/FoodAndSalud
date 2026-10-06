import { Navigate, useNavigate, useParams } from "react-router-dom";

import { FoodDetailContent } from "../components/FoodDetailContent";

import { patternQaScenarios } from "../fixtures/association.fixtures";

import { buildQaFoodDetailReport } from "../fixtures/qaFoodDetail";

import "./FoodDetailPage.css";

export function PatternLabFoodDetailPage() {
  const navigate = useNavigate();

  const { scenarioId, foodId } = useParams<{
    scenarioId: string;
    foodId: string;
  }>();

  if (!scenarioId || !foodId) {
    return <Navigate to="/qa/patterns" replace />;
  }

  const scenario = patternQaScenarios.find((item) => item.id === scenarioId);

  if (!scenario) {
    return <Navigate to="/qa/patterns" replace />;
  }

  const report = buildQaFoodDetailReport(scenario, foodId);

  if (!report) {
    return <Navigate to="/qa/patterns" replace />;
  }

  return (
    <main className="food-detail-page food-detail-page--qa">
      <div className="food-detail-page__content">
        <FoodDetailContent
          data={report}
          qa
          qaScenarioTitle={scenario.title}
          timeZone="UTC"
          onBack={() => navigate(-1)}
        />
      </div>
    </main>
  );
}
