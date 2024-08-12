describe("event log page", () => {
  it("should contain ubuntu2204 in the title", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.contains("ubuntu2204").should("exist");
  });
});
