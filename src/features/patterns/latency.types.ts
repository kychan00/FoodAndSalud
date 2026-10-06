export type ResponseLatencyStatus =
  "insufficient" | "early" | "intermediate" | "late" | "diffuse";

export type ResponseLatencyBucketId = "early" | "intermediate" | "late";

export interface ResponseLatencyBucket {
  id: ResponseLatencyBucketId;

  label: string;

  count: number;

  share: number;
}

export interface ResponseLatencyReport {
  status: ResponseLatencyStatus;

  totalExposures: number;

  markedExposures: number;

  markedShare: number;

  medianHours: number | null;

  minHours: number | null;

  maxHours: number | null;

  dominantShare: number | null;

  buckets: ResponseLatencyBucket[];
}
