describe("/image/imageId/random redirect route", () => {
  it("should redirect to the build information page", () => {
    cy.visit("/image/imageId/random");
    cy.location("pathname").should("not.contain", "/random");
    cy.location("pathname").should("eq", "/image/imageId/build-information");
  });
});

describe("image dropdown", () => {
  it("navigates to the image when clicked", () => {
    cy.visit("/image/amazon2/build-information");
    cy.dataCy("images-select").should("be.visible").as("button");
    cy.get("@button").click();
    cy.get("[role='listbox']").find("li").should("exist");
    cy.get("[role='listbox']").within(() => {
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

describe("task metadata", () => {
  it("navigates to the image page from the task page", () => {
    cy.visit(
      "/task/evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
    cy.dataCy("task-image-link")
      .should("have.attr", "href")
      .and("eq", "/image/ubuntu1604/build-information");
    cy.dataCy("task-image-link").click();
    cy.location("pathname").should("eq", "/image/ubuntu1604/build-information");
  });
});
