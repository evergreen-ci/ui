import { users } from "../../constants";
import {
  projectUseRepoEnabled,
  getRepoSettingsRoute,
  getProjectSettingsRoute,
  repo,
} from "./constants";

describe("project/repo permissions", () => {
  beforeEach(() => {
    cy.logout();
  });

  describe("projects", () => {
    it("disables fields when user lacks edit permissions", () => {
      cy.login(users.privileged);
      cy.visit(getProjectSettingsRoute(projectUseRepoEnabled));
      cy.dataCy("project-settings-page").within(() => {
        cy.get('input[type="radio"]').should(
          "have.attr",
          "aria-disabled",
          "true",
        );
      });
    });

    it("enables fields if user has edit permissions", () => {
      cy.login(users.admin);
      cy.visit(getProjectSettingsRoute(projectUseRepoEnabled));
      cy.dataCy("project-settings-page").within(() => {
        cy.get('input[type="radio"]').should(
          "have.attr",
          "aria-disabled",
          "false",
        );
      });
    });
  });

  describe("repos", () => {
    it("disables fields when user lacks edit permissions", () => {
      cy.login(users.privileged);
      cy.visit(getRepoSettingsRoute(repo));
      cy.dataCy("repo-settings-page").within(() => {
        cy.get('input[type="radio"]').should(
          "have.attr",
          "aria-disabled",
          "true",
        );
      });
    });

    it("enables fields if user has edit permissions", () => {
      cy.login(users.admin);
      cy.visit(getRepoSettingsRoute(repo));
      cy.dataCy("repo-settings-page").within(() => {
        cy.get('input[type="radio"]').should(
          "have.attr",
          "aria-disabled",
          "false",
        );
      });
    });
  });
});
