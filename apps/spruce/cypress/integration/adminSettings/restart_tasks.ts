describe("restart tasks", () => {
  beforeEach(() => {
    cy.visit("/admin-settings/restart-tasks");
  });

  it("can restart tasks", () => {
    cy.dataCy("restart-tasks-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Change Start Date.
    cy.dataCy("start-date-picker").click();
    cy.get("[aria-label*='year']").click();
    cy.contains("li", "2020").click({ force: true });
    cy.get("[aria-label*='month']").click();
    cy.contains("li", "Feb").click({ force: true });
    cy.get("[data-iso='2020-02-01']").click();
    cy.validateDatePickerDate("start-date-picker", {
      year: "2020",
      month: "02",
      day: "01",
    });

    // Change End Date.
    cy.dataCy("end-date-picker").click();
    cy.get("[aria-label*='year']").click();
    cy.contains("li", "2021").click({ force: true });
    cy.get("[aria-label*='month']").click();
    cy.contains("li", "Mar").click({ force: true });
    cy.get("[data-iso='2021-03-01']").click();
    cy.validateDatePickerDate("end-date-picker", {
      year: "2021",
      month: "03",
      day: "01",
    });

    cy.dataCy("restart-tasks-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.dataCy("restart-tasks-button").click();
    cy.dataCy("restart-tasks-modal").should("be.visible");
    cy.dataCy("restart-tasks-list").children().should("have.length", 4);
    cy.contains("button", "Confirm").click();
    cy.validateToast("success", "Created job to restart 4 tasks.");
  });
});
