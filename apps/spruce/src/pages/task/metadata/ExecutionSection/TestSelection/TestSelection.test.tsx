import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { TestSelection } from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

describe("test selection", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "false");
  });

  describe("test selection is disabled", () => {
    it("badge should say 'disabled'", () => {
      render(<TestSelection testSelectionEnabled={false} />);
      expect(screen.getByText("disabled")).toBeVisible();
    });

    it("guide cue will not display", async () => {
      await waitFor(() => {
        expect(
          screen.queryByDataCy("test-selection-guide-cue"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("test selection is enabled", () => {
    it("badge should say 'enabled'", () => {
      render(<TestSelection testSelectionEnabled />);
      expect(screen.getByText("enabled")).toBeVisible();
    });

    it("guide cue will display if cookie is 'false'", () => {
      render(<TestSelection testSelectionEnabled />);
      expect(
        screen.getByDataCy("test-selection-guide-cue"),
      ).toBeInTheDocument();
    });

    it("guide cue will not display if cookie is 'true'", async () => {
      mockedGet.mockImplementation(() => "true");
      render(<TestSelection testSelectionEnabled />);
      await waitFor(() => {
        expect(
          screen.queryByDataCy("test-selection-guide-cue"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
