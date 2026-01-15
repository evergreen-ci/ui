import { save } from "./utils";

describe("general section", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/general");
    cy.dataCy("distro-settings-page").should("exist");
  });

  it("can update fields and those changes will persist", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Update fields.
    cy.contains("button", "Add alias").should(
      "have.attr",
      "aria-disabled",
      "false",
    );
    cy.contains("button", "Add alias").click();
    cy.getInputByLabel("Alias").type("localhost-alias");
    cy.getInputByLabel("Notes").type("this is a note");
    cy.getInputByLabel("Warnings").type("this is a warning");
    cy.getInputByLabel("Disable shallow clone for this distro").check({
      force: true,
    });
    cy.getInputByLabel("Admin only").check({ force: true });
    save();
    cy.validateToast("success", "Updated distro.");

    // Changes should persist.
    cy.reload();
    cy.dataCy("distro-settings-page").should("exist");
    cy.getInputByLabel("Alias").should("have.value", "localhost-alias");
    cy.getInputByLabel("Notes").should("have.value", "this is a note");
    cy.getInputByLabel("Warnings").should("have.value", "this is a warning");
    cy.getInputByLabel("Disable shallow clone for this distro").should(
      "be.checked",
    );
    cy.getInputByLabel("Admin only").should("be.checked");

    // Undo changes.
    cy.dataCy("delete-item-button").click();
    cy.getInputByLabel("Notes").clear();
    cy.getInputByLabel("Warnings").clear();
    cy.getInputByLabel("Disable shallow clone for this distro").uncheck({
      force: true,
    });
    cy.getInputByLabel("Admin only").uncheck({ force: true });
    save();
    cy.validateToast("success", "Updated distro.");
  });

  describe("container pool distro", () => {
    beforeEach(() => {
      cy.visit("/distro/ubuntu1604-parent/settings/general");
    });

    it("warns users that the distro will not be spawned for tasks", () => {
      cy.contains(
        "Distro is a container pool, so it cannot be spawned for tasks.",
      ).should("be.visible");
    });
  });

  describe("single task distro", () => {
    beforeEach(() => {
      cy.visit("/distro/localhost/settings/general");
      cy.dataCy("distro-settings-page").should("exist");
    });

    it("can toggle a distro as single task distro and shows a warning banner that dismisses on save", () => {
      cy.dataCy("single-task-banner").should("not.exist");
      cy.getInputByLabel("Set distro as Single Task Distro").scrollIntoView();
      cy.getInputByLabel("Set distro as Single Task Distro").should(
        "have.attr",
        "aria-disabled",
        "false",
      );
      cy.getInputByLabel("Set distro as Single Task Distro").check({
        force: true,
      });
      cy.dataCy("single-task-banner").contains(
        "This Distro will be converted to a Single Task Distro once saved. Please review before confirming.",
      );
      save();
      cy.dataCy("single-task-banner").should("not.exist");
      cy.validateToast("success", "Updated distro.");
      cy.reload();
      cy.getInputByLabel("Set distro as Single Task Distro").should(
        "be.checked",
      );
      cy.dataCy("single-task-banner").should("not.exist");
      cy.getInputByLabel("Set distro as Single Task Distro").scrollIntoView();
      cy.getInputByLabel("Set distro as Single Task Distro").should(
        "have.attr",
        "aria-disabled",
        "false",
      );
      cy.getInputByLabel("Set distro as Single Task Distro").uncheck({
        force: true,
      });
      cy.dataCy("single-task-banner").contains(
        "This Distro will no longer be a Single Task Distro once saved. Please review before confirming.",
      );
      save();
      cy.dataCy("single-task-banner").should("not.exist");
      cy.validateToast("success", "Updated distro.");
    });
  });
});
