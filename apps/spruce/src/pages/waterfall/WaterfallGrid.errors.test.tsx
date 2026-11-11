import { screen, waitFor } from "@evg-ui/lib/test_utils";
import {
  filteredData,
  filteredOptions,
  getWaterfallData,
  previewData,
} from "./testData";
import {
  cachePreview,
  cleanupWaterfallGridTest,
  makeMock,
  reportError,
  resetWaterfallGridTest,
  setup,
  waitForPageLoad,
} from "./WaterfallGrid.testUtils";

describe("WaterfallGrid errors", () => {
  beforeEach(resetWaterfallGridTest);
  afterEach(cleanupWaterfallGridTest);

  it.each(["initial", "preview", "pagination"])(
    "toasts a failed %s GraphQL request without throwing or logging again",
    async (request) => {
      const consoleError = vi.spyOn(console, "error");
      vi.mocked(reportError).mockClear();
      if (request !== "initial") {
        cachePreview({ data: previewData(request === "pagination" ? 5 : 4) });
      }
      const options = {
        ...filteredOptions,
        ...(request === "pagination" ? { maxOrder: 16 } : {}),
      };
      const failed = makeMock({
        options,
        data: filteredData,
        delay: 50,
      });
      failed.result = { errors: [{ message: "Waterfall request failed" }] };
      const { dispatchToast, navigate } = setup(
        [
          ...(request === "pagination"
            ? [
                makeMock({
                  options: filteredOptions,
                  data: getWaterfallData([20, 19, 18, 17, 16], {
                    taskNames: ["Task A"],
                  }),
                }),
              ]
            : []),
          failed,
        ],
        { search: "?tasks=Task%20A" },
      );
      if (request === "pagination") {
        await screen.findByText("version-16");
        await navigate("?tasks=Task%20A&maxOrder=16");
      }
      await waitFor(() =>
        expect(dispatchToast.error).toHaveBeenCalledWith(
          "Unable to load waterfall: Waterfall request failed",
        ),
      );
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId("fetch-more-loader")).not.toBeInTheDocument();
      expect(screen.queryByTestId("initial-skeleton")).not.toBeInTheDocument();
      expect(
        screen.queryByText("Oops! Something went wrong."),
      ).not.toBeInTheDocument();
      expect(reportError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      if (request !== "initial") {
        await navigate("");
        await screen.findByText("version-16");
        await waitForPageLoad();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      }
    },
  );
});
