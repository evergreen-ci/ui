import { clickSave } from "../../utils";

describe("service flags", () => {
  beforeEach(() => {
    cy.visit("/admin-settings/service-flags");
  });

  it("can interact with and save service flags", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    cy.get('input[type="checkbox"]').then(($checkboxes) => {
      const initialCheckedCount = $checkboxes.filter(
        '[aria-checked="true"]',
      ).length;
      const $target = $checkboxes.filter(':not([aria-checked="true"])').first();
      const idx = $checkboxes.index($target);

      cy.get('input[type="checkbox"]').eq(idx).scrollIntoView();
      cy.get('input[type="checkbox"]').eq(idx).check({ force: true });

      cy.get('input[type="checkbox"]')
        .filter('[aria-checked="true"]')
        .should("have.length", initialCheckedCount + 1);

      cy.dataCy("save-settings-button").should(
        "not.have.attr",
        "aria-disabled",
        "true",
      );

      cy.get('input[type="checkbox"]').eq(idx).uncheck({ force: true });
      cy.get('input[type="checkbox"]')
        .filter('[aria-checked="true"]')
        .should("have.length", initialCheckedCount);
      cy.dataCy("save-settings-button").should(
        "have.attr",
        "aria-disabled",
        "true",
      );

      cy.get('input[type="checkbox"]').eq(idx).check({ force: true });
      clickSave();
      cy.validateToast("success", "Service flags saved successfully");

      cy.reload();
      cy.get('input[type="checkbox"]')
        .eq(idx)
        .should("have.attr", "aria-checked", "true");
      cy.get('input[type="checkbox"]')
        .filter('[aria-checked="true"]')
        .should("have.length", initialCheckedCount + 1);

      // Restore original state.
      cy.get('input[type="checkbox"]').eq(idx).uncheck({ force: true });
      clickSave();
      cy.validateToast("success", "Service flags saved successfully");
    });
  });
});
