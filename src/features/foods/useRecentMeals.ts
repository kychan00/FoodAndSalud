import { useQuery } from "@tanstack/react-query";

import { getRecentMealTemplates } from "./recentMeals.service";

export function useRecentMeals(userId: string | undefined) {
  return useQuery({
    queryKey: ["daily-suggestions", "recent-meals", userId],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getRecentMealTemplates(userId);
    },

    enabled: Boolean(userId),

    staleTime: 60_000,
  });
}
