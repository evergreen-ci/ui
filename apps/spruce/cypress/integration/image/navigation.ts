import { SEEN_IMAGE_VISIBILITY_GUIDE_CUE } from "constants/cookies";

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

describe("task metadata", () => {
  it("shows the image visibility guide cue on task metadata", () => {
    cy.setCookie(SEEN_IMAGE_VISIBILITY_GUIDE_CUE, "false");
    cy.visit(
      "/task/evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
    );
    cy.dataCy("image-visibility-guide-cue").should("be.visible");
    cy.contains("button", "Got it").click();
    cy.dataCy("image-visibility-guide-cue").should("not.exist");
  });

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
