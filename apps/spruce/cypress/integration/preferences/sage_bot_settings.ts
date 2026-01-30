import { hasOperationName } from "../../utils/graphql-test-utils";

const GQL_PATH = "**/graphql/query";

interface MockState {
  keyConfigured: boolean;
  keyLastFour: string;
}

const setupSageMocks = (initialState: MockState) => {
  const state = { ...initialState };

  cy.intercept("POST", GQL_PATH, (req) => {
    if (hasOperationName(req, "CursorSettings")) {
      req.reply({
        data: {
          cursorSettings: {
            __typename: "CursorSettings",
            keyConfigured: state.keyConfigured,
            keyLastFour: state.keyConfigured ? state.keyLastFour : "",
          },
        },
      });
    } else if (hasOperationName(req, "SetCursorAPIKey")) {
      state.keyConfigured = true;
      state.keyLastFour = "2345";
      req.reply({
        data: {
          setCursorAPIKey: {
            __typename: "SetCursorAPIKeyPayload",
            keyLastFour: state.keyLastFour,
            success: true,
          },
        },
      });
    } else if (hasOperationName(req, "DeleteCursorAPIKey")) {
      state.keyConfigured = false;
      state.keyLastFour = "";
      req.reply({
        data: {
          deleteCursorAPIKey: {
            __typename: "DeleteCursorAPIKeyPayload",
            success: true,
          },
        },
      });
    }
  });
};

describe("Sage Bot Settings", () => {
  const route = "/preferences/sage-bot-settings";

  it("should navigate to Sage Bot Settings from sidebar and display the tab", () => {
    setupSageMocks({ keyConfigured: false, keyLastFour: "" });
    cy.visit("/preferences/profile");
    cy.dataCy("sage-bot-settings-nav-tab").click();
    cy.url().should("include", "/preferences/sage-bot-settings");
    cy.dataCy("cursor-api-key-card").should("be.visible");
    cy.contains("Cursor API Key").should("be.visible");
  });

  it("should have a disabled save button when input is empty", () => {
    setupSageMocks({ keyConfigured: false, keyLastFour: "" });
    cy.visit(route);
    cy.dataCy("save-cursor-api-key-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  });

  it("should enable save button when API key is entered", () => {
    setupSageMocks({ keyConfigured: false, keyLastFour: "" });
    cy.visit(route);
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
  });

  it("should save cursor API key and show success toast", () => {
    setupSageMocks({ keyConfigured: false, keyLastFour: "" });
    cy.visit(route);
    cy.dataCy("cursor-api-key-input").type("test-api-key-12345");
    cy.dataCy("save-cursor-api-key-button").click();
    cy.validateToast("success", "Cursor API key saved successfully");

    // After saving, the key status should show the last 4 characters
    cy.dataCy("cursor-key-status").should("be.visible");
    cy.dataCy("delete-cursor-api-key-button").should("be.visible");
  });

  it("should delete cursor API key and show success toast", () => {
    setupSageMocks({ keyConfigured: true, keyLastFour: "2345" });
    cy.visit(route);
    cy.dataCy("delete-cursor-api-key-button").click();
    cy.validateToast("success", "Cursor API key deleted successfully");
    cy.dataCy("delete-cursor-api-key-button").should("not.exist");
  });
});
