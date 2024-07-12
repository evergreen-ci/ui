describe("/image/<imageId>/<random> redirect route", () => {
  it("should redirect to the build information page", () => {
    cy.visit("/image/<imageId>/random");
    cy.location("pathname").should("not.contain", "/random");
    cy.location("pathname").should("eq", "/distro/<imageId>/build-information");
  });
});
