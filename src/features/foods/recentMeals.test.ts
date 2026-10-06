import { describe, expect, it } from "vitest";

import { buildRecentMealTemplates } from "./recentMeals";

describe("recent meal templates", () => {
  const foods = [
    {
      id: "coffee",

      name: "Café",
    },

    {
      id: "bread",

      name: "Pan",
    },

    {
      id: "egg",

      name: "Huevo",
    },

    {
      id: "rice",

      name: "Arroz",
    },
  ];

  it("returns the newest meal first and preserves food order", () => {
    const result = buildRecentMealTemplates({
      entries: [
        {
          id: "older",

          eatenAt: "2026-10-01T08:00:00Z",

          mealType: "breakfast",
        },

        {
          id: "newer",

          eatenAt: "2026-10-06T08:00:00Z",

          mealType: "breakfast",
        },
      ],

      items: [
        {
          foodEntryId: "older",

          foodId: "rice",

          sortOrder: 0,
        },

        {
          foodEntryId: "newer",

          foodId: "bread",

          sortOrder: 1,
        },

        {
          foodEntryId: "newer",

          foodId: "coffee",

          sortOrder: 0,
        },
      ],

      foods,
    });

    expect(result[0]?.sourceEntryId).toBe("newer");

    expect(result[0]?.foodNames).toEqual(["Café", "Pan"]);
  });

  it("deduplicates the same meal combination even if food order changed", () => {
    const result = buildRecentMealTemplates({
      entries: [
        {
          id: "newer",

          eatenAt: "2026-10-06T08:00:00Z",

          mealType: "breakfast",
        },

        {
          id: "older",

          eatenAt: "2026-10-05T08:00:00Z",

          mealType: "breakfast",
        },
      ],

      items: [
        {
          foodEntryId: "newer",

          foodId: "coffee",

          sortOrder: 0,
        },

        {
          foodEntryId: "newer",

          foodId: "bread",

          sortOrder: 1,
        },

        {
          foodEntryId: "older",

          foodId: "bread",

          sortOrder: 0,
        },

        {
          foodEntryId: "older",

          foodId: "coffee",

          sortOrder: 1,
        },
      ],

      foods,
    });

    expect(result).toHaveLength(1);

    expect(result[0]?.sourceEntryId).toBe("newer");

    expect(result[0]?.foodNames).toEqual(["Café", "Pan"]);
  });

  it("keeps the same foods as separate templates when meal type differs", () => {
    const result = buildRecentMealTemplates({
      entries: [
        {
          id: "breakfast",

          eatenAt: "2026-10-06T08:00:00Z",

          mealType: "breakfast",
        },

        {
          id: "snack",

          eatenAt: "2026-10-05T17:00:00Z",

          mealType: "snack",
        },
      ],

      items: [
        {
          foodEntryId: "breakfast",

          foodId: "coffee",

          sortOrder: 0,
        },

        {
          foodEntryId: "snack",

          foodId: "coffee",

          sortOrder: 0,
        },
      ],

      foods,
    });

    expect(result).toHaveLength(2);

    expect(result.map((item) => item.mealType)).toEqual(["breakfast", "snack"]);
  });

  it("skips empty historical entries and respects the limit", () => {
    const result = buildRecentMealTemplates({
      entries: [
        {
          id: "empty",

          eatenAt: "2026-10-07T08:00:00Z",

          mealType: "breakfast",
        },

        {
          id: "meal-1",

          eatenAt: "2026-10-06T08:00:00Z",

          mealType: "breakfast",
        },

        {
          id: "meal-2",

          eatenAt: "2026-10-05T13:00:00Z",

          mealType: "lunch",
        },
      ],

      items: [
        {
          foodEntryId: "meal-1",

          foodId: "egg",

          sortOrder: 0,
        },

        {
          foodEntryId: "meal-2",

          foodId: "rice",

          sortOrder: 0,
        },
      ],

      foods,

      limit: 1,
    });

    expect(result).toHaveLength(1);

    expect(result[0]?.sourceEntryId).toBe("meal-1");
  });
});
