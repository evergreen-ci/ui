describe("Github username banner", () => {
  it("should show the banner on the my patches page if user doesn't have a github username", () => {
    cy.visit("/");
    cy.dataCy("github-username-banner").should("exist");
  });
});
