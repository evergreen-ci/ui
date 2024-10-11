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
    it("renders an inactive version column and button", () => {
      cy.dataCy("version-labels")
        .children()
        .eq(2)
        .get("button")
        .should("have.attr", "data-cy", "inactive-versions-button");
      cy.dataCy("build-group")
        .first()
        .children()
        .eq(2)
        .should("have.attr", "data-cy", "inactive-column");
    });
    it("clicking an inactive versions button renders a inactive versions modal", () => {
      cy.dataCy("inactive-versions-button").first().click();
      cy.dataCy("inactive-versions-modal").should("be.visible");
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

  describe("build variant filtering", () => {
    beforeEach(() => {
      cy.visit("/project/evergreen/waterfall");
    });

    it("submitting a build variant filter updates the url, creates a badge and filters the grid", () => {
      cy.dataCy("build-variant-label").should("have.length", 2);
      cy.get("[placeholder='Filter build variants'").type("P{enter}");
      cy.dataCy("filter-badge").first().should("have.text", "buildVariants: P");
      cy.location().should((loc) => {
        expect(loc.search).to.include("buildVariants=P");
      });
      cy.dataCy("build-variant-label").should("have.length", 0);

      cy.dataCy("close-badge").click();
      cy.dataCy("build-variant-label").should("have.length", 2);

      cy.get("[placeholder='Filter build variants'").type("Lint{enter}");
      cy.location().should((loc) => {
        expect(loc.search).to.include("buildVariants=Lint");
      });
      cy.dataCy("filter-badge")
        .first()
        .should("have.text", "buildVariants: Lint");

      cy.dataCy("build-variant-label")
        .should("have.length", 1)
        .should("have.text", "Lint");
      cy.get("[placeholder='Filter build variants'").type("P{enter}");
      cy.location().should((loc) => {
        expect(loc.search).to.include("buildVariants=Lint,P");
      });
    });
  });
});
