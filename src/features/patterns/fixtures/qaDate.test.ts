import { describe, expect, it } from "vitest";

import { formatQaDateTime, formatQaShortDate, formatQaTime } from "./qaDate";

describe("QA fixture dates", () => {
  it("keeps synthetic UTC hour deterministic", () => {
    const value = "2026-09-01T08:00:00Z";

    expect(formatQaTime(value)).toBe("08:00");
  });

  it("formats a stable QA date", () => {
    const value = "2026-09-01T08:00:00Z";

    expect(formatQaShortDate(value)).toContain("01");
  });

  it("does not convert 08:00Z into the browser local hour", () => {
    const value = "2026-09-01T08:00:00Z";

    expect(formatQaDateTime(value)).toContain("08:00");
  });
});
