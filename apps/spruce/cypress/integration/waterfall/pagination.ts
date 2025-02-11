describe("pagination", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("url query params update as page changes", () => {
    cy.location("search").should("equal", "");

    cy.dataCy("version-labels").should("contain.text", "2ab1c56");

    cy.dataCy("next-page-button").click();
    cy.dataCy("version-labels").should("contain.text", "e391612");
    cy.location("search").should("contain", "maxOrder");

    cy.dataCy("prev-page-button").click();
    cy.dataCy("version-labels").should("contain.text", "2ab1c56");
    cy.location("search").should("contain", "minOrder");
  });

  it("versions update correctly as page changes", () => {
    const firstPageFirstCommit = "2ab1c56";
    const secondPageFirstCommit = "e391612";

    cy.dataCy("version-labels").children().should("have.length", 6);
    cy.dataCy("version-labels").children().eq(0).contains(firstPageFirstCommit);

    cy.dataCy("next-page-button").click();
    cy.dataCy("version-labels").children().should("have.length", 5);
    cy.dataCy("version-labels")
      .children()
      .eq(0)
      .contains(secondPageFirstCommit);

    cy.dataCy("prev-page-button").click();
    cy.dataCy("version-labels").children().should("have.length", 6);
    cy.dataCy("version-labels").children().eq(0).contains(firstPageFirstCommit);
  });

  it("builds update correctly as page changes", () => {
    cy.dataCy("build-group").children().as("builds");
    cy.get("@builds").eq(0).children().should("have.length", 1);
    cy.get("@builds").eq(1).children().should("have.length", 8);
    cy.get("@builds").eq(2).children().should("have.length", 0);
    cy.get("@builds").eq(3).children().should("have.length", 1);
    cy.get("@builds").eq(4).children().should("have.length", 8);
    cy.get("@builds").eq(5).children().should("have.length", 8);

    cy.dataCy("next-page-button").click();
    cy.get("@builds").eq(0).children().should("have.length", 8);
    cy.get("@builds").eq(1).children().should("have.length", 0);
    cy.get("@builds").eq(2).children().should("have.length", 8);
    cy.get("@builds").eq(3).children().should("have.length", 8);
    cy.get("@builds").eq(4).children().should("have.length", 1);

    cy.dataCy("prev-page-button").click();
    cy.get("@builds").eq(0).children().should("have.length", 1);
    cy.get("@builds").eq(1).children().should("have.length", 8);
    cy.get("@builds").eq(2).children().should("have.length", 0);
    cy.get("@builds").eq(3).children().should("have.length", 1);
    cy.get("@builds").eq(4).children().should("have.length", 8);
    cy.get("@builds").eq(5).children().should("have.length", 8);
  });

  it("correctly disables buttons on first and last page", () => {
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("next-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("next-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("next-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("next-page-button").should("have.attr", "aria-disabled", "true");
    cy.dataCy("prev-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("prev-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("prev-page-button")
      .should("have.attr", "aria-disabled", "false")
      .click();
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "true");
  });

  describe("'Jump to most recent commit' button", () => {
    it("returns user to the first page", () => {
      const firstPageFirstCommit = "2ab1c56";

      cy.dataCy("version-labels").children().should("have.length", 6);
      cy.dataCy("version-labels")
        .children()
        .eq(0)
        .contains(firstPageFirstCommit);

      cy.dataCy("next-page-button").click();
      cy.dataCy("version-labels").children().should("have.length", 5);
      cy.location("search").should("contain", "maxOrder");
      cy.dataCy("next-page-button").click();
      cy.location("search").should("contain", "maxOrder");

      cy.dataCy("waterfall-menu").click();
      cy.dataCy("jump-to-most-recent").click();
      cy.dataCy("version-labels")
        .children()
        .eq(0)
        .contains(firstPageFirstCommit);
      cy.location("search").should("not.contain", "maxOrder");
      cy.location("search").should("not.contain", "minOrder");
    });
  });
});
