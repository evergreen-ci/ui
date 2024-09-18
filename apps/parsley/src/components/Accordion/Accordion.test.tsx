import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import Accordion from ".";

describe("accordion", () => {
  it("properly expands and collapses", async () => {
    const user = userEvent.setup();
    render(
      <Accordion title="collapsed" toggledTitle="expanded">
        accordion content
      </Accordion>,
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByText("expanded")).toBeInTheDocument();
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByText("collapsed")).toBeInTheDocument();
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("should be expanded if defaultOpen is true", () => {
    render(
      <Accordion defaultOpen title="accordion title">
        accordion content
      </Accordion>,
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("calls onToggle when accordion is toggled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <Accordion onToggle={onToggle} title="accordion title">
        accordion content
      </Accordion>,
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(onToggle).toHaveBeenCalledTimes(1);
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(onToggle).toHaveBeenCalledTimes(2);
  });

  it("uses titleTag if provided", () => {
    const titleTag = () => <span data-cy="my-custom-tag" />;
    render(
      <Accordion title="accordion title" titleTag={titleTag}>
        accordion content
      </Accordion>,
    );
    expect(screen.getByDataCy("my-custom-tag")).toBeInTheDocument();
  });
  it("when controlled, accordion should be open if open prop is true", () => {
    const { rerender } = render(
      <Accordion open title="accordion title">
        accordion content
      </Accordion>,
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    rerender(
      <Accordion open={false} title="accordion title">
        accordion content
      </Accordion>,
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
  it("when controlled, accordion should call a callback when the user toggles it open or closed", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <Accordion onToggle={onToggle} open title="accordion title">
        accordion content
      </Accordion>,
    );
    expect(screen.getByDataCy("accordion-collapse-container")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByDataCy("accordion-toggle"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
