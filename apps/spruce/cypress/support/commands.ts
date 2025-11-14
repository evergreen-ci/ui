import { EVG_BASE_URL, GQL_URL, users } from "../constants";
import { hasOperationName } from "../utils/graphql-test-utils";

type cyGetOptions = Parameters<typeof cy.get>[1];

/* clearDatePickerInput */
Cypress.Commands.add("clearDatePickerInput", () => {
  // LG Date Picker does not respond well to .clear()
  cy.get("input[id='day']").type(
    "{backspace}{backspace}{backspace}{backspace}{backspace}",
  );
});

/* closeBanner */
Cypress.Commands.add("closeBanner", (dataCy: string) => {
  cy.dataCy(dataCy).within(() => cy.get("[aria-label='X Icon']").click());
});

/* dataCy */
Cypress.Commands.add("dataCy", (value: string, options: cyGetOptions = {}) => {
  cy.get(`[data-cy=${value}]`, options);
});

/* dataRowKey */
Cypress.Commands.add(
  "dataRowKey",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-row-key=${value}]`, options);
  },
);

/* dataTestId */
Cypress.Commands.add(
  "dataTestId",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-testid=${value}]`, options);
  },
);

/**
 * `enterLoginCredentials` is a custom command to enter login credentials
 */
Cypress.Commands.add("enterLoginCredentials", () => {
  cy.dataCy("login-username").type(users.admin.username);
  cy.dataCy("login-password").type(users.admin.password);
  cy.dataCy("login-submit").click();
});

/* getInputByLabel */
Cypress.Commands.add("getInputByLabel", (label: string | RegExp) => {
  // LeafyGreen inputs start out with ids of "undefined". Wait until LeafyGreen components have proper ids.
  cy.contains("label", label)
    .should("have.attr", "for")
    .and("not.contain", "undefined");
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
});

/* login */
Cypress.Commands.add("login", (user = users.admin) => {
  cy.getCookie("mci-token").then((c) => {
    if (!c) {
      cy.request("POST", `${EVG_BASE_URL}/login`, user);
    }
  });
});

/* logout */
Cypress.Commands.add("logout", () => {
  cy.origin(EVG_BASE_URL, () => {
    cy.request({ url: "/logout", followRedirect: false });
  });
});

/* validateTableSort */
Cypress.Commands.add(
  "validateTableSort",
  (direction?: "asc" | "desc" | "none") => {
    switch (direction) {
      case "asc":
        cy.get("svg[aria-label='Sort Ascending Icon']").should("be.visible");
        return;
      case "desc":
        cy.get("svg[aria-label='Sort Descending Icon']").should("be.visible");
        return;
      case "none":
      default:
        cy.get("svg[aria-label='Unsorted Icon']").should("be.visible");
    }
  },
);

/* validateToast */
Cypress.Commands.add(
  "validateToast",
  (status: string, message: string, shouldClose: boolean = true) => {
    cy.dataCy("toast").should("be.visible");
    cy.dataCy("toast").should("have.attr", "data-variant", status);
    if (message) {
      cy.dataCy("toast").contains(message);
    }
    if (shouldClose) {
      cy.dataCy("toast").within(() => {
        cy.get("button[aria-label='Close Message']").click();
      });
      cy.dataCy("toast").should("not.exist");
    }
  },
);

/* selectLGOption */
Cypress.Commands.add(
  "selectLGOption",
  (label: string, option: string | RegExp) => {
    cy.getInputByLabel(label).scrollIntoView();
    cy.getInputByLabel(label).should("not.have.attr", "aria-disabled", "true");
    cy.getInputByLabel(label).click(); // open select
    cy.get('[role="listbox"]').should("have.length", 1);
    cy.get('[role="listbox"]').within(() => {
      cy.contains(option).click();
    });
  },
);

Cypress.Commands.add("overwriteGQL", (operationName: string, body: unknown) => {
  cy.intercept("POST", GQL_URL, (req) => {
    if (hasOperationName(req, operationName)) {
      req.reply((res) => {
        res.body = body;
      });
    }
  });
});

// TODO: Usage of openExpandableCard introduced in DEVPROD-2415 can be deleted after DEVPROD-2608
Cypress.Commands.add("openExpandableCard", (cardTitle: string) => {
  cy.dataCy("expandable-card-title")
    .contains(cardTitle)
    .closest("[role='button']")
    .as("card-btn");
  cy.get("@card-btn").then(($btn) => {
    if ($btn.attr("aria-expanded") !== "true") {
      cy.get("@card-btn").click();
    }
  });
});

Cypress.Commands.add(
  "validateDatePickerDate",
  (dataCy, { year, month, day } = { year: "", month: "", day: "" }) => {
    cy.dataCy(dataCy).within(() => {
      cy.get("input[id='year']").should("have.value", year);
      cy.get("input[id='month']").should("have.value", month);
      cy.get("input[id='day']").should("have.value", day);
    });
  },
);
