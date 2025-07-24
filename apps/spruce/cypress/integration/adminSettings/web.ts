import { clickSave } from "../../utils";

describe("web", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // API section.
    cy.getInputByLabel("HTTP listen address").as("apiUrlInput");
    cy.get("@apiUrlInput").clear();
    cy.get("@apiUrlInput").type("http://example.com/api");

    // UI section.
    cy.getInputByLabel("UIv2 URL").as("uiUrlInput");
    cy.get("@uiUrlInput").clear();
    cy.get("@uiUrlInput").type("http://example.com/ui");

    // Beta Features section.
    cy.get('input[type="radio"][data-label="No"]').as("waterfallCheckbox");
    cy.get("@waterfallCheckbox").scrollIntoView();
    cy.get("@waterfallCheckbox").click({ force: true });

    // Disabled GraphQL Queries section.
    cy.getInputByLabel("Disabled GraphQL Queries").as("disabledQueriesInput");
    cy.get("@disabledQueriesInput").scrollIntoView();
    cy.get("@disabledQueriesInput").clear();
    cy.get("@disabledQueriesInput").type("query1");
    cy.get("@disabledQueriesInput").type("{enter}"); // Ensure the input is submitted

    clickSave();
    cy.validateToast("success", "Settings saved successfully");

    cy.reload();
    cy.get("@apiUrlInput").should("have.value", "http://example.com/api");
    cy.get("@uiUrlInput").should("have.value", "http://example.com/ui");
    cy.get("@waterfallCheckbox").should("have.attr", "checked");
    cy.get("span[data-cy=filter-chip]").contains("query1");
  });
});
