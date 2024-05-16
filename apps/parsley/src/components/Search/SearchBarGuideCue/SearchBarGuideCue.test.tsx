import Cookie from "js-cookie";
import { MockInstance } from "vitest";
import { render, screen, stubGetClientRects, waitFor } from "test_utils";
import SearchBarGuideCue from ".";

vi.mock("js-cookie");
const mockedGet = vi.spyOn(Cookie, "get") as MockInstance;

describe("search bar guide cue", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("shows the guide cue if the user has not seen it before", async () => {
    stubGetClientRects();

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
