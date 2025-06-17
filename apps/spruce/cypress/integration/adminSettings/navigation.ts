describe("admin settings page", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can navigate to the admin settings page", () => {
    cy.dataCy("admin-settings-page").should("be.visible");
  });

  it("has a side navigation with the correct items", () => {
    cy.get("[id=announcements]").should("be.visible");
  });
});
