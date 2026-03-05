describe("Upload page", () => {
  describe("uploading logs", () => {
    beforeEach(() => {
      cy.visit("/upload");
    });

    it("should be able to drag and drop a file", () => {
      cy.dataCy("upload-zone").should("be.visible");
      cy.dataCy("upload-zone").selectFile("sample_logs/resmoke.log", {
        action: "drag-drop",
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
    });
    it("should be able to select a file", () => {
      cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
    });
    it("selecting a log type should render the log with the appropriate parser", () => {
      cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
      cy.dataCy("parse-log-select").click();
      cy.contains("Resmoke").click();
      cy.dataCy("process-log-button").click();
      cy.dataCy("log-window").should("be.visible");
      cy.dataCy("resmoke-row").should("be.visible");
    });
  });

  describe("uploading logs via clipboard", () => {
    beforeEach(() => {
      // We currently mock the clipboard globally in our cypress config.
      // Temporarily override this so we can test the clipboard functionality.
      cy.visit("/upload", {
        onBeforeLoad(win: Window): void {
          // Stub the clipboard readText method to avoid an issue caused by trying to access the clipboard in a test environment
          cy.stub(win.navigator.clipboard, "readText").resolves(
            "sample_logs/resmoke.log",
          );
        },
      });
    });

    it("should be able to paste text into Parsley", () => {
      cy.dataCy("upload-zone").should("be.visible");
      // Paste the contents into Parsley
      cy.get("input[type=file]").click({ force: true });
      cy.get("body").click(); // Triggers a click on the body to focus the document

      cy.get("input[type=file]").paste({
        pasteFormat: "text",
        pastePayload: "sample_logs/resmoke.log",
      });
      cy.dataCy("parse-log-select").should("be.visible");
    });
    it("selecting a log type should render the log with the appropriate parser", () => {
      // Paste the contents into Parsley
      cy.get("input[type=file]").paste({
        pasteFormat: "text",
        pastePayload: "sample_logs/resmoke.log",
      });
      cy.dataCy("parse-log-select").should("be.visible");
      cy.dataCy("parse-log-select").click();
      cy.contains("Resmoke").click();
      cy.dataCy("process-log-button").click();
      cy.dataCy("log-window").should("be.visible");
      cy.dataCy("resmoke-row").should("be.visible");
      cy.dataCy("resmoke-row").contains("sample_logs/resmoke.log");
    });
  });
  describe("navigating away", () => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

    beforeEach(() => {
      cy.visit(logLink);
    });

    it("trying to navigate away to the upload page should prompt the user", () => {
      cy.dataCy("log-window").should("be.visible");
      cy.dataCy("upload-link").click();
      cy.dataCy("confirmation-modal").should("be.visible");
      cy.contains("button", "Confirm").click();
      cy.dataCy("upload-zone").should("be.visible");
    });
  });

  describe("navigating away from uploaded logs", () => {
    beforeEach(() => {
      cy.visit("/upload");
      cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
      cy.dataCy("parse-log-select").click();
      cy.contains("Resmoke").click();
      cy.dataCy("process-log-button").click();
      cy.dataCy("log-window").should("be.visible");
    });

    it("should show a warning modal when trying to navigate away from an uploaded log", () => {
      cy.dataCy("upload-link").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.contains(
        "You have an uploaded log open. If you navigate away, you will need to upload it again to view it.",
      ).should("be.visible");
    });

    it("should stay on the page when clicking Cancel", () => {
      cy.dataCy("upload-link").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.contains("button", "Cancel").click();
      cy.dataCy("log-window").should("be.visible");
      cy.dataCy("navigation-warning-modal").should("not.exist");
    });

    it("should navigate away when clicking Leave", () => {
      cy.dataCy("upload-link").click();
      cy.dataCy("navigation-warning-modal").should("be.visible");
      cy.contains("button", "Leave").click();
      cy.dataCy("upload-zone").should("be.visible");
    });
  });
});
