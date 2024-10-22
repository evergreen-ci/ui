describe("build information", () => {
  describe("general", () => {
    it("should show correct property values", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("general-table-row").should("have.length", 4);
      cy.dataCy("general-table-row")
        .eq(0)
        .should("contain.text", "Last deployed");
      cy.dataCy("general-table-row")
        .eq(1)
        .should("contain.text", "Amazon Machine Image (AMI)");
      cy.dataCy("general-table-row")
        .eq(2)
        .should("contain.text", "Latest task");
      cy.dataCy("general-table-row")
        .eq(3)
        .should("contain.text", "Latest task time");
    });
  });

  describe("distros", () => {
    it("should show the corresponding distros", () => {
      cy.visit("/image/ubuntu1804");
      cy.dataCy("distro-table-row").should("have.length", 1);
      cy.contains("ubuntu1804-workstation");
    });
  });

  describe("os", () => {
    it("should show the corresponding OS info", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("os-table-row").should("have.length", 10);
    });

    it("should show different OS info on different pages", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("os-table-row").should("have.length", 10);

      // First OS info name on first page.
      cy.dataCy("os-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("firstOSName", { type: "static" });

      cy.dataCy("os-card").within(() => {
        cy.get("[data-testid=lg-pagination-next-button]").click();
      });

      // First OS info name on second page.
      cy.dataCy("os-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("nextOSName", { type: "static" });

      // OS info names should not be equal.
      cy.get("@firstOSName").then((firstOSName) => {
        cy.get("@nextOSName").then((nextOSName) => {
          expect(nextOSName).not.to.equal(firstOSName);
        });
      });
    });

    it("should show no OS info when filtering for nonexistent item", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("os-table-row").should("have.length", 10);
      cy.dataCy("os-name-filter").click();
      cy.get('input[placeholder="Name regex"]').type("fakeOS{enter}");
      cy.dataCy("os-table-row").should("have.length", 0);
    });
  });

  describe("packages", () => {
    it("should show the corresponding packages", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("packages-table-row").should("have.length", 10);
    });

    it("should show different package on new page", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("packages-table-row").should("have.length", 10);

      // First package name on first page.
      cy.dataCy("packages-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("firstPackageName", { type: "static" });

      cy.dataCy("packages-card").within(() => {
        cy.get("[data-testid=lg-pagination-next-button]").click();
      });

      // First package name on second page.
      cy.dataCy("packages-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("nextPackageName", { type: "static" });

      // Package names should not be equal.
      cy.get("@firstPackageName").then((firstPackageName) => {
        cy.get("@nextPackageName").then((nextPackageName) => {
          expect(nextPackageName).not.to.equal(firstPackageName);
        });
      });
    });

    it("should show no packages when filtering for nonexistent item", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("packages-table-row").should("have.length", 10);
      cy.dataCy("package-name-filter").click();
      cy.get('input[placeholder="Name regex"]').type("boguspackage{enter}");
      cy.dataCy("packages-table-row").should("have.length", 0);
    });
  });

  describe("toolchains", () => {
    it("should show the corresponding toolchains", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("toolchains-table-row").should("have.length", 10);
    });

    it("should show different toolchains on different pages", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("toolchains-table-row").should("have.length", 10);

      // First toolchain name on first page.
      cy.dataCy("toolchains-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("firstToolchainName", { type: "static" });

      cy.dataCy("toolchains-card").within(() => {
        cy.get("[data-testid=lg-pagination-next-button]").click();
      });

      // First toolchain name on second page.
      cy.dataCy("toolchains-table-row")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .as("nextToolchainName", { type: "static" });

      // Toolchain names should not be equal.
      cy.get("@firstToolchainName").then((firstToolchainName) => {
        cy.get("@nextToolchainName").then((nextToolchainName) => {
          expect(nextToolchainName).not.to.equal(firstToolchainName);
        });
      });
    });

    it("should show no toolchains when filtering for nonexistent item", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("toolchains-table-row").should("have.length", 10);
      cy.dataCy("toolchain-name-filter").click();
      cy.get('input[placeholder="Name regex"]').type("faketoolchain{enter}");
      cy.dataCy("toolchains-table-row").should("have.length", 0);
    });
  });
});

describe("side nav", () => {
  beforeEach(() => {
    cy.visit("/image/ubuntu2204/build-information");
    cy.contains("ubuntu2204").should("be.visible");
    cy.dataCy("table-loader-loading-row").should("not.exist");
  });

  it("highlights different sections as the user scrolls", () => {
    cy.dataCy("general-card").scrollIntoView();
    cy.dataCy("navitem-general").should("have.attr", "data-active", "true");
    cy.dataCy("navitem-distros").should("have.attr", "data-active", "false");

    cy.dataCy("distros-card").scrollIntoView();
    cy.dataCy("navitem-general").should("have.attr", "data-active", "false");
    cy.dataCy("navitem-distros").should("have.attr", "data-active", "true");
  });

  it("can click to navigate to different sections", () => {
    cy.dataCy("navitem-packages").should("have.attr", "data-active", "false");
    cy.dataCy("packages-card").should("not.be.visible");
    cy.dataCy("navitem-packages").click();
    cy.dataCy("navitem-packages").should("have.attr", "data-active", "true");
    cy.dataCy("packages-card").should("be.visible");
  });
});
