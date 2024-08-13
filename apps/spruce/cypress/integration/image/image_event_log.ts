describe("event log page", () => {
  const IMAGE_EVENT_LIMIT = 5;
  it("should contain ubuntu2204 in the title", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.dataCy("image-title").should("have.text", "ubuntu2204");
  });

  it("load more button should return twice as many events", () => {
    cy.visit("/image/ubuntu2204/event-log");
    cy.dataCy("image-event").should("have.length", IMAGE_EVENT_LIMIT);
    cy.dataCy("load-more").click();
    cy.dataCy("image-event").should("have.length", 2 * IMAGE_EVENT_LIMIT);
  });

  it("filtering name field with non-existent package/toolchain should return no entries", () => {
    cy.visit("/image/ubuntu2204/event-log");
  });
});
