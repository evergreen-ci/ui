import { getTestUtils } from "@leafygreen-ui/text-input/testing";
import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { DIRECTION } from "context/LogContext/types";
import SearchBar from ".";

describe("searchbar", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("disables properly", () => {
    render(<SearchBar disabled />);
    const { isDisabled } = getTestUtils();
    expect(screen.getByDataCy("searchbar-select")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(isDisabled()).toBe(true);
  });
  it("should be able to paginate forwards by pressing Enter and keep focus", async () => {
    const user = userEvent.setup();
    const paginate = vi.fn();
    render(<SearchBar paginate={paginate} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(paginate).toHaveBeenCalledTimes(1);
    expect(paginate).toHaveBeenCalledWith(DIRECTION.NEXT);
    expect(input).toHaveFocus();
  });
  it("should be able to paginate backwards by pressing Shift + Enter and keep focus", async () => {
    const user = userEvent.setup();
    const paginate = vi.fn();
    render(<SearchBar paginate={paginate} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Shift>}{enter}");
    expect(paginate).toHaveBeenCalledTimes(1);
    expect(paginate).toHaveBeenCalledWith(DIRECTION.PREVIOUS);
    expect(input).toHaveFocus();
  });
  it("should be able to submit an input by pressing Ctrl + Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
    expect(input).not.toHaveFocus();
  });
  it("should be able to submit an input by clicking the submit button", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.click(screen.getByDataCy("searchbar-submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
  });
  it("shows a warning icon if input is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    const { isError } = getTestUtils();
    expect(isError()).toBe(true);
    expect(screen.queryByDataCy("searchbar-submit")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("invalid inputs should not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    await user.type(input, "{Control>}{enter}");
    expect(input).toHaveValue("test");
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("should be able to change the selected option", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");

    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("highlight-option"));
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledWith("highlight", "test");
  });
  it("should clear input if a user is applying a filter and should reset search", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} validator={() => true} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("filter-option"));
    await user.type(input, "test");
    await user.type(input, "{Control>}{enter}");
    expect(input).toHaveValue("");
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
  });
  it("should call a debounced onChange as input changes", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    vi.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test");
  });
  it("should not call onChange if input is invalid", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} validator={(i) => i.length > 4} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    vi.advanceTimersByTime(1000);
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, "1");
    expect(input).toHaveValue("test1");
    vi.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test1");
  });
  it("pressing Control+F puts focus on the input and selects the text content", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSubmit={vi.fn()} />);

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    const inputText = "input text";
    await user.type(input, inputText);
    await user.click(document.body as HTMLElement);
    expect(input).not.toHaveFocus();

    await user.keyboard("{Control>}{f}");
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(inputText.length);
  });
  it("pressing ⌘+F puts focus on the input and selects the text content", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSubmit={vi.fn()} />);

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    const inputText = "input text";
    await user.type(input, inputText);
    await user.click(document.body as HTMLElement);
    expect(input).not.toHaveFocus();

    await user.keyboard("{Meta>}{f}");
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(inputText.length);
  });
  it("should populate input and call onChange when applying a search suggestion", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    const searchSuggestions = [
      {
        suggestions: ["apple", "banana"],
        title: "Fruits",
      },
    ];
    render(
      <SearchBar onChange={onChange} searchSuggestions={searchSuggestions} />,
    );

    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    await user.click(screen.getByText("apple"));

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    expect(input).toHaveValue("apple");
    expect(input).toHaveFocus();
    vi.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("apple");
  });

  it("should show a persistent placeholder when a suggestion is partially typed", async () => {
    const user = userEvent.setup();
    const searchSuggestions = [
      {
        suggestions: ["apple", "banana"],
        title: "Fruits",
      },
    ];
    render(
      <SearchBar onSubmit={vi.fn()} searchSuggestions={searchSuggestions} />,
    );

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    await user.type(input, "ap");
    expect(input).toHaveValue("ap");
    expect(screen.getByText("apple")).toBeVisible();
  });
  it("should not show a persistent placeholder when a suggestion is fully typed", async () => {
    const user = userEvent.setup();
    const searchSuggestions = [
      {
        suggestions: ["apple", "banana"],
        title: "Fruits",
      },
    ];
    render(
      <SearchBar onSubmit={vi.fn()} searchSuggestions={searchSuggestions} />,
    );

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    await user.type(input, "apple");
    expect(input).toHaveValue("apple");
    expect(screen.queryByText("apple")).toBeNull();
  });
  it("tabbing should complete the suggestion", async () => {
    const user = userEvent.setup();
    const searchSuggestions = [
      {
        suggestions: ["apple", "banana"],
        title: "Fruits",
      },
    ];
    render(
      <SearchBar onSubmit={vi.fn()} searchSuggestions={searchSuggestions} />,
    );

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    await user.type(input, "ap");
    expect(input).toHaveValue("ap");
    await user.type(input, "{tab}");
    expect(input).toHaveValue("apple");
  });
});
