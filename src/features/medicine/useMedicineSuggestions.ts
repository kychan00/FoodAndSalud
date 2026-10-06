import { useQuery } from "@tanstack/react-query";

import { getMedicineSuggestions } from "./medicineSuggestions.service";

export function useMedicineSuggestions(userId: string | undefined) {
  return useQuery({
    queryKey: ["daily-suggestions", "medicine", userId],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getMedicineSuggestions(userId);
    },

    enabled: Boolean(userId),

    staleTime: 60_000,
  });
}
