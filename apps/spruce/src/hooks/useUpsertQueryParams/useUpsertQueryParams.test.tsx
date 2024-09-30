import { useState } from "react";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
} from "@evg-ui/lib/test_utils";
import { useUpsertQueryParams } from ".";

const Content = () => {
  const onSubmit = useUpsertQueryParams();
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  return (
    <>
      <input
        data-cy="category"
        onChange={(e) => setCategory(e.target.value)}
        type="text"
        value={category}
      />
      <input
        data-cy="value"
        onChange={(e) => setValue(e.target.value)}
        type="text"
        value={value}
      />
      <button
        data-cy="submit"
        onClick={() => onSubmit({ category, value })}
        type="button"
      >
        Submit
      </button>
    </>
  );
};
describe("useUpsertQueryParams", () => {
  it("renders normally and doesn't affect the url", () => {
    const { router } = renderWithRouterMatch(<Content />);
    expect(router.state.location.search).toBe("");
  });

  it("should add input query params to the url if none exist", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(category, "category");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value`);
  });

  it("should add multiple input filters to the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);

    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(category, "category");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value1");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(value);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value2");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1,value2`);
  });

  it("should not allow duplicate input filters for the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(category, "category");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value1");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(value);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value1");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);
  });

  it("should allow multiple input filters for different keys as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(category, "category");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(value, "value1");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(category);
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(category, "category2");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(
      `?category=value1&category2=value1`,
    );
  });
});
