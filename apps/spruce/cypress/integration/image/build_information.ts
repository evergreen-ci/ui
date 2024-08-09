describe("build information", () => {
  describe("distros", () => {
    it("should show the corresponding distros", () => {
      cy.visit("/image/ubuntu1804");
      cy.dataCy("distro-table-row").should("have.length", 1);
      cy.contains("ubuntu1804-workstation");
    });
  });
});
