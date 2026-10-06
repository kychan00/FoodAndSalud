import { describe, expect, it } from "vitest";

import { buildAssociationReport } from "../association.engine";
import { patternQaScenarios } from "./association.fixtures";

describe("QA synthetic association scenarios", () => {
  for (const scenario of patternQaScenarios) {
    it(`${scenario.id}: expected signals`, () => {
      const report = buildAssociationReport(scenario.input);

      for (const [foodId, expectedSignal] of Object.entries(
        scenario.expectedSignals,
      )) {
        const association = report.associations.find(
          (item) => item.foodId === foodId,
        );

        expect(association).toBeDefined();

        expect(association?.signal).toBe(expectedSignal);
      }
    });

    if (scenario.expectedMedicineOverlap) {
      it(`${scenario.id}: medicine overlap`, () => {
        const report = buildAssociationReport(scenario.input);

        for (const [foodId, expectedOverlap] of Object.entries(
          scenario.expectedMedicineOverlap ?? {},
        )) {
          const association = report.associations.find(
            (item) => item.foodId === foodId,
          );

          expect(association?.medicineOverlapExposures).toBe(expectedOverlap);
        }
      });
    }
  }
});
