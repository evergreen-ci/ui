describe("status filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters on failed tasks", () => {
    cy.dataCy("inactive-versions-button").first().contains("1");
    cy.dataCy("status-filter").click();
    cy.dataCy("failed-option").click();
    cy.get("a[data-tooltip]").should("have.length", 1);
    cy.dataCy("version-label-active").should("have.length", 1);
  });
});

describe("requester filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters on periodic builds and trigger", () => {
    cy.dataCy("inactive-versions-button").first().contains("1");
    cy.dataCy("requester-filter").click();
    cy.dataCy("ad_hoc-option").click();
    cy.dataCy("inactive-versions-button").first().contains("6");
    cy.dataCy("version-label-active").should("have.length", 0);

    cy.dataCy("requester-filter").click();
    cy.dataCy("trigger_request-option").click();
    cy.dataCy("inactive-versions-button").first().contains("5");
    cy.dataCy("version-label-active").should("have.length", 1);
    cy.dataCy("version-label-active").contains("Triggered by:");
  });

  it("filters on git tags", () => {
    cy.dataCy("requester-filter").click();
    cy.dataCy("git_tag_request-option").click();
    cy.dataCy("inactive-versions-button").should("have.length", 2);
    cy.dataCy("inactive-versions-button").first().contains("3");
    cy.dataCy("inactive-versions-button").eq(1).contains("2");
    cy.dataCy("version-label-active").contains("Git Tag");
  });

  it("clears requester filters", () => {
    cy.dataCy("requester-filter").click();
    cy.dataCy("gitter_request-option").click();
    cy.dataCy("version-label-active").should("have.length", 3);

    cy.dataCy("requester-filter").within(() => {
      cy.get("button[aria-label='Clear selection']").click();
    });
    cy.dataCy("version-label-active").should("have.length", 5);
  });
});

describe("build variant filtering", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("submitting a build variant filter updates the url, creates a badge and filters the grid", () => {
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.get("[placeholder='Filter build variants'").type("P{enter}");
    cy.dataCy("filter-chip").first().should("have.text", "Variant: P");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=P");
    });
    cy.dataCy("build-variant-label").should("have.length", 0);

    cy.dataTestId("chip-dismiss-button").click();
    cy.dataCy("build-variant-label").should("have.length", 2);

    cy.get("[placeholder='Filter build variants'").type("Lint{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=Lint");
    });
    cy.dataCy("filter-chip").first().should("have.text", "Variant: Lint");

    cy.dataCy("build-variant-label")
      .should("have.length", 1)
      .should("have.text", "Lint");
    cy.get("[placeholder='Filter build variants'").type("P{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=Lint,P");
    });
  });
});

describe("task filtering", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("filters grid squares, removes inactive build variants, creates a badge, and updates the url", () => {
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.dataCy("tuple-select-dropdown").click({ force: true });
    cy.get('[role="listbox"]').should("have.length", 1);
    cy.get('[role="listbox"]').within(() => {
      cy.contains("Task").click();
    });
    cy.get("[placeholder='Filter tasks'").type("agent{enter}");

    cy.dataCy("build-variant-label").should("have.length", 1);
    cy.location().should((loc) => {
      expect(loc.search).to.include("tasks=agent");
    });
    cy.dataCy("filter-chip").first().should("have.text", "Task: agent");
    cy.get("a[data-tooltip]").should("have.length", 1);
    cy.get("a[data-tooltip]").should(
      "have.attr",
      "data-tooltip",
      "test-agent - Succeeded",
    );

    cy.get("[placeholder='Filter tasks'").type("lint{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("tasks=agent,lint");
    });
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.dataCy("filter-chip").eq(1).should("have.text", "Task: lint");
    cy.get("a[data-tooltip]").should("have.length", 2);
  });

  it("correctly applies build variant and task filters", () => {
    cy.get("[placeholder='Filter build variants'").type("Lint{enter}");
    cy.dataCy("build-variant-label").should("have.length", 1);
    cy.dataCy("tuple-select-dropdown").click({ force: true });
    cy.get('[role="listbox"]').should("have.length", 1);
    cy.get('[role="listbox"]').within(() => {
      cy.contains("Task").click();
    });
    cy.get("[placeholder='Filter tasks'").type("agent{enter}");
    cy.dataCy("build-variant-label").should("have.length", 0);
    cy.dataCy("filter-chip").should("have.length", 2);
  });
});

describe("date filter", () => {
  it("url query params update when date filter is applied", () => {
    cy.visit("/project/spruce/waterfall");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.location("search").should("equal", "");

    cy.dataCy("date-picker").click();
    cy.get("[aria-label^='Select year']").click();
    cy.contains("li", "2022").click({ force: true });
    cy.get("[aria-label^='Select month']").click();
    cy.contains("li", "Feb").click({ force: true });
    cy.get("[data-iso='2022-02-28']").click();

    cy.location("search").should("contain", "date=2022-02-28");
    cy.validateDatePickerDate("date-picker", {
      year: "2022",
      month: "02",
      day: "28",
    });

    cy.dataCy("version-label-active")
      .contains("e391612")
      .invoke("attr", "data-highlighted", "true");
  });

  it("date is cleared when paginating", () => {
    cy.visit("/project/spruce/waterfall?date=2022-02-28");
    cy.validateDatePickerDate("date-picker", {
      year: "2022",
      month: "02",
      day: "28",
    });
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("prev-page-button").should("have.attr", "aria-disabled", "false");
    cy.dataCy("prev-page-button").click();
    cy.dataCy("date-picker").should("not.have.text");
    cy.validateDatePickerDate("date-picker");
    cy.location("search").should("not.contain", "date");
  });

  it("versions update correctly when date filter is applied", () => {
    const commit20220228 = "e391612";
    const commit20220303 = "2c9056d";

    cy.visit("/project/spruce/waterfall?date=2022-02-28");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("version-labels").children().should("have.length", 5);
    cy.dataCy("version-labels").children().eq(0).contains(commit20220228);

    cy.visit("/project/spruce/waterfall?date=2022-03-03");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.dataCy("version-labels").children().should("have.length", 6);
    cy.dataCy("version-labels").children().eq(0).contains(commit20220303);
  });
});

describe("revision filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters by git commit", () => {
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("git-commit-search").click();
    cy.dataCy("git-commit-search-modal").should("be.visible");
    cy.getInputByLabel("Git Commit Hash").type("ab49443{enter}");
    cy.dataCy("git-commit-search-modal").should("not.exist");
    cy.dataCy("version-label-active").contains("ab49443").should("be.visible");
    cy.dataCy("version-label-active")
      .contains("ab49443")
      .invoke("attr", "data-highlighted", "true");
  });
  it("should highlight a commit if it is passed into the url", () => {
    cy.visit("/project/spruce/waterfall?revision=ab49443");
    cy.dataCy("version-label-active").contains("ab49443").should("be.visible");
    cy.dataCy("version-label-active")
      .contains("ab49443")
      .invoke("attr", "data-highlighted", "true");
  });
});
