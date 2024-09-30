import { data } from "cypress/types/jquery";

describe("Sectioning", () => {
    beforeEach(() => {
        cy.visit(`${logLink}?shareLine=0`)
        cy.clickToggle("sections-toggle", true, "log-viewing")
    })
    it("Toggling the sections options displays and hides sections", () => {
        // Check that sections is toggled
        cy.toggleDetailsPanel(true)
        cy.get("button[data-cy='log-viewing-tab']").click();
        cy.dataCy("sections-toggle").should("have.attr", "aria-checked", "true");
        cy.toggleDetailsPanel(false)
        // Assert sections are visible
        cy.dataCy("section-header").should("be.visible")
        // Untoggle sections and assert they are hidden
        cy.clickToggle("sections-toggle", false, "log-viewing" )
        cy.dataCy("section-header").should("not.exist")
    })
    it("Clicking 'Open all subsections' opens all subsections", () => {
        cy.dataCy("open-all-sections-btn").click()
        cy.dataCy("caret-toggle").should("have.attr", "aria-label", "Click to close section")
        cy.dataCy("caret-toggle").should("not.have.attr", "aria-label", "Click to open section")
    })
    it("Clicking 'Close all subsections' opens all subsections", () => {
        cy.dataCy("close-all-sections-btn").click()
        cy.dataCy("caret-toggle").should("have.attr", "aria-label", "Click to open section")
        cy.dataCy("caret-toggle").should("not.have.attr", "aria-label", "Click to close section")
    })
    it("Clicking on a closed caret opens the section and renders the subsection contents ", () => {
        cy.get("[data-index='4'] > [data-cy='section-header']").contains("Function: f_expansions_write")
        cy.get("[data-index='3'] > [data-cy='section-header'] > [data-cy='caret-toggle']").click()
        cy.get("[data-index='4'] > [data-cy='section-header']").contains("Command: expansions.update (step 1 of 2)")
        
    })
    it.only("Clicking on an open caret closes the section and hides the subsection contents", () => {
        cy.get("[data-index='9'] > [data-cy='section-header']").contains("Command: expansions.write (step 2.1 of 2)")
        cy.get("[data-index='8'] > [data-cy='section-header'] > [data-cy='caret-toggle']").click()
    })
    const logLink = "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";
});

  