describe("waterfall page", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  describe("version labels", () => {
    it("shows a git tag label", () => {
      cy.dataCy("version-labels")
        .children()
        .eq(4)
        .contains("Git Tags: v2.28.5");
    });
  });

  describe("inactive commits", () => {
    it("renders an inactive version column, button and broken versions badge", () => {
      cy.dataCy("version-labels")
        .children()
        .eq(2)
        .find("button")
        .should("have.attr", "data-cy", "inactive-versions-button");
      cy.dataCy("broken-versions-badge")
        .should("be.visible")
        .contains("1 broken");
      cy.dataCy("build-group")
        .first()
        .children()
        .eq(2)
        .should("have.attr", "data-cy", "inactive-column");
    });
    it("clicking an inactive versions button renders a inactive versions modal", () => {
      cy.dataCy("inactive-versions-button").first().click();
      cy.dataCy("inactive-versions-modal").should("be.visible");
      cy.dataCy("inactive-versions-modal").contains("Broken");
      cy.dataCy("inactive-versions-modal").contains("1 Inactive Version");
      cy.dataCy("inactive-versions-modal").contains("e695f65");
      cy.dataCy("inactive-versions-modal").contains("Mar 2, 2022");
      cy.dataCy("inactive-versions-modal").contains(
        "EVG-16356 Use Build Variant stats to fetch grouped build variants (#1106)",
      );
    });
  });

  describe("task grid", () => {
    it("correctly renders child tasks", () => {
      cy.dataCy("build-group").children().as("builds");

      cy.get("@builds").eq(0).children().should("have.length", 1);
      cy.get("@builds").eq(1).children().should("have.length", 8);
      cy.get("@builds").eq(2).children().should("have.length", 0);
      cy.get("@builds").eq(3).children().should("have.length", 1);
      cy.get("@builds").eq(4).children().should("have.length", 8);
      cy.get("@builds").eq(5).children().should("have.length", 8);
    });
  });

  describe("requester filtering", () => {
    it("filters on periodic builds and trigger", () => {
      cy.dataCy("inactive-versions-button").first().contains("1");
      cy.dataCy("requester-filter").click();
      cy.dataCy("ad_hoc-option").click();
      cy.dataCy("inactive-versions-button").first().contains("6");
      cy.dataCy("version-label-active").should("have.length", 0);

      cy.dataCy("requester-filter").click();
      cy.dataCy("trigger_request-option").click();
      cy.dataCy("inactive-versions-button").first().contains("5");
      cy.dataCy("version-label-active").should("have.length", 1);
      cy.dataCy("version-label-active").contains("Triggered by:");
    });

    it("filters on git tags", () => {
      cy.dataCy("requester-filter").click();
      cy.dataCy("git_tag_request-option").click();
      cy.dataCy("inactive-versions-button").should("have.length", 2);
      cy.dataCy("inactive-versions-button").first().contains("3");
      cy.dataCy("inactive-versions-button").eq(1).contains("2");
      cy.dataCy("version-label-active").contains("Git Tag");
    });

    it("clears requester filters", () => {
      cy.dataCy("requester-filter").click();
      cy.dataCy("gitter_request-option").click();
      cy.dataCy("version-label-active").should("have.length", 3);

      cy.dataCy("requester-filter").within(() => {
        cy.get("button[aria-label='Clear selection']").click();
      });
      cy.dataCy("version-label-active").should("have.length", 5);
    });
  });
});
