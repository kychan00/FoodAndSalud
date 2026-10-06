import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/useAuth";
import { FoodDetailContent } from "../components/FoodDetailContent";
import { getFoodDetailReport } from "../foodDetail.service";

import "./FoodDetailPage.css";

export function FoodDetailPage() {
  const { user } = useAuth();

  const { foodId } = useParams<{
    foodId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["patterns", "food-detail", user?.id, foodId],

    queryFn: () => {
      if (!user || !foodId) {
        throw new Error("Food detail requires user and food.");
      }

      return getFoodDetailReport(user.id, foodId);
    },

    enabled: Boolean(user && foodId),

    staleTime: 30_000,
  });

  return (
    <main className="food-detail-page">
      <div className="food-detail-page__content">
        {isLoading ? (
          <Card className="food-detail-state">Analizando alimento…</Card>
        ) : null}

        {isError ? (
          <Card className="food-detail-state">
            No pudimos cargar este alimento.
          </Card>
        ) : null}

        {data ? (
          <FoodDetailContent data={data} onBack={() => navigate("/patterns")} />
        ) : null}
      </div>
    </main>
  );
}
