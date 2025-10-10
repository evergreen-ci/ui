import { mockErrorResponse } from "../utils/mockErrorResponse";
import { openSubscriptionModal } from "../utils/subscriptionModal";

const testSharedSubscriptionModalFunctionality = (
  route: string,
  dataCyModal: string,
  dataCyToggleModalButton: string,
  description: string,
  type: string,
) => {
  describe(description, () => {
    it("Displays success toast after submitting a valid form and request succeeds", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");

      cy.selectLGOption("Event", `This ${type} finishes`);
      cy.selectLGOption("Notification Method", "JIRA issue");

      cy.dataCy("jira-comment-input").type("EVG-2000");
      cy.contains("button", "Save").click();
      cy.validateToast("success", successText);
    });

    describe("Disables save button and displays an error message when populating form with invalid values", () => {
      beforeEach(() => {
        openSubscriptionModal(route, dataCyToggleModalButton);
        cy.dataCy(dataCyModal).should("be.visible");
      });

      it("has an invalid percentage", () => {
        cy.selectLGOption("Event", "changes by some percentage");
        cy.dataCy("percent-change-input").clear();
        cy.dataCy("percent-change-input").type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextPercent).should("exist");
        saveButtonEnabled(false);
        cy.dataCy("percent-change-input").clear();
        cy.dataCy("percent-change-input").type("100");
        saveButtonEnabled();
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid duration value", () => {
        cy.selectLGOption("Event", "exceeds some duration");
        cy.dataCy("duration-secs-input").clear();
        cy.dataCy("duration-secs-input").type("-100");
        cy.dataCy("jira-comment-input").type("EVG-2000");
        cy.contains(errorTextDuration).should("exist");
        saveButtonEnabled(false);
        cy.dataCy("duration-secs-input").clear();
        cy.dataCy("duration-secs-input").type("100");
        saveButtonEnabled();
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid jira ticket", () => {
        cy.dataCy("jira-comment-input").type("E");
        saveButtonEnabled(false);
        cy.dataCy("jira-comment-input").type("EVG-100");
        saveButtonEnabled();
        cy.dataCy("jira-comment-input").clear();
      });
      it("has an invalid email", () => {
        cy.selectLGOption("Notification Method", "Email");
        cy.dataCy("email-input").clear();
        cy.dataCy("email-input").type("arst");
        saveButtonEnabled(false);
        cy.dataCy("email-input").type("rat@rast.com");
        saveButtonEnabled();
      });
      it("has an invalid slack username", () => {
        cy.selectLGOption("Notification Method", "Slack message");
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("sa rt");
        saveButtonEnabled(false);
        cy.dataCy("slack-input").clear();
        cy.dataCy("slack-input").type("@sart");
        saveButtonEnabled();
      });
    });

    it("Displays error toast when save subscription request fails", () => {
      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      cy.selectLGOption("Event", `This ${type} finishes`);
      cy.dataCy("jira-comment-input").type("EVG-2000");
      mockErrorResponse({
        path: "SaveSubscription",
        errorMessage: "error",
      });
      cy.contains("button", "Save").click();
      cy.validateToast("error", "Error adding your subscription");
    });

    it("Hides the modal after clicking the cancel button", () => {
      cy.visit(route);
      cy.dataCy(dataCyToggleModalButton).click();
      cy.dataCy(dataCyModal).should("be.visible");
      cy.contains("button", "Cancel").click();
      cy.dataCy(dataCyModal).should("not.be.visible");
    });

    it("Pulls initial values from cookies", () => {
      const triggerCookie = `${type}-notification-trigger`;
      cy.setCookie(triggerCookie, `${type}-succeeds`);
      const subscriptionCookie = "subscription-method";
      cy.setCookie(subscriptionCookie, "slack");

      openSubscriptionModal(route, dataCyToggleModalButton);
      cy.dataCy(dataCyModal).should("be.visible");
      cy.contains(`This ${type} succeeds`).should("be.visible");
      cy.contains("Slack").should("be.visible");

      cy.clearCookie(subscriptionCookie);
      cy.clearCookie(triggerCookie);
    });

    const successText = "Your subscription has been added";
    const errorTextPercent = "Value should be >= 0";
    const errorTextDuration = "Value should be >= 0";
  });
};

testSharedSubscriptionModalFunctionality(
  "/task/evergreen_ubuntu1604_test_model_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48/logs",
  "task-notification-modal",
  "notify-task",
  "Task Subscription Modal",
  "task",
);

testSharedSubscriptionModalFunctionality(
  "/version/5e4ff3abe3c3317e352062e4/tasks",
  "patch-notification-modal",
  "notify-patch",
  "Version Subscription Modal",
  "version",
);

const saveButtonEnabled = (isEnabled: boolean = true) => {
  cy.contains("button", "Save").should(
    isEnabled ? "not.have.attr" : "have.attr",
    "aria-disabled",
    "true",
  );
};
