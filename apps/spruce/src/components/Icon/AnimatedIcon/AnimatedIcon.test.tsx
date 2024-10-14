import { forwardRef } from "react";
import { render, screen, fireEvent } from "@evg-ui/lib/src/test_utils";
import AnimatedIcon from ".";

// Mock an SVG component to be passed as the icon prop
const MockIcon = forwardRef<SVGSVGElement>((props, ref) => (
  <svg ref={ref} data-cy="test-svg" {...props} />
));

describe("AnimatedIcon", () => {
  it("renders the icon correctly", () => {
    render(<AnimatedIcon icon={MockIcon} />);
    const svgElement = screen.getByDataCy("test-svg");
    expect(svgElement).toBeInTheDocument();
  });

  it("pauses animations by default on page load", () => {
    const pauseAnimationsMock = vi.fn();
    const unpauseAnimationsMock = vi.fn();

    // Mock the SVG's pauseAnimations and unpauseAnimations methods
    const MockIconWithAnimations = forwardRef<SVGSVGElement>((props, ref) => (
      <svg
        ref={(el) => {
          if (el) {
            // eslint-disable-next-line no-param-reassign
            el.pauseAnimations = pauseAnimationsMock;
            // eslint-disable-next-line no-param-reassign
            el.unpauseAnimations = unpauseAnimationsMock;
            if (typeof ref === "function") ref(el);
            // eslint-disable-next-line no-param-reassign
            else if (ref) ref.current = el;
          }
        }}
        {...props}
      >
        <animate />
      </svg>
    ));

    render(<AnimatedIcon icon={MockIconWithAnimations} />);
    expect(pauseAnimationsMock).toHaveBeenCalled();
    expect(unpauseAnimationsMock).not.toHaveBeenCalled();
  });

  it("unpauses animations on mouse enter and pauses them again on mouse leave", () => {
    const pauseAnimationsMock = vi.fn();
    const unpauseAnimationsMock = vi.fn();

    const MockIconWithAnimations = forwardRef<SVGSVGElement>((props, ref) => (
      <svg
        ref={(el) => {
          if (el) {
            // eslint-disable-next-line no-param-reassign
            el.pauseAnimations = pauseAnimationsMock;
            // eslint-disable-next-line no-param-reassign
            el.unpauseAnimations = unpauseAnimationsMock;
            if (typeof ref === "function") ref(el);
            // eslint-disable-next-line no-param-reassign
            else if (ref) ref.current = el;
          }
        }}
        data-cy="test-svg"
        {...props}
      >
        <animate />
      </svg>
    ));

    render(<AnimatedIcon icon={MockIconWithAnimations} />);

    const svgElement = screen.getByDataCy("test-svg");

    // Mouse enter triggers unpauseAnimations
    fireEvent.mouseEnter(svgElement);
    expect(unpauseAnimationsMock).toHaveBeenCalled();

    // Mouse leave triggers pauseAnimations
    fireEvent.mouseLeave(svgElement);
    expect(pauseAnimationsMock).toHaveBeenCalled();
  });
});
