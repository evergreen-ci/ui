import { clickSave } from "../../utils";

/**
 * Save a project or repo settings page. Clicking the save button opens a diff
 * confirmation modal which must be accepted to persist the change.
 */
export const clickSaveAndConfirmDiff = () => {
  clickSave();
  cy.dataCy("save-changes-modal").should("be.visible");
  cy.dataCy("save-changes-modal").contains("button", "Save changes").click();
  cy.dataCy("save-changes-modal").should("not.exist");
};
