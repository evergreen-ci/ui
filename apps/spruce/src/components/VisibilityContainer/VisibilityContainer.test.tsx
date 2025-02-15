import { render, screen } from "@evg-ui/lib/test_utils";
import VisibilityContainer from ".";

describe("visibilityContainer", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("should not render children when not visible in viewport", () => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: false,
        },
      ]);
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // @ts-expect-error: Not necessary to mock the entire object for tests.
    window.IntersectionObserver = mockIntersectionObserver;
    render(
      <VisibilityContainer>
        <div>Visible content</div>
      </VisibilityContainer>,
    );

    expect(screen.queryByText("Visible content")).toBeNull();
  });

  it("should render children when visible in viewport", () => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // @ts-expect-error: Not necessary to mock the entire object for tests.
    window.IntersectionObserver = mockIntersectionObserver;
    render(
      <VisibilityContainer>
        <div>Visible content</div>
      </VisibilityContainer>,
    );
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });
});
