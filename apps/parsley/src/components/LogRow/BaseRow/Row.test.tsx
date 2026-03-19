import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  RenderWithRouterMatchOptions,
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { WordWrapFormat } from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import { MultiLineSelectContextProvider } from "context/MultiLineSelectContext";
import { parsleySettingsMock } from "test_data/parsleySettings";
import Row from ".";

const logs = ["Test Log"];

const renderRow = (
  props: React.ComponentProps<typeof Row>,
  routerOptions: RenderWithRouterMatchOptions,
) => {
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[parsleySettingsMock]}>
      <LogContextProvider initialLogLines={logs}>
        <MultiLineSelectContextProvider>
          <Row {...props} />
        </MultiLineSelectContextProvider>
      </LogContextProvider>
    </MockedProvider>,
  );
  return renderWithRouterMatch(<Component />, routerOptions);
};

describe("row", () => {
  it("renders a log line", () => {
    renderRow({ ...rowProps, children: testLog, "data-cy": "test" }, {});
    expect(screen.getByText(testLog)).toBeVisible();
    expect(screen.getByDataCy("test")).toBeVisible();
  });

  it("properly escapes a log line with tags and renders its contents", () => {
    const lineContent = "Test line with a <nil> value";
    renderRow({ ...rowProps, children: lineContent }, {});
    expect(screen.getByText(lineContent)).toBeVisible();
  });

  it("clicking log line menu button opens the sharing menu", async () => {
    const user = userEvent.setup();
    renderRow(
      {
        ...rowProps,
        children: testLog,
        lineIndex: 7,
        lineNumber: 54,
      },
      {},
    );
    await user.click(screen.getByDataCy("log-menu-54"));
    expect(screen.getByText("Copy selected contents")).toBeVisible();
  });

  it("clicking menu button on different line selects that line", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      {
        ...rowProps,
        children: testLog,
        lineNumber: 5,
      },
      { route: "?selectedLineRange=L0" },
    );
    await user.click(screen.getByDataCy("log-menu-5"));
    expect(router.state.location.search).toBe("?selectedLineRange=L5");
    expect(screen.getByText("Copy selected contents")).toBeVisible();
  });

  it("clicking line number should select that line", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      {
        ...rowProps,
        children: testLog,
        lineNumber: 0,
      },
      {},
    );
    await user.click(screen.getByDataCy("line-index-0"));
    expect(router.state.location.search).toBe("?selectedLineRange=L0");
  });

  it("clicking line number on different line should select new line", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      {
        ...rowProps,
        children: testLog,
        lineNumber: 5,
      },
      { route: "?selectedLineRange=L0" },
    );
    await user.click(screen.getByDataCy("line-index-5"));
    expect(router.state.location.search).toBe("?selectedLineRange=L5");
  });

  it("shift+clicking menu icon should select a range", async () => {
    const user = userEvent.setup();
    const { router } = renderRow(
      {
        ...rowProps,
        children: testLog,
        lineNumber: 5,
      },
      { route: "?selectedLineRange=L0" },
    );
    await user.keyboard("{Shift>}");
    await user.click(screen.getByDataCy("log-menu-5"));
    await user.keyboard("{/Shift}");
    expect(router.state.location.search).toBe("?selectedLineRange=L0-L5");
    expect(screen.getByText("Copy selected contents")).toBeVisible();
  });

  it("should not copy line numbers to clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });
    renderRow({ ...rowProps, children: testLog }, {});

    expect(screen.getByText(/.+/).textContent).toBe("Test Log");
    // select all of the text
    await user.tripleClick(screen.getByText(/.+/));
    const dataTransfer = await user.copy();
    expect(dataTransfer?.getData("text")).toBe("Test Log");
  });

  describe("search / highlights", () => {
    it("should highlight matching search text if it is within range", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          range: {
            lowerRange: 0,
            upperRange: 10,
          },
          searchTerm: regexp,
        },
        {},
      );

      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
    it("should not highlight matching search text if it is outside of range", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          range: {
            lowerRange: 1,
            upperRange: 2,
          },
          searchTerm: regexp,
        },
        {},
      );

      expect(screen.queryByDataCy("highlight")).not.toBeInTheDocument();
    });
    it("highlighted terms should highlight the matching text", () => {
      const regexp = /Test/i;
      renderRow(
        {
          ...rowProps,
          children: testLog,
          highlightRegex: regexp,
        },
        {},
      );

      expect(screen.getByDataCy("highlight")).toHaveTextContent("Test");
    });
  });
});

const testLog = "Test Log";

const rowProps = {
  columnIndex: 0,
  key: testLog,
  lineIndex: 0,

  lineNumber: 0,
  prettyPrint: false,
  range: {
    lowerRange: 0,
    upperRange: undefined,
  },
  scrollToLine: vi.fn(),
  wordWrapFormat: WordWrapFormat.Standard,
  wrap: false,
};
