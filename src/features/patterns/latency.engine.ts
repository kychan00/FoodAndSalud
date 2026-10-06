import type { FoodDetailReport } from "./foodDetail.types";

import type {
  ResponseLatencyBucket,
  ResponseLatencyBucketId,
  ResponseLatencyReport,
  ResponseLatencyStatus,
} from "./latency.types";

const MIN_MARKED_EXPOSURES = 3;

const DOMINANT_SHARE = 0.6;

function median(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((left, right) => left - right);

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? null;
  }

  const left = sorted[middle - 1];

  const right = sorted[middle];

  if (left === undefined || right === undefined) {
    return null;
  }

  return (left + right) / 2;
}

function getBucketId(hours: number): ResponseLatencyBucketId {
  if (hours <= 6) {
    return "early";
  }

  if (hours <= 12) {
    return "intermediate";
  }

  return "late";
}

function classify({
  markedExposures,
  buckets,
}: {
  markedExposures: number;

  buckets: ResponseLatencyBucket[];
}): ResponseLatencyStatus {
  if (markedExposures < MIN_MARKED_EXPOSURES) {
    return "insufficient";
  }

  const dominant = [...buckets].sort(
    (left, right) => right.share - left.share,
  )[0];

  if (!dominant || dominant.share < DOMINANT_SHARE) {
    return "diffuse";
  }

  return dominant.id;
}

export function buildResponseLatencyReport(
  report: FoodDetailReport,
): ResponseLatencyReport {
  /*
   * Importante:
   *
   * usamos FIRST ADVERSE BATHROOM,
   * no firstBathroom.
   *
   * Esto mantiene la semántica corregida en Fase 3.7.
   */
  const latencies = report.history
    .map((item) => item.firstAdverseBathroom?.elapsedHours ?? null)
    .filter(
      (value): value is number => value !== null && value > 0 && value <= 24,
    );

  const counts: Record<ResponseLatencyBucketId, number> = {
    early: 0,

    intermediate: 0,

    late: 0,
  };

  for (const hours of latencies) {
    counts[getBucketId(hours)] += 1;
  }

  const markedExposures = latencies.length;

  const buckets: ResponseLatencyBucket[] = [
    {
      id: "early",

      label: "0–6 h",

      count: counts.early,

      share: markedExposures > 0 ? counts.early / markedExposures : 0,
    },

    {
      id: "intermediate",

      label: ">6–12 h",

      count: counts.intermediate,

      share: markedExposures > 0 ? counts.intermediate / markedExposures : 0,
    },

    {
      id: "late",

      label: ">12–24 h",

      count: counts.late,

      share: markedExposures > 0 ? counts.late / markedExposures : 0,
    },
  ];

  const status = classify({
    markedExposures,

    buckets,
  });

  const sorted = [...latencies].sort((left, right) => left - right);

  const dominantShare =
    markedExposures > 0
      ? Math.max(...buckets.map((bucket) => bucket.share))
      : null;

  return {
    status,

    totalExposures: report.history.length,

    markedExposures,

    markedShare:
      report.history.length > 0 ? markedExposures / report.history.length : 0,

    medianHours: median(latencies),

    minHours: sorted[0] ?? null,

    maxHours: sorted[sorted.length - 1] ?? null,

    dominantShare,

    buckets,
  };
}
