import { useQuery } from "@tanstack/react-query";

import { getMedicineScheduleCalendarItems } from "./medicineScheduleCalendar.service";

export function useMedicineScheduleCalendar(
  userId: string | undefined,
  month: Date,
) {
  return useQuery({
    queryKey: [
      "medicine-schedule-calendar",
      userId,
      month.getFullYear(),
      month.getMonth(),
    ],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getMedicineScheduleCalendarItems(userId, month);
    },

    enabled: Boolean(userId),

    staleTime: 30_000,
  });
}
