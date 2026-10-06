import { useQuery } from "@tanstack/react-query";

import { getMedicineSchedules } from "./medicineSchedule.service";

export function useMedicineSchedules(userId: string | undefined) {
  return useQuery({
    queryKey: ["medicine-schedules", userId],

    queryFn: () => {
      if (!userId) {
        return [];
      }

      return getMedicineSchedules(userId);
    },

    enabled: Boolean(userId),

    staleTime: 60_000,
  });
}
