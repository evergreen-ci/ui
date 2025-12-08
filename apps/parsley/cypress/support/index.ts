import "./commands";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a filter.
       * @example cy.addFilter('myFilter')
       */
      addFilter(filter: string): void;
      /**
       * Custom command to add a highlight.
       * @example cy.addHighlight('myHighlight')
       */
      addHighlight(highlight: string): void;
      /**
       * Custom command to add a search.
       * @example cy.addSearch('mySearch')
       */
      addSearch(search: string): void;
      /**
       * Custom command to validate that a value was copied to the clipboard.
       * @example cy.assertValueCopiedToClipboard("This is some text")
       */
      assertValueCopiedToClipboard(text: string): void;
      /**
       * Custom command to click one of the toggles in the Details Menu panel.
       * @param toggleDataCy The data-cy attribute of the toggle to click.
       * @param enable Whether the toggle should be enabled or disabled.
       * @param tab The tab to click before clicking the toggle. Defaults to "search-and-filter".
       * @example cy.clickToggle('wrap-toggle', true, 'log-viewing')
       */
      clickToggle(
        toggleDataCy: string,
        enable: boolean,
        tab?: "search-and-filter" | "log-viewing",
      ): void;
      /**
       * Custom command to clear the search range bounds in the Details Menu panel.
       */
      clearBounds(): void;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      /**
       * Custom command to edit the search range bounds in the Details Menu panel.
       * @example cy.editBounds({ lower: 5, upper: 10 })
       */
      editBounds(bounds: { upper?: string; lower?: string }): void;
      /**
       * Custom command to determine if an element is not contained in the viewport.
       * @example cy.isNotContainedInViewport()
       * @example cy.isNotContainedInViewport().should('be.visible')
       */
      isNotContainedInViewport(): Chainable<Element>;
      /**
       * Custom command to determine if an element is contained in the viewport.
       * @example cy.isContainedInViewport()
       * @example cy.isContainedInViewport().should('be.visible')
       */
      isContainedInViewport(): Chainable<Element>;
      /**
       * Custom command to enter get an input by its label
       * @example cy.getInputBylabel("Some Label")
       */
      getInputByLabel(label: string): Chainable<Element>;
      /**
       * Custom command to log in to the application.
       * @example cy.login()
       */
      login(): void;
      /**
       * Custom command to log out of the application.
       * @example cy.logout()
       */
      logout(): void;
      /**
       * Custom command to reset the drawer cookie.
       * @example cy.resetDrawerState()
       */
      resetDrawerState(): void;
      /**
       * Custom command to open and close the Details Panel.
       * @example cy.toggleDetailsPanel(true)
       */
      toggleDetailsPanel(open: boolean): void;
      /**
       * Custom command to open and close the Leafygreen SideNav.
       */
      toggleDrawer(): void;
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
       * Simulates a paste event.
       * Modified from https://gist.github.com/nickytonline/bcdef8ef00211b0faf7c7c0e7777aaf6
       * @param pasteOptions Set of options for a simulated paste event.
       * @param pasteOptions.pastePayload Simulated data that is on the clipboard.
       * @param pasteOptions.pasteFormat The format of the simulated paste payload. Default value is 'text'.
       * @returns The subject parameter.
       * @example
       * cy.get('body').paste({
       *   pasteFormat: 'application/json',
       *   pastePayload: {hello: 'yolo'},
       * });
       */
      paste(pasteOptions: {
        pastePayload: string;
        pasteFormat?: string;
      }): Chainable<Element>;
    }
  }
}

// Close over beforeEach and afterEach to encapsulate mutationDispatched
(() => {
  let mutationDispatched: boolean;
  beforeEach(() => {
    cy.login();
    cy.setCookie("drawer-opened", "true");
    cy.setCookie("has-seen-searchbar-guide-cue-tab-complete", "true");
    cy.setCookie("has-seen-sections-prod-feature-modal", "true");
    mutationDispatched = false;
    cy.intercept("POST", "/graphql/query", (req) => {
      const isMutation = req.body.query?.startsWith("mutation");
      if (isMutation) {
        mutationDispatched = true;
      }
    });
  });

  afterEach(() => {
    if (mutationDispatched) {
      cy.log("A mutation was detected. Restoring Evergreen.");
      cy.exec("yarn evg-db-ops --restore evergreen");
    }
  });
})();
