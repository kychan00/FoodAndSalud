import { useQuery } from "@tanstack/react-query";

import { getDateKey } from "../../utils/date";
import { getDayTimeline } from "./timeline.service";

export function useDayTimeline(userId: string | undefined, date: Date) {
  const dateKey = getDateKey(date);

  return useQuery({
    queryKey: ["timeline", "day", userId, dateKey],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getDayTimeline(userId, date);
    },

    enabled: Boolean(userId),

    staleTime: 15_000,
  });
}
