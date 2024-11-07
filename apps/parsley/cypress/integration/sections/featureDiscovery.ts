describe("sections feature discovery", () => {
  beforeEach(() => {
    cy.setCookie("has-seen-sections-prod-feature-modal", "false");
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
  it("should close the feature modal when 'Let's go' is clicked", () => {
    cy.visit(taskLog);
    cy.dataCy("sections-feature-modal").should("be.visible");
    cy.contains("Let's go").click();
    cy.dataCy("sections-feature-modal").should("not.exist");
    cy.getCookie("has-seen-sections-prod-feature-modal").should(
      "have.property",
      "value",
      "true",
    );
  });
});
const taskLog =
  "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";
