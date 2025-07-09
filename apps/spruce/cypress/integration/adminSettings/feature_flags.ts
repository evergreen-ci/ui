import { clickSave } from "../../utils";

describe("feature flags", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Services section.
    cy.get('input[name="Dispatch tasks"][data-label="Enabled"]').as(
      "servicesRadio",
    );
    cy.get("@servicesRadio").scrollIntoView();
    cy.get("@servicesRadio").should("not.have.attr", "checked");
    cy.get("@servicesRadio").click({ force: true });

    //  Notifications section.
    cy.get(
      'input[name="Process notification events"][data-label="Enabled"]',
    ).as("notificationsRadio");
    cy.get("@notificationsRadio").scrollIntoView();
    cy.get("@notificationsRadio").should("not.have.attr", "checked");
    cy.get("@notificationsRadio").click({ force: true });

    // Features section.
    cy.get('input[name="Track GitHub repositories"][data-label="Enabled"]').as(
      "featuresRadio",
    );
    cy.get("@featuresRadio").scrollIntoView();
    cy.get("@featuresRadio").should("not.have.attr", "checked");
    cy.get("@featuresRadio").click({ force: true });

    // Batch Jobs section.
    cy.get(
      'input[name="Collect background statistics"][data-label="Enabled"]',
    ).as("batchJobsRadio");
    cy.get("@batchJobsRadio").scrollIntoView();
    cy.get("@batchJobsRadio").should("not.have.attr", "checked");
    cy.get("@batchJobsRadio").click({ force: true });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");

    cy.reload();
    cy.get("@servicesRadio").should("have.attr", "checked");
    cy.get("@notificationsRadio").should("have.attr", "checked");
    cy.get("@featuresRadio").should("have.attr", "checked");
    cy.get("@batchJobsRadio").should("have.attr", "checked");
  });
});
