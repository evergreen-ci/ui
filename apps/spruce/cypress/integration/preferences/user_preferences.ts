const baseRoute = "/preferences";
const tabNames = {
  profile: "/profile",
  cli: "/cli",
  uiSettings: "/ui-settings",
};
describe("user preferences pages", () => {
  it("visiting /preferences should redirect to the profile tab", () => {
    cy.visit(baseRoute);
    cy.url().should("include", `${baseRoute}${tabNames.profile}`);
  });
  it("should be able to navigate between tabs using the side nav", () => {
    cy.visit(baseRoute);
    cy.dataCy("preferences-tab-title").should("have.text", "Profile");
    cy.dataCy("notifications-nav-tab").click();
    cy.dataCy("preferences-tab-title").should("have.text", "Notifications");
  });
  it("should be able to reset Evergreen API key", () => {
    const defaultApiKey = "abb623665fdbf368a1db980dde6ee0f0";
    cy.visit(`${baseRoute}${tabNames.cli}`);
    cy.contains("Download the authentication file.").scrollIntoView();
    cy.contains(defaultApiKey).should("be.visible");
    cy.contains("button", "Reset key").click();
    cy.contains(defaultApiKey).should("not.exist");
  });

  describe("ui settings", () => {
    describe("beta features", () => {
      it("should be able to edit beta features", () => {});
    });

    describe("task review", () => {
      beforeEach(async () => {
        // Clear IndexedDB data to reset reviewed status between runs
        if (window.indexedDB.databases) {
          const dbs = await window.indexedDB.databases();
          dbs.forEach((db) => {
            window.indexedDB.deleteDatabase(db.name);
          });
        }
      });

      it("disabling task review should hide review button on a task page", () => {
        const failedTaskRoute =
          "/task/evergreen_ubuntu1604_test_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48";

        cy.visit(failedTaskRoute);
        cy.contains("button", "Mark reviewed").click();
        cy.contains("button", "Mark unreviewed").should("be.visible");

        cy.dataCy("user-dropdown-link").click();
        cy.contains("a", "UI Settings").click();
        cy.getInputByLabel("Task review").uncheck({ force: true });
        cy.getInputByLabel("Task review").should("not.be.checked");
        cy.go("back");
        cy.contains("button", "Mark unreviewed").should("not.exist");
      });
    });
  });
});
