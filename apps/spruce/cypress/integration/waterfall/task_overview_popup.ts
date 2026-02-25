describe("task overview popup", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("displays task overview popup on alt+click", () => {
    cy.get(knownIssueTask).as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("exist");
    cy.dataCy("task-overview-popup").should("be.visible");

    cy.dataCy("task-distro-link").should("contain.text", "ubuntu1604-small");
    cy.dataCy("task-overview-popup").should("contain.text", "Failing Command");
    cy.dataCy("task-overview-popup").should("contain.text", "host.list");
  });

  it("closes the popup when clicking outside", () => {
    cy.get(knownIssueTask).as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("exist");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("not.exist");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("exist");
  });

  it("displays associated issues", () => {
    cy.get(knownIssueTask).as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("exist");
    cy.dataCy("task-overview-popup").should("be.visible");
    cy.dataCy("task-overview-popup").should(
      "contain.text",
      "Associated Issues",
    );
    cy.dataCy("task-overview-popup").should("contain.text", "Some-Text");
    cy.dataCy("task-overview-popup").should("contain.text", "AnotherOne");
    cy.dataCy("task-overview-popup").should("contain.text", "More-Text");
    cy.dataCy("task-overview-popup").should("contain.text", "A-Random-Ticket");
  });

  it("navigates to task page when clicking the task link", () => {
    cy.get(knownIssueTask).as("knownIssueTask");
    cy.get("@knownIssueTask").click({ altKey: true });
    cy.dataCy("task-overview-popup").should("exist");
    cy.dataCy("task-overview-popup").should("be.visible");
    cy.dataCy("task-link").click();
    cy.location("pathname").should("include", `/task/${knownIssueTaskId}`);
  });

  describe("buttons", () => {
    it("restart button restarts the task", () => {
      cy.get(knownIssueTask).as("knownIssueTask");
      cy.get("@knownIssueTask").click({ altKey: true });
      cy.dataCy("task-overview-popup").should("exist");
      cy.dataCy("task-overview-popup").should("be.visible");

      cy.contains("button", "Restart").should("be.visible");
      cy.contains("button", "Restart").click();

      cy.dataCy("task-overview-popup").should("not.exist");
      cy.contains("Task 'test-cloud' scheduled to restart").should(
        "be.visible",
      );
    });

    it("filter button applies task and build variant filters", () => {
      cy.get(knownIssueTask).as("knownIssueTask");
      cy.get("@knownIssueTask").click({ altKey: true });
      cy.dataCy("task-overview-popup").should("exist");
      cy.dataCy("task-overview-popup").should("be.visible");

      cy.contains("button", "Filter").should("be.visible");
      cy.contains("button", "Filter").click();

      cy.dataCy("task-overview-popup").should("not.exist");
      cy.location("search").should("include", "tasks=test-cloud");
      cy.location("search").should("include", "buildVariants=ubuntu1604");
    });

    it("task logs button navigates to Parsley", () => {
      cy.get(knownIssueTask).as("knownIssueTask");
      cy.get("@knownIssueTask").click({ altKey: true });
      cy.dataCy("task-overview-popup").should("exist");
      cy.dataCy("task-overview-popup").should("be.visible");

      cy.contains("a", "Logs").should("be.visible");
      cy.contains("a", "Logs")
        .should("have.attr", "href")
        .and(
          "equal",
          `http://localhost:5173/evergreen/${knownIssueTaskId}/0/task`,
        );
    });

    it("task history button navigates to task history tab", () => {
      cy.get(knownIssueTask).as("knownIssueTask");
      cy.get("@knownIssueTask").click({ altKey: true });
      cy.dataCy("task-overview-popup").should("exist");

      cy.contains("a", "History").should("be.visible");
      cy.contains("a", "History")
        .should("have.attr", "href")
        .and("equal", `/task/${knownIssueTaskId}/history?execution=0`);
    });
  });
});

const knownIssueTask = 'a[data-tooltip="test-cloud - Known Issue"]';
const knownIssueTaskId =
  "evergreen_ubuntu1604_test_annotations_b_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";
