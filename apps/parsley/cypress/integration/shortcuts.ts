// Follow guidance from https://docs.cypress.io/api/commands/type#Global-Shortcuts.
describe("Shortcuts", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to open the modal using keyboard shortcut", () => {
    cy.dataCy("shortcut-modal").should("not.exist");
    cy.get("body").type("{shift}", { release: false });
    cy.get("body").type("{?}");
    cy.dataCy("shortcut-modal").should("be.visible");
  });

  it("should be able to open the keyboard shortcut modal by clicking navbar icon button", () => {
    cy.get(`[aria-label="Open shortcut modal"]`).click();
    cy.dataCy("shortcut-modal").should("be.visible");
  });
});
