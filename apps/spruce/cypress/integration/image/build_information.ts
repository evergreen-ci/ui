describe("build information", () => {
  describe("distros", () => {
    it("should show the corresponding distros", () => {
      cy.visit("/image/ubuntu1804");
      cy.dataCy("distro-table-row").should("have.length", 1);
      cy.contains("ubuntu1804-workstation");
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
