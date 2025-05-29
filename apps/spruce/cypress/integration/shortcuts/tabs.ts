describe("Tab shortcut", () => {
  it("toggle through tabs with 'j' and 'k' on version page", () => {
    cy.visit("/version/5f74d99ab2373627c047c5e5/");

    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("duration-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("downstream-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("test-analysis-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("version-timing-tab").should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get("body").type("j");
    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");

    cy.get("body").type("k");
    cy.dataCy("version-timing-tab").should(
      "have.attr",
      "aria-selected",
      "true",
    );
    cy.get("body").type("k");
    cy.dataCy("test-analysis-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("downstream-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("duration-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("task-tab").should("have.attr", "aria-selected", "true");
  });

  it("toggle through tabs with 'j' and 'k' on configure page", () => {
    cy.visit("/patch/5f74d99ab2373627c047c5e5/configure");

    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("parameters-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("j");
    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");

    cy.get("body").type("k");
    cy.dataCy("parameters-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("changes-tab").should("have.attr", "aria-selected", "true");
    cy.get("body").type("k");
    cy.dataCy("tasks-tab").should("have.attr", "aria-selected", "true");
  });

  it("toggle through tabs with 'j' and 'k' on the task page", () => {
    cy.visit(
      "task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/",
    );

    const tabs = ["task-execution-tab", "task-files-tab", "task-tests-tab"];

    // Forward navigation with 'j'
    for (let i = 0; i < tabs.length + 2; i++) {
      const expectedTab = tabs[i % tabs.length];
      cy.dataCy(expectedTab).should("have.attr", "aria-selected", "true");
      cy.get("body").type("j");
    }

    // Backward navigation with 'k'
    // After the last 'j', we're at "task-files-tab"
    // So, we step backward through the tabs
    for (let i = tabs.length; i > 0; i--) {
      const expectedTab = tabs[(i - 1 + tabs.length) % tabs.length];
      cy.dataCy(expectedTab).should("have.attr", "aria-selected", "true");
      cy.get("body").type("k");
    }
  });
});
