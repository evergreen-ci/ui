describe("status filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters on failed tasks and fetches additional from the server", () => {
    cy.dataCy("inactive-versions-button").first().contains("1");
    cy.dataCy("status-filter").click();
    cy.dataCy("failed-option").click();
    cy.get("a[data-tooltip]").should("have.length", 4);
    cy.dataCy("version-label-active").should("have.length", 4);
    cy.dataCy("inactive-versions-button").should("have.length", 3);
  });
});

describe("requester filtering", () => {
  beforeEach(() => {
    cy.visit("/project/spruce/waterfall");
  });

  it("filters on periodic builds and shows an empty state", () => {
    cy.dataCy("inactive-versions-button").first().contains("1");
    cy.dataCy("requester-filter").click();
    cy.dataCy("ad_hoc-option").click();
    cy.contains("No Results Found").should("be.visible");
  });

  it("filters on git tags and fetches more from the server", () => {
    cy.dataCy("requester-filter").click();
    cy.dataCy("git_tag_request-option").click();
    cy.dataCy("inactive-versions-button").should("have.length", 2);
    cy.dataCy("inactive-versions-button").first().contains("3");
    cy.dataCy("inactive-versions-button").eq(1).contains("2");
    cy.dataCy("version-label-active").contains("Git Tag");
    cy.dataCy("version-label-active").should("have.length", 4);
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

  it("submitting a build variant filter updates the url, creates a badge and filters the grid to only show active builds", () => {
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.dataCy("build-variant-filter-input").type("P{enter}");
    cy.dataCy("filter-chip").first().should("have.text", "Variant: P");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=P");
    });
    cy.dataCy("build-variant-label").should("have.length", 0);

    cy.dataTestId("chip-dismiss-button").click();
    cy.dataCy("build-variant-label").should("have.length", 2);

    cy.dataCy("build-variant-filter-input").type("Ubuntu{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=Ubuntu");
    });
    cy.dataCy("filter-chip").first().should("have.text", "Variant: Ubuntu");

    cy.dataCy("build-variant-label")
      .should("have.length", 1)
      .should("have.text", "Ubuntu 16.04");
    cy.dataCy("build-variant-filter-input").type("P{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("buildVariants=Ubuntu,P");
    });
  });
});

describe("task filtering", () => {
  beforeEach(() => {
    cy.visit("/project/evergreen/waterfall");
  });

  it("filters grid squares, removes inactive build variants, creates a badge, and updates the url", () => {
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.dataCy("task-filter-input").type("agent{enter}");

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

    cy.dataCy("task-filter-input").type("lint{enter}");
    cy.location().should((loc) => {
      expect(loc.search).to.include("tasks=agent,lint");
    });
    cy.dataCy("build-variant-label").should("have.length", 2);
    cy.dataCy("filter-chip").eq(1).should("have.text", "Task: lint");
    cy.get("a[data-tooltip]").should("have.length", 4);
  });

  it("correctly applies build variant and task filters", () => {
    cy.dataCy("build-variant-filter-input").type("Ubuntu{enter}");
    cy.dataCy("build-variant-label").should("have.length", 1);
    cy.get("a[data-tooltip]").should("have.length", 45);
    cy.dataCy("task-filter-input").type("agent{enter}");
    cy.dataCy("build-variant-label").should("have.length", 1);
    cy.get("a[data-tooltip]").should("have.length", 1);
    cy.dataCy("filter-chip").should("have.length", 2);
  });
});

describe("date filter", () => {
  it("url query params update when date filter is applied", () => {
    cy.visit("/project/spruce/waterfall");
    cy.dataCy("waterfall-skeleton").should("not.exist");
    cy.location("search").should("equal", "");

    cy.dataCy("date-picker").click();
    cy.get("[aria-label*='Select year' i]").click();
    cy.contains("li", "2022").click({ force: true });
    cy.get("[aria-label*='Select month' i]").click();
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

describe("project selection", () => {
  it("selects a project and applies current task filters", () => {
    cy.visit("/project/spruce/waterfall");
    cy.dataCy("status-filter").click();
    cy.dataCy("test-timed-out-option").click();
    cy.get("body").click();
    cy.dataCy("project-select").click();
    cy.dataCy("project-select-options")
      .contains("evergreen smoke test")
      .click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/project/evergreen/waterfall");
      expect(loc.search).to.eq("?statuses=test-timed-out");
    });
  });
});

describe("clear all filters button", () => {
  it("clicking the clear filters button clears all parameters except for minOrder & maxOrder", () => {
    cy.visit(
      "/project/spruce/waterfall?buildVariants=ubuntu&maxOrder=1235&requesters=gitter_request&statuses=success&tasks=test",
    );
    cy.dataCy("waterfall-menu").click();
    cy.dataCy("clear-all-filters").click();

    cy.location("search").should("not.contain", "buildVariants");
    cy.location("search").should("not.contain", "tasks");
    cy.location("search").should("not.contain", "statuses");
    cy.location("search").should("not.contain", "requesters");
    cy.location("search").should("contain", "maxOrder=1235");
  });
});
