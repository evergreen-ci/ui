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
  });
});
