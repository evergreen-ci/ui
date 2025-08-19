import { clickSave } from "../../utils";

describe("background processing", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can save after making changes", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Amboy section.
    const singleWorker = "Single Worker Name";
    cy.getInputByLabel(singleWorker).as("amboyInput");
    cy.get("@amboyInput").clear();
    cy.get("@amboyInput").type("new single worker name");

    const namedQueueList = "named-queue-list";
    cy.dataCy(namedQueueList).as("amboyList");
    cy.get("@amboyList")
      .children()
      .eq(0)
      .within(() => {
        cy.dataCy("delete-item-button").click();
      });

    // Logger section.
    const defaultLevel = "Default Level";
    cy.getInputByLabel(defaultLevel).as("loggerSelect");
    cy.selectLGOption(defaultLevel, "Alert");

    cy.getInputByLabel("Redact Keys").as("loggerChipInput");
    cy.get("@loggerChipInput").type("aNewRedactedKey{enter}");

    const asyncBuffer = "Use asynchronous buffered logger";
    cy.getInputByLabel(asyncBuffer).as("loggerCheckbox");
    cy.get("@loggerCheckbox").uncheck({ force: true });

    // Notification Rate Limits section.
    const timeInterval = "Time Interval (secs)";
    cy.getInputByLabel(timeInterval).as("notificationRateLimitsInput");
    cy.get("@notificationRateLimitsInput").clear();
    cy.get("@notificationRateLimitsInput").type("1");

    // Triggers section.
    const generateTasksDistro = "Distro for Generated Tasks";
    cy.getInputByLabel(generateTasksDistro).as("triggersSelect");
    cy.selectLGOption(generateTasksDistro, "localhost");

    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.reload();

    // Need to redefine these aliases as the addition / deletion of elements from the
    // form has caused the mapping of these items to change.
    cy.getInputByLabel(singleWorker).as("amboyInput");
    cy.dataCy(namedQueueList).as("amboyList");
    cy.getInputByLabel(defaultLevel).as("loggerSelect");
    cy.getInputByLabel(asyncBuffer).as("loggerCheckbox");
    cy.getInputByLabel(timeInterval).as("notificationRateLimitsInput");
    cy.getInputByLabel(generateTasksDistro).as("triggersSelect");

    cy.get("@amboyInput").should("have.value", "new single worker name");
    cy.get("@amboyList").should("have.length", 1);
    cy.get("@loggerSelect").should("have.value", "ALERT");
    cy.dataCy("logger").within(() => {
      cy.dataCy("filter-chip").should("have.length", 4);
      cy.contains("aNewRedactedKey").should("exist");
    });
    cy.get("@loggerCheckbox").should("not.be.checked");
    cy.get("@notificationRateLimitsInput").should("have.value", "1");
    cy.get("@triggersSelect").should("have.value", "localhost");

    // Ensure that Notify SES Input has not changed.
    cy.getInputByLabel("SES Email").should(
      "have.value",
      "evg-sender@email.com",
    );
  });
});
