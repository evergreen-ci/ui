describe("raw log viewer", () => {
  const taskPageURL =
    "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/logs";

  beforeEach(() => {
    cy.visit(taskPageURL);
  });

  it("loads a raw log page on click", () => {
    cy.dataCy("raw-log-btn").should("have.attr", "aria-disabled", "false");
    cy.dataCy("raw-log-btn").click();
    cy.contains("Task logger initialized").should("be.visible");
    cy.url().should(
      "include",
      "/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/raw-logs?execution=0&origin=task",
    );
  });
});
