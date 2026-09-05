import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { FavoriteStar } from "./FavoriteStar";
import { mocks } from "./testData";

describe("FavoriteStar", () => {
  it("adds a favorite without triggering the surrounding option", async () => {
    const user = userEvent.setup();
    const parentOnClick = vi.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={mocks}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- mirrors the selectable ProjectOption wrapper. */}
        <div onClick={parentOnClick}>
          <FavoriteStar isFavorite={false} projectIdentifier="evergreen" />
        </div>
      </MockedProvider>,
    );
    render(<Component />);

    await user.click(screen.getByRole("button", { name: "Add To Favorites" }));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Added evergreen smoke test to favorites!",
      );
    });
    expect(parentOnClick).not.toHaveBeenCalled();
  });

  it("removes a favorite", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={mocks}>
        <FavoriteStar isFavorite projectIdentifier="evergreen" />
      </MockedProvider>,
    );
    render(<Component />);

    await user.click(screen.getByRole("button", { name: "Add To Favorites" }));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Removed evergreen smoke test from favorites!",
      );
    });
  });
});
