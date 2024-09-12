describe("/image/imageId/random redirect route", () => {
  it("should redirect to the build information page", () => {
    cy.visit("/image/imageId/random");
    cy.location("pathname").should("not.contain", "/random");
    cy.location("pathname").should("eq", "/image/imageId/build-information");
  });

  it("navigates to the image when clicked", () => {
    cy.visit("/image/amazon2/build-information");
    cy.dataCy("images-select").should("be.visible").as("button");
    cy.get("@button").click();
    cy.get(".images-select-options").find("li").should("exist");
    cy.get(".images-select-options").within(() => {
      cy.get("li").eq(1).click();
      cy.get("li")
        .eq(1)
        .invoke("text")
        .then((text) => {
          cy.location("pathname").then((pathname) => {
            expect(pathname).to.include(text);
          });
        });
    });
  });
});
