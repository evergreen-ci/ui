describe("sections feature discovery", () => {
  beforeEach(() => {
    cy.setCookie("has-seen-sections-beta-guide-cue", "false");
    cy.setCookie("has-seen-sections-beta-feature-modal", "false");
  });
  it("should only show the feature modal when viewing a task log", () => {
    cy.visit(
      "/resmoke/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/job0/all",
    );
    cy.dataCy("sections-feature-modal").should("not.exist");
    cy.visit(
      "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld",
    );
    cy.dataCy("sections-feature-modal").should("not.exist");
    cy.visit(taskLog);
    cy.dataCy("sections-feature-modal").should("be.visible");
  });
  it("should close the feature modal and open the details modal and display 2 guide cues when Enabled sections is clicked", () => {
    cy.visit(taskLog);
    cy.dataCy("sections-feature-modal").should("be.visible");
    cy.dataCy("details-menu").should("not.exist");
    cy.contains("Enable sectioning").click();
    cy.dataCy("sections-feature-modal").should("not.exist");
    cy.dataCy("details-menu").should("be.visible");
    cy.getCookie("has-seen-sections-beta-feature-modal").should(
      "have.property",
      "value",
      "true",
    );
    cy.dataCy("sections-cue-1").should("be.visible");
    // outside click should not close details menu when guide cue is visible
    cy.get("body").click("topRight");
    cy.dataCy("details-menu").should("be.visible");
    cy.dataCy("sections-cue-2").should("not.exist");
    cy.contains("Got it").click();
    cy.dataCy("sections-cue-1").should("not.exist");
    cy.dataCy("sections-cue-2").should("be.visible");
    cy.getCookie("has-seen-sections-beta-guide-cue").should(
      "have.property",
      "value",
      "false",
    );
    cy.contains("Got it").click();
    cy.getCookie("has-seen-sections-beta-guide-cue").should(
      "have.property",
      "value",
      "true",
    );
    cy.dataCy("sections-cue-2").should("not.exist");
    // outside click should dismiss details menu when guide cue is not visible
    cy.get("body").click("topRight");
    cy.dataCy("details-menu").should("not.exist");
    // Introductory modal and guide cue should not be visible after refresh
    cy.reload();
    cy.dataCy("sections-feature-modal").should("not.exist");
    cy.dataCy("details-menu").should("not.exist");
    cy.dataCy("sections-cue-1").should("not.exist");
    cy.dataCy("sections-cue-2").should("not.exist");
  });
});
const taskLog =
  "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";
