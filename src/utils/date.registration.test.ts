import { describe, expect, it } from "vitest";

import { withTimeOfDay } from "./date";

describe("registration date", () => {
  it("keeps the selected calendar day and uses the current clock time", () => {
    const selected = new Date(2026, 8, 23, 0, 0, 0, 0);

    const now = new Date(2026, 9, 6, 14, 37, 49, 800);

    const result = withTimeOfDay(selected, now);

    expect(result.getFullYear()).toBe(2026);

    expect(result.getMonth()).toBe(8);

    expect(result.getDate()).toBe(23);

    expect(result.getHours()).toBe(14);

    expect(result.getMinutes()).toBe(37);

    expect(result.getSeconds()).toBe(0);

    expect(result.getMilliseconds()).toBe(0);
  });
});
