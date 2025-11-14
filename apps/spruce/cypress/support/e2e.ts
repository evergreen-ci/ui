// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import {
  SLACK_NOTIFICATION_BANNER,
  SEEN_WATERFALL_ONBOARDING_TUTORIAL,
  SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL,
  SEEN_TASK_REVIEW_TOOLTIP,
  SEEN_TEST_SELECTION_GUIDE_CUE,
} from "constants/cookies";
import { hasOperationName, isMutation } from "../utils/graphql-test-utils";
// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Clear date from a LeafyGreen datepicker
       */
      clearDatePickerInput(): void;
      /**
       * Close a dismissible LeafyGreen banner with the given data-cy property.
       * @example cy.closeBanner("slack-notification")
       */
      closeBanner(dataCy: string): void;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-row-key attribute.
       * @example cy.dataRowKey('greeting')
       */
      dataRowKey(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
      /**
       * Custom command to select DOM element by data-test-id attribute.
       * @example cy.dataTestId('greeting')
       */
      dataTestId(
        value: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable<Element>;
      /**
       * Custom command to enter credentials in username and password input
       * and then click submit
       * @example cy.enterLoginCredentials()
       */
      enterLoginCredentials(): void;
      /**
       * Custom command to enter get an input by its label
       * @example cy.getInputBylabel("Some Label")
       */
      getInputByLabel(label: string | RegExp): Chainable<Element>;
      /**
       * Custom command to select an option from a leafygreen select component by label
       * @param label The label of the select component
       * @param option The option text to select
       * @example cy.selectLGOption("Some Label", "Some Option")
       */
      selectLGOption(label: string, option: string | RegExp): void;
      /**
       * Custom command to navigate to login page and log in.
       * @example cy.login({ username: "me", password: "abc" })
       * @example cy.login() // defaults to admin login
       */
      login({
        password,
        username,
      }?: {
        username: string;
        password: string;
      }): void;
      /**
       * Custom command to log out of the application.
       * @example cy.logout()
       */
      logout(): void;
      /**
       * Custom command to validate a toast was rendered
       * @example cy.validateToast("success", "This succeeded")
       * @example cy.validateToast("error", "This failed")
       * @example cy.validateToast("warning", "This is a warning")
       * @example cy.validateToast("info", "This is an info message")
       */
      validateToast(
        type: "success" | "warning" | "error" | "info",
        message: string,
        shouldClose?: boolean,
      ): void;
      /**
       * Custom command to overwrite a GQL response
       * @param operationName - The operation name of the query
       * @param body - The replacement response body
       */
      overwriteGQL(operationName: string, body: unknown): void;
      /**
       * Command to open expandable card
       * @param cardTitle - The title of the card to expand
       */
      openExpandableCard(cardTitle: string): void;
      /**
       * Command to validate date is correctly set in LeafyGreen DatePicker
       * @param dataCy - element to target
       * @param date - optional date to check, if omitted then validates the component is empty
       * @param date.year - year of date, defaults to ""
       * @param date.month - month of date, defaults to ""
       * @param date.day - day of date, defaults to ""
       */
      validateDatePickerDate(
        dataCy: string,
        date?: {
          year: string;
          month: string;
          day: string;
        },
      ): void;
      /**
       * Command to validate sort is applied to table
       * @param direction - The direction of the sort that should be applied
       */
      validateTableSort(direction: "asc" | "desc" | "none"): void;
    }
  }
}

const hostMutations = ["ReprovisionToNew", "RestartJasper", "UpdateHostStatus"];

// Close over beforeEach and afterEach to encapsulate mutationDispatched
(() => {
  let mutationDispatched: boolean;
  let clearAmboyDB: boolean;
  beforeEach(() => {
    cy.login();
    cy.setCookie(bannerCookie, "true");
    cy.setCookie(SLACK_NOTIFICATION_BANNER, "true");
    cy.setCookie(SEEN_WATERFALL_ONBOARDING_TUTORIAL, "true");
    cy.setCookie(SEEN_TASK_HISTORY_ONBOARDING_TUTORIAL, "true");
    cy.setCookie(SEEN_TASK_REVIEW_TOOLTIP, "true");
    cy.setCookie(SEEN_TEST_SELECTION_GUIDE_CUE, "true");
    mutationDispatched = false;
    clearAmboyDB = false;
    cy.intercept("POST", "/graphql/query", (req) => {
      if (isMutation(req)) {
        mutationDispatched = true;
        hostMutations.forEach((m) => {
          if (hasOperationName(req, m)) {
            clearAmboyDB = true;
          }
        });
      }
    });
  });

  afterEach(() => {
    if (mutationDispatched) {
      if (clearAmboyDB) {
        cy.log(
          "A mutation that creates an Amboy job was detected. Restoring Amboy.",
        );
        cy.exec("yarn evg-db-ops --restore amboy");
      }
      cy.log("A mutation was detected. Restoring Evergreen.");
      cy.exec("yarn evg-db-ops --restore evergreen");
    }
  });
})();

const bannerCookie = "This is an important notification";
