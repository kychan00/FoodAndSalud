import { useQuery } from "@tanstack/react-query";

import { getFoodSuggestions } from "./foodSuggestions.service";

export function useFoodSuggestions(userId: string | undefined) {
  return useQuery({
    queryKey: ["daily-suggestions", "foods", userId],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getFoodSuggestions(userId);
    },

    enabled: Boolean(userId),

    staleTime: 60_000,
  });
}
