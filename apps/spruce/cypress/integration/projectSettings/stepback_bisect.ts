import { clickSave } from "../../utils";
import { getGeneralRoute, project, projectUseRepoEnabled } from "./constants";

describe("Stepback bisect setting", () => {
  describe("Repo project present", () => {
    const destination = getGeneralRoute(projectUseRepoEnabled);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as default to repo", () => {
      cy.dataCy("stepback-bisect-group")
        .contains("Default to repo")
        .find("input")
        .should("have.attr", "aria-checked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      cy.dataCy("stepback-bisect-group").contains("Enable").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();

      cy.dataCy("stepback-bisect-group")
        .contains("Enable")
        .find("input")
        .should("have.attr", "aria-checked", "true");
    });
  });

  describe("Repo project not present", () => {
    const destination = getGeneralRoute(project);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as disabled", () => {
      cy.dataCy("stepback-bisect-group")
        .contains("Disable")
        .find("input")
        .should("have.attr", "aria-checked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      cy.dataCy("stepback-bisect-group").contains("Enable").click();

      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();

      cy.dataCy("stepback-bisect-group")
        .contains("Enable")
        .find("input")
        .should("have.attr", "aria-checked", "true");
    });
  });
});
