describe("Sage Bot Settings", () => {
  const route = "/preferences/sage-bot-settings";

  beforeEach(() => {
    cy.visit(route);
  });

  it("should display the Sage Bot Settings tab", () => {
    cy.dataCy("cursor-api-key-card").should("be.visible");
    cy.contains("Cursor API Key").should("be.visible");
  });

  it("should have a disabled save button when input is empty", () => {
    cy.dataCy("save-cursor-api-key-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  });

  it("should enable save button when API key is entered", () => {
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
  });

  it("should save cursor API key and show success toast", () => {
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").click();
    cy.validateToast("success", "Cursor API key saved successfully");
  });

  it("should show masked key after saving", () => {
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").click();
    cy.validateToast("success");

    // After saving, the key status should show the last 4 characters
    cy.dataCy("cursor-key-status").should("be.visible");
    cy.dataCy("delete-cursor-api-key-button").should("be.visible");
  });

  it("should delete cursor API key and show success toast", () => {
    // First save a key
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").click();
    cy.validateToast("success");

    // Then delete it
    cy.dataCy("delete-cursor-api-key-button").click();
    cy.validateToast("success", "Cursor API key deleted successfully");

    // Delete button should no longer be visible
    cy.dataCy("delete-cursor-api-key-button").should("not.exist");
  });

  it("should navigate to Sage Bot Settings from sidebar", () => {
    cy.visit("/preferences/profile");
    cy.dataCy("sage-bot-settings-nav-tab").click();
    cy.url().should("include", "/preferences/sage-bot-settings");
    cy.dataCy("cursor-api-key-card").should("be.visible");
  });
});
