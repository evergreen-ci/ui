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
});
