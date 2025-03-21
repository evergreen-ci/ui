describe("single task distro", () => {
  it("should render allowed project and tasks", () => {
    cy.visit("/distro/archlinux-test/settings");
    cy.dataCy("navitem-single-task-distros").click();
    cy.location("pathname").should(
      "eq",
      "/distro/archlinux-test/settings/single-task-distros",
    );
    cy.dataCy("expandable-card-title").should("have.length", 2);
    cy.dataCy("expandable-card-title").eq(0).should("have.text", "evergreen");
    cy.dataCy("expandable-card-title").eq(1).should("have.text", "spruce");

    cy.dataCy("expandable-card-title").eq(0).click();
    cy.dataCy("expandable-card")
      .find("input")
      .eq(0)
      .should("have.value", "evergreen");
    cy.dataCy("expandable-card")
      .find("input")
      .eq(1)
      .should("have.value", "compile");
    cy.dataCy("expandable-card")
      .find("input")
      .eq(2)
      .should("have.value", "test");

    cy.dataCy("expandable-card-title").eq(1).click();
    cy.dataCy("expandable-card")
      .find("input")
      .eq(3)
      .should("have.value", "spruce");
    cy.dataCy("expandable-card")
      .find("input")
      .eq(4)
      .should("have.value", "lint");
    cy.dataCy("expandable-card")
      .find("input")
      .eq(5)
      .should("have.value", "storybook");
  });
});
