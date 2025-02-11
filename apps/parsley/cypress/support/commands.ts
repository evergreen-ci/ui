import { fail } from "assert";

const user = {
  password: "password",
  username: "admin",
};
const toastDataCy = "toast";

Cypress.Commands.add("addFilter", (filter: string) => {
  cy.dataCy("searchbar-select").should(
    "not.have.attr",
    "aria-disabled",
    "true",
  );
  cy.dataCy("searchbar-select").click();
  cy.dataCy("filter-option").click();
  cy.dataCy("searchbar-input").type(`${filter}`);
  cy.dataCy("searchbar-input").type("{ctrl}", { release: false });
  cy.dataCy("searchbar-input").type("{enter}");
});

Cypress.Commands.add("addHighlight", (highlight: string) => {
  cy.dataCy("searchbar-select").should(
    "not.have.attr",
    "aria-disabled",
    "true",
  );
  cy.dataCy("searchbar-select").click();
  cy.dataCy("highlight-option").click();
  cy.dataCy("searchbar-input").type(`${highlight}`);
  cy.dataCy("searchbar-input").type("{ctrl}", { release: false });
  cy.dataCy("searchbar-input").type("{enter}");
});

Cypress.Commands.add("addSearch", (search: string) => {
  cy.dataCy("searchbar-input").type(`${search}`);
});

Cypress.Commands.add("assertValueCopiedToClipboard", (value: string) => {
  cy.get("@writeText").should("have.been.calledOnceWith", value);
});

Cypress.Commands.add("clearBounds", () => {
  cy.toggleDetailsPanel(true);

  cy.dataCy("range-lower-bound").clear();
  cy.dataCy("range-upper-bound").clear();

  cy.toggleDetailsPanel(false);
});

Cypress.Commands.add(
  "clickToggle",
  (
    toggleDataCy: string,
    enabled: boolean,
    tab: "search-and-filter" | "log-viewing" = "search-and-filter",
  ) => {
    cy.toggleDetailsPanel(true);
    if (tab === "log-viewing") {
      cy.get("button[data-cy='log-viewing-tab']").click();
    }
    cy.dataCy(toggleDataCy).click();
    cy.dataCy(toggleDataCy).should("have.attr", "aria-checked", `${enabled}`);
    cy.toggleDetailsPanel(false);
  },
);

Cypress.Commands.add("dataCy", (value: string) => {
  cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
  "editBounds",
  (bounds: { upper: string; lower: string }) => {
    cy.toggleDetailsPanel(true);

    if (bounds.upper !== undefined) {
      cy.dataCy("range-upper-bound").should("be.visible");
      cy.dataCy("range-upper-bound").type(bounds.upper);
    }

    if (bounds.lower !== undefined) {
      cy.dataCy("range-lower-bound").should("be.visible");
      cy.dataCy("range-lower-bound").type(bounds.lower);
    }

    cy.toggleDetailsPanel(false);
  },
);

Cypress.Commands.add(
  "isContainedInViewport",
  { prevSubject: true },
  (subject) => {
    // @ts-expect-error - Cypress.state is not typed
    const window = Cypress.$(cy.state("window"));
    const bottom = window.height();
    const right = window.width();
    const rect = subject[0].getBoundingClientRect();

    // All corners of the element must be in the viewport
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    expect(rect.left).not.to.be.greaterThan(right);
    expect(rect.right).not.to.be.greaterThan(right);

    return subject;
  },
);

Cypress.Commands.add(
  "isNotContainedInViewport",
  { prevSubject: true },
  (subject) => {
    // @ts-expect-error - Cypress.state is not typed
    const window = Cypress.$(cy.state("window"));
    const bottom = window.height();
    const right = window.width();
    const rect = subject[0].getBoundingClientRect();

    // At least one corner of the element must be outside the viewport
    const condition = [
      rect.top < bottom,
      rect.bottom < bottom,
      rect.left < right,
      rect.right < right,
    ];
    let hasOutOfBoundsValue = false;
    for (let i = 0; i < condition.length; i++) {
      if (!condition[i]) {
        hasOutOfBoundsValue = true;
        cy.log(`Out of bounds value: ${i} ${condition[i]}`);
      }
    }
    if (!hasOutOfBoundsValue) {
      fail("Element is contained in the viewport");
    }
  },
);

Cypress.Commands.add("getInputByLabel", (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
});

Cypress.Commands.add("login", () => {
  const args = { ...user };
  cy.session(
    // Username & password can be used as the cache key too
    args,
    () => {
      cy.origin("http://localhost:9090", { args }, ({ password, username }) => {
        cy.request("POST", "/login", { password, username });
      });
    },
  );
});

Cypress.Commands.add("logout", () => {
  cy.origin("http://localhost:9090", () => {
    cy.request({ followRedirect: false, url: "/logout" });
  });
});

Cypress.Commands.add("resetDrawerState", () => {
  cy.clearCookie("has-opened-drawer");
});

Cypress.Commands.add("toggleDetailsPanel", (open: boolean) => {
  cy.dataCy("details-button").should("not.have.attr", "aria-disabled", "true");
  if (open) {
    cy.dataCy("details-menu").should("not.exist");
    cy.dataCy("details-button").click();
    cy.dataCy("details-menu").should("be.visible");
  } else {
    cy.dataCy("details-menu").should("be.visible");
    cy.dataCy("details-button").click();
    cy.dataCy("details-menu").should("not.exist");
  }
});

Cypress.Commands.add("toggleDrawer", () => {
  cy.get(`[aria-label="Collapse navigation"]`).click();
});

Cypress.Commands.add(
  "validateToast",
  (status: string, message: string, shouldClose?: boolean) => {
    cy.dataCy(toastDataCy).should("be.visible");
    cy.dataCy(toastDataCy).should("have.attr", "data-variant", status);
    if (message) {
      cy.dataCy(toastDataCy).contains(message);
    }
    if (shouldClose) {
      cy.dataCy(toastDataCy).within(() => {
        cy.get("button[aria-label='Close Message']").click();
      });
      cy.dataCy(toastDataCy).should("not.exist");
    }
  },
);

/**
 * Simulates a paste event.
 * Modified from https://gist.github.com/nickytonline/bcdef8ef00211b0faf7c7c0e7777aaf6
 * @param subject A jQuery context representing a DOM element.
 * @param pasteOptions Set of options for a simulated paste event.
 * @param pasteOptions.pastePayload Simulated data that is on the clipboard.
 * @param pasteOptions.pasteFormat The format of the simulated paste payload. Default value is 'text'.
 * @returns The subject parameter.
 * @example
 * cy.get('body').paste({
 *   pasteType: 'application/json',
 *   pastePayload: {hello: 'yolo'},
 * });
 */
Cypress.Commands.add(
  "paste",
  { prevSubject: true },
  (subject, pasteOptions) => {
    cy.log("Pasting data into the clipboard");
    const { pastePayload, pasteFormat } = pasteOptions;
    const data =
      pasteFormat === "application/json"
        ? JSON.stringify(pastePayload)
        : pastePayload;
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
    const clipboardData = new DataTransfer();
    clipboardData.setData(pasteFormat, data);
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event
    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData,
    });
    subject[0].dispatchEvent(pasteEvent);
  },
);

Cypress.Commands.overwrite("visit", (originalVisit, url, options = {}) => {
  const opts = {
    onBeforeLoad(win: Window): void {
      // Mock clipboard API.
      cy.spy(win.navigator.clipboard, "writeText").as("writeText");
    },
    ...options,
  };
  // @ts-expect-error - TypeScript detects the wrong definition for the original function.
  return originalVisit(url, opts);
});
