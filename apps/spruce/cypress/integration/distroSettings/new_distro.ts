const distroSettingPage = "/distro/rhel71-power8-large/settings/general";

describe("Creating a new distro", () => {
  beforeEach(() => {
    cy.visit(distroSettingPage);
  });

  it("Allows a user to create a new distro", () => {
    const newDistroId = "new-distro";

    cy.dataCy("new-distro-button").click();
    cy.dataCy("new-distro-menu").should("be.visible");
    cy.dataCy("create-distro-button").click();
    cy.dataCy("create-distro-modal").should("be.visible");
    cy.dataCy("distro-id-input").type(newDistroId);
    cy.contains("button", "Create").click();
    cy.validateToast("success", `Created distro “${newDistroId}”`);
    cy.location("pathname").should(
      "eq",
      `/distro/${newDistroId}/settings/general`,
    );

    cy.dataCy("delete-distro-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.dataCy("delete-distro-button").click();
    cy.dataCy("delete-distro-modal").should("be.visible");
    cy.dataCy("delete-distro-modal").within(() => {
      cy.get("input").type(newDistroId);
    });
    cy.contains("button", /^Delete$/).click();
    cy.validateToast("success", `The distro “${newDistroId}” was deleted.`);
  });
});

describe("Copying a distro", () => {
  beforeEach(() => {
    cy.visit(distroSettingPage);
  });

  it("Allows a user to copy an existing distro", () => {
    const copyDistroId = "copy-distro";

    cy.dataCy("new-distro-button").click();
    cy.dataCy("new-distro-menu").should("be.visible");
    cy.dataCy("copy-distro-button").click();
    cy.dataCy("copy-distro-modal").should("be.visible");
    cy.dataCy("distro-id-input").type(copyDistroId);
    cy.contains("button", "Duplicate").click();
    cy.validateToast("success", `Created distro “${copyDistroId}”`);
    cy.location("pathname").should(
      "eq",
      `/distro/${copyDistroId}/settings/general`,
    );

    cy.dataCy("delete-distro-button").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.dataCy("delete-distro-button").click();
    cy.dataCy("delete-distro-modal").should("be.visible");
    cy.dataCy("delete-distro-modal").within(() => {
      cy.get("input").type(copyDistroId);
    });
    cy.contains("button", /^Delete$/).click();
    cy.validateToast("success", `The distro “${copyDistroId}” was deleted.`);
  });
});
