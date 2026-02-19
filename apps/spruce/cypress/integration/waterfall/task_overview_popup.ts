describe("task overview popup", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("displays task overview popup with associated issues on alt+click of a known issue task", () => {
    cy.get('a[data-tooltip="test-cloud - Known Issue"]').as("knownIssueTask");

    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("be.visible");

    cy.contains("button", "Task logs").should("be.visible");
    cy.contains("button", "Task history").should("be.visible");

    cy.dataCy("task-distro-link")
      .should("be.visible")
      .should("contain.text", "ubuntu1604-small");

    cy.dataCy("task-overview-popup").should("contain.text", "Failing Command");
    cy.dataCy("task-overview-popup").should("contain.text", "host.list");

    cy.dataCy("task-overview-popup").should(
      "contain.text",
      "Associated Issues",
    );
    cy.dataCy("task-overview-popup").should("contain.text", "Some-Text");
    cy.dataCy("task-overview-popup").should("contain.text", "AnotherOne");
    cy.dataCy("task-overview-popup").should("contain.text", "More-Text");
    cy.dataCy("task-overview-popup").should("contain.text", "A-Random-Ticket");
  });

  it("closes the popup when clicking outside", () => {
    cy.get('a[data-tooltip="test-cloud - Known Issue"]').as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("be.visible");
    cy.dataCy("waterfall-page").click({ force: true });
    cy.dataCy("task-overview-popup").should("not.exist");
  });

  it("navigates to task page when clicking the task link", () => {
    cy.get('a[data-tooltip="test-cloud - Known Issue"]').as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-link").click();
    cy.location("pathname").should("include", `/task/${taskId}`);
  });
});

const taskId =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
