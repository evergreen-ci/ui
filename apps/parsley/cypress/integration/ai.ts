const logLink =
  "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

describe("Parsley AI", () => {
  beforeEach(() => {
    cy.visit(logLink);
  });

  it("opens the AI drawer and logs in", () => {
    cy.dataCy("ansi-row").should("be.visible");
    cy.contains("button", "Parsley AI").click();
    cy.contains("button", "Enable it!").click();
    cy.contains("button", "Enable it!").should("not.exist");

    // Ensure new settings are loaded with AI enabled
    cy.reload();

    cy.intercept("GET", `http://localhost:8080/login`, {
      statusCode: 200,
      body: {
        message: "Logged in successfully, you may close this window",
      },
    }).as("login");
    cy.contains("button", "Parsley AI").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.contains("button", "Parsley AI").click();
    cy.contains("Suggested Prompts").should("be.visible");
  });
});
