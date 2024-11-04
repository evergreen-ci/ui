describe("pagination", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("url query params update as page changes", () => {
    cy.location("search").should("equal", "");

    cy.dataCy("next-page-button").click();
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.location("search").should("contain", "maxOrder");

    cy.dataCy("prev-page-button").click();
    cy.dataCy("waterfall-skeleton").should("not.exist");
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
});
