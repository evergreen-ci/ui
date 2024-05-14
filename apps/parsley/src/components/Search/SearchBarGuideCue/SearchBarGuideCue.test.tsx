import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { render, screen, waitFor } from "test_utils";
import SearchBarGuideCue from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

describe("search bar guide cue", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("shows the guide cue if the user has not seen it before", async () => {
    // focus-trap only offers legacy CommonJS exports so it can't be mocked by Vitest.
    // Instead, spoof focus-trap into thinking there is a node attached.
    // https://stackoverflow.com/a/75527964
    const { getClientRects } = HTMLElement.prototype;
    HTMLElement.prototype.getClientRects = function () {
      return {
        ...getClientRects.apply(this),
        length: 1,
      };
    };

    mockedGet.mockImplementation(() => "false");
    render(<SearchBarGuideCue />);
    await waitFor(() => {
      expect(screen.getByDataCy("searchbar-guide-cue")).toBeInTheDocument();
    });
  });

  it("does not show the guide cue if the user has seen it before", () => {
    render(<SearchBarGuideCue />);
    expect(screen.queryByDataCy("searchbar-guide-cue")).toBeNull();
  });
});
