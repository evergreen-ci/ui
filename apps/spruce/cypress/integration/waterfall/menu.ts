import { mockErrorResponse } from "../../utils/mockErrorResponse";

describe("Waterfall menu settings", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("displays Settings section with omit inactive builds option", () => {
    cy.dataCy("waterfall-menu").click();
    cy.contains("Settings").should("be.visible");
    cy.dataCy("omit-inactive-builds-checkbox").should("be.visible");
  });

  it("toggles the omit inactive builds checkbox and persists the setting", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("omit-inactive-builds-checkbox").should("not.be.checked");
    cy.dataCy("omit-inactive-builds-checkbox").check({ force: true });
    cy.dataCy("omit-inactive-builds-checkbox").should("be.checked");

    cy.reload();
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("omit-inactive-builds-checkbox").should("be.checked");

    cy.dataCy("omit-inactive-builds-checkbox").uncheck({ force: true });
  });

  it("omits inactive build variants when filter is applied and setting is enabled", () => {
    cy.dataCy("build-variant-filter-input").type("Lint{enter}");
    cy.dataCy("build-variant-label").should("have.length", 1);

    cy.dataCy("waterfall-menu").click();
    cy.dataCy("omit-inactive-builds-checkbox").check({ force: true });
    cy.get("body").click();

    cy.dataCy("build-variant-filter-input").clear();
    cy.dataCy("build-variant-filter-input").type("Ubuntu{enter}");

    cy.dataCy("build-variant-label").should("have.length.at.least", 1);

    cy.dataCy("waterfall-menu").click();
    cy.dataCy("omit-inactive-builds-checkbox").uncheck({ force: true });
  });
});

describe("Waterfall subscription modal", () => {
  const route = "/project/spruce/waterfall";
  const type = "project";
  const dataCyModal = "waterfall-notification-modal";
  const errorTextRegex = "Value should be a valid regex expression.";
  const successText = "Your subscription has been added";

  beforeEach(() => {
    cy.visit(route);
  });

  it("Displays success toast after submitting a valid form and request succeeds", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    cy.selectLGOption("Event", "Any version finishes");
    cy.selectLGOption("Notification Method", "JIRA issue");

    cy.dataCy("jira-comment-input").type("EVG-2000");
    saveButtonEnabled();
    cy.contains("button", "Save").click();
    cy.validateToast("success", successText);
  });

  it("Disables save button and displays an error message when populating form with invalid values", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    cy.selectLGOption("Event", "Any build finishes");
    cy.dataCy("add-button").click();
    saveButtonEnabled(false);

    cy.dataCy("jira-comment-input").type("EVG-2000");
    cy.dataCy("regex-input").type("*.notValidRegex");
    cy.contains(errorTextRegex).should("exist");
    saveButtonEnabled(false);

    cy.dataCy("regex-input").clear();
    cy.dataCy("regex-input").type("validRegex");
    cy.contains("button", "Save").click();
    cy.validateToast("success", successText);
  });

  it("Displays error toast when save subscription request fails", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");

    cy.selectLGOption("Event", "Any version finishes");
    cy.dataCy("jira-comment-input").type("EVG-2000");
    mockErrorResponse({
      path: "SaveSubscription",
      errorMessage: "error",
    });
    cy.contains("button", "Save").click();
    cy.validateToast("error", "Error adding your subscription");
  });

  it("Hides the modal after clicking the cancel button", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");
    cy.contains("button", "Cancel").click();
    cy.dataCy(dataCyModal).should("not.exist");
  });

  it("Pulls initial values from cookies", () => {
    const triggerCookie = `${type}-notification-trigger`;
    cy.setCookie(triggerCookie, `any-build-fails`);
    const subscriptionCookie = "subscription-method";
    cy.setCookie(subscriptionCookie, "slack");

    cy.reload();
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("add-notification").click();
    cy.dataCy(dataCyModal).should("be.visible");
    cy.contains("Any build fails").should("be.visible");
    cy.contains("Slack").should("be.visible");

    cy.clearCookie(subscriptionCookie);
    cy.clearCookie(triggerCookie);
  });
});

const saveButtonEnabled = (isEnabled: boolean = true) => {
  cy.contains("button", "Save").should(
    isEnabled ? "not.have.attr" : "have.attr",
    "aria-disabled",
    "true",
  );
};
