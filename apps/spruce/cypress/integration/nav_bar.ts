import { users } from "../constants";

const PATCH_ID = "5e4ff3abe3c3317e352062e4";
const USER_ID = "admin";
const SPRUCE_URLS = {
  admin: "/admin-settings/general",
  version: `/version/${PATCH_ID}/tasks`,
  userPatches: `/user/${USER_ID}/patches`,
  cli: `/preferences/cli`,
};
describe("Nav Bar", () => {
  const projectCookie = "mci-project-cookie";

  it("Nav Dropdown should link to patches page of most recent project if cookie exists", () => {
    cy.setCookie(projectCookie, "spruce");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
  });

  it("Nav Dropdown should link to patches page of default project in SpruceConfig if cookie does not exist", () => {
    cy.clearCookie(projectCookie);
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").should(
      "have.attr",
      "href",
      "/project/evergreen/patches",
    );
    cy.dataCy("auxiliary-dropdown-project-patches").click();
    cy.location("pathname").should("eq", "/project/evergreen/patches");
  });
  it("Should update the links in the nav bar when visiting a specific project patches page", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/project/evergreen/patches");
    cy.dataCy("patch-card").should("exist");

    cy.dataCy("waterfall-link").should(
      "have.attr",
      "href",
      "/project/evergreen/waterfall",
    );
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-settings").should(
      "have.attr",
      "href",
      "/project/evergreen/settings",
    );
    cy.getCookie(projectCookie).should("have.property", "value", "evergreen");
  });
  it("Should update the links in the nav bar when visiting a specific project settings page", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/project/spruce/settings");
    cy.dataCy("project-settings-tab-title").should("be.visible");

    cy.dataCy("waterfall-link").should(
      "have.attr",
      "href",
      "/project/spruce/waterfall",
    );
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-project-patches").should(
      "have.attr",
      "href",
      "/project/spruce/patches",
    );
    cy.getCookie(projectCookie).should("have.property", "value", "spruce");
  });

  it("Merge Queue link should navigate to project patches page with mergeQueue query param", () => {
    cy.setCookie(projectCookie, "spruce");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-merge-queue").should(
      "have.attr",
      "href",
      "/project/spruce/patches?mergeQueue=true",
    );
    cy.dataCy("auxiliary-dropdown-merge-queue").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
    cy.location("search").should("eq", "?mergeQueue=true");
  });

  it("Merge Queue link should navigate to project patches page with mergeQueue query param", () => {
    cy.setCookie(projectCookie, "spruce");
    cy.visit(SPRUCE_URLS.userPatches);
    cy.dataCy("auxiliary-dropdown-link").click();
    cy.dataCy("auxiliary-dropdown-merge-queue").should(
      "have.attr",
      "href",
      "/project/spruce/patches?mergeQueue=true",
    );
    cy.dataCy("auxiliary-dropdown-merge-queue").click();
    cy.location("pathname").should("eq", "/project/spruce/patches");
    cy.location("search").should("eq", "?mergeQueue=true");
  });

  describe("Admin settings", () => {
    it("Should show Admin button to admins", () => {
      cy.visit(SPRUCE_URLS.version);
      cy.dataCy("user-dropdown-link").click();
      cy.dataCy("admin-link")
        .should("be.visible")
        .should("have.attr", "href", SPRUCE_URLS.admin);
    });

    it("Should not show Admin button to non-admins", () => {
      cy.logout();
      cy.login(users.regular);
      cy.visit(SPRUCE_URLS.version);
      cy.dataCy("user-dropdown-link").click();
      cy.dataCy("admin-link").should("not.exist");
    });
  });
});
