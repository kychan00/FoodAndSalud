import { useQuery } from "@tanstack/react-query";

import { getDateKey } from "../../utils/date";
import { getMonthTimeline } from "./timeline.service";

export function useMonthTimeline(userId: string | undefined, month: Date) {
  const monthKey = getDateKey(
    new Date(month.getFullYear(), month.getMonth(), 1),
  );

  return useQuery({
    queryKey: ["timeline", "month", userId, monthKey],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getMonthTimeline(userId, month);
    },

    enabled: Boolean(userId),

    staleTime: 30_000,
  });
}
