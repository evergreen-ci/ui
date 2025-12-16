describe("Sectioning", () => {
  beforeEach(() => {
    cy.visit(`${logLink}?shareLine=0`);
    cy.clickToggle("sections-toggle", true, "log-viewing");
  });

  it("Toggling the sections options displays and hides sections", () => {
    // Check that sections is toggled
    cy.toggleDetailsPanel(true);
    cy.get("button[data-cy='log-viewing-tab']").click();
    cy.dataCy("sections-toggle").should("have.attr", "aria-checked", "true");
    cy.toggleDetailsPanel(false);
    // Assert sections are visible
    cy.dataCy("section-header").should("be.visible");
    // Untoggle sections and assert they are hidden
    cy.clickToggle("sections-toggle", false, "log-viewing");
    cy.dataCy("section-header").should("not.exist");
  });

  it("Clicking 'Open all subsections' opens all subsections", () => {
    cy.dataCy("open-all-sections-btn").click();
    cy.dataCy("caret-toggle").should(
      "have.attr",
      "aria-label",
      "Close section",
    );
    cy.dataCy("caret-toggle").should(
      "not.have.attr",
      "aria-label",
      "Open section",
    );
    cy.dataCy("section-header").each((header) => {
      cy.wrap(header).should("have.attr", "aria-expanded", "true");
    });
    cy.get("[title='Use shift+click to select multiple lines']").each(
      (section, i) => {
        cy.wrap(section).should("have.attr", "data-cy", `line-index-${i}`);
      },
    );
  });

  it("Clicking 'Close all subsections' opens all subsections", () => {
    cy.dataCy("close-all-sections-btn").click();
    cy.dataCy("caret-toggle").should("have.attr", "aria-label", "Open section");
    cy.dataCy("caret-toggle").should(
      "not.have.attr",
      "aria-label",
      "Close section",
    );
    cy.get("[title='Use shift+click to select multiple lines']").should(
      "have.length",
      9,
    );
    const openLineNumbers = [0, 1, 2, 8, 9, 9616, 9617, 9618, 9619];
    cy.get("[title='Use shift+click to select multiple lines']").each(
      (section, i) => {
        cy.wrap(section).should(
          "have.attr",
          "data-cy",
          `line-index-${openLineNumbers[i]}`,
        );
      },
    );
  });

  it("Clicking on a closed caret opens the section and renders the subsection contents ", () => {
    cy.get("[data-index='4'] > [data-cy='section-header']").contains(
      "Function: f_expansions_write",
    );
    cy.get(
      "[data-index='3'] > [data-cy='section-header'] > [data-cy='caret-toggle']",
    ).click();
    cy.get("[data-index='4'] > [data-cy='section-header']").contains(
      "Command: expansions.update (step 1 of 2)",
    );
  });

  it("Clicking on an open caret closes the section and hides the subsection contents", () => {
    cy.get("[data-index='9'] > [data-cy='section-header']").contains(
      "Command: expansions.write (step 2.1 of 2)",
    );
    cy.get(
      "[data-index='8'] > [data-cy='section-header'] > [data-cy='caret-toggle']",
    ).click();
    cy.get("[data-index='9']").contains(
      "[2024/03/12 11:18:36.035] Running task commands failed: running command: command failed: process encountered problem: exit code 1",
    );
  });

  it("Failing command section is open and scrolled to on page load when share line isn't specified", () => {
    cy.visit(logLink);
    cy.contains(
      "[2024/03/12 11:18:36.034] Command 'subprocess.exec' ('check resmoke failure') in function 'run tests' (step 2.20 of 2) failed: process encountered problem: exit code 1.",
    ).should("be.visible");
  });

  it("Share line section is open and scrolled to on page load when it is specified", () => {
    cy.visit(`${logLink}?shareLine=19`);
    cy.contains(
      "[2024/03/12 11:01:53.831] rm -rf /data/db/* mongo-diskstats* mongo-*.tgz ~/.aws ~/.boto venv",
    ).should("be.visible");
  });

  const logLink =
    "/evergreen/mongodb_mongo_master_enterprise_amazon_linux2_arm64_all_feature_flags_jsCore_patch_9801cf147ed208ce4c0ff8dff4a97cdb216f4c22_65f06bd09ccd4eaaccca1391_24_03_12_14_51_29/0/task";
});
