describe("event log page", () => {
  const IMAGE_EVENT_LIMIT = 5;
  it("load more button should return twice as many events", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.dataCy("image-event-log-card").should("have.length", IMAGE_EVENT_LIMIT);
    cy.dataCy("load-more-button").click();
    cy.dataCy("image-event-log-card").should(
      "have.length",
      2 * IMAGE_EVENT_LIMIT,
    );
  });

  it("should show no events when filtering by name for a nonexistent item", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.dataCy("image-event-log-card").should("have.length", IMAGE_EVENT_LIMIT);
    cy.dataCy("image-event-log-name-filter").first().click();
    cy.get('input[placeholder="Search name"]').type("bogus{enter}");
    cy.dataCy("image-event-log-card")
      .first()
      .within(() => {
        cy.dataCy("image-event-log-table-row").should("have.length", 0);
      });
  });

  it("should show no events when global filtering for a nonexistent item", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.dataCy("image-event-log-card").should("have.length", IMAGE_EVENT_LIMIT);
    cy.get('input[placeholder="Global search by name"]').type("bogus{enter}");
    cy.dataCy("image-event-log-table-row").should("have.length", 0);
  });
});
