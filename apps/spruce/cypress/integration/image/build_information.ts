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

      cy.get("[data-testid=lg-pagination-next-button]").click();

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

    it("should show no packages when bogus filter is applied", () => {
      cy.visit("/image/ubuntu2204");
      cy.dataCy("packages-table-row").should("have.length", 10);
      cy.dataCy("package-name-filter").click();
      cy.get('input[placeholder="Search name"]').type("boguspackage{enter}");
      cy.dataCy("packages-table-row").should("have.length", 0);
    });
  });
});
