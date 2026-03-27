import { getProjectSettingsRoute, project } from "./constants";

describe("projectSettings/admin_actions", () => {
  describe("Duplicating a project", () => {
    const destination = getProjectSettingsRoute(project);

    it("Successfully duplicates a project with warnings", () => {
      cy.visit(destination);
      cy.dataCy("new-project-button").click();
      cy.dataCy("new-project-menu").should("be.visible");
      cy.dataCy("copy-project-button").click();
      cy.dataCy("copy-project-modal").should("be.visible");
      cy.dataCy("performance-tooling-banner").should("be.visible");

      cy.dataCy("project-name-input").type("copied-project");

      cy.contains("button", "Duplicate").click();
      cy.validateToast(
        "warning",
        "Project cannot be enabled due to the global or repo-specific limits.",
      );

      cy.url().should("include", "copied-project");
    });
  });

  describe("Creating a new project and deleting it", () => {
    it("Successfully creates a new project and then deletes it", () => {
      // Create project
      cy.visit(getProjectSettingsRoute(project));
      cy.dataCy("new-project-button").click();
      cy.dataCy("new-project-menu").should("be.visible");
      cy.dataCy("create-project-button").click();
      cy.dataCy("create-project-modal").should("be.visible");
      cy.dataCy("performance-tooling-banner").should("be.visible");

      cy.dataCy("project-name-input").type("my-new-project");
      cy.dataCy("new-owner-select").contains("evergreen-ci");
      cy.dataCy("new-repo-input").should("have.value", "spruce");
      cy.dataCy("new-repo-input").clear();
      cy.dataCy("new-repo-input").type("new-repo");

      cy.contains("button", "Create project").click();
      // cy.validateToast(
      //   "success",
      //   "Successfully created the project “my-new-project”",
      // );
      cy.log(`Waiting for toast: create project`);
      cy.get("[data-cy=toast]", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "data-variant", "success")
        .contains("Successfully created the project “my-new-project”");

      cy.url().should("include", "my-new-project");

      // Delete project
      cy.visit(getProjectSettingsRoute("my-new-project"));
      cy.dataCy("attach-repo-button").click();
      cy.dataCy("attach-repo-modal").should("exist");
      cy.contains("button", "Attach").click();
      // cy.validateToast("success", "Successfully attached to repo");
      cy.log(`Waiting for toast: attach to repo`);
      cy.get("[data-cy=toast]", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "data-variant", "success")
        .contains("Successfully attached to repo");

      cy.dataCy("delete-project-button").scrollIntoView();
      cy.dataCy("delete-project-button").click();
      cy.dataCy("delete-project-modal").should("exist");
      cy.contains("button", "Delete").click();
      // cy.validateToast("success", "The project “my-new-project” was deleted.");
      cy.log(`Waiting for toast: delete project`);
      cy.get("[data-cy=toast]", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "data-variant", "success")
        .contains("The project “my-new-project” was deleted.");

      cy.reload();
      // cy.validateToast(
      //   "error",
      //   "There was an error loading the project my-new-project",
      // );
      cy.log(`Waiting for toast: project error`);
      cy.get("[data-cy=toast]", { timeout: 10000 })
        .should("be.visible")
        .and("have.attr", "data-variant", "error")
        .contains("There was an error loading the project my-new-project");
    });
  });
});
