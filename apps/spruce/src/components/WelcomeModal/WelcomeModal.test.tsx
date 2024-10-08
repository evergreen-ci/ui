import { MockedProvider } from "@apollo/client/testing";
import {
  render,
  screen,
  stubGetClientRects,
  userEvent,
} from "@evg-ui/lib/test_utils";
import WelcomeModal from "./WelcomeModal";

describe("welcomeModal", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  beforeEach(() => {
    Object.defineProperty(global.window.HTMLMediaElement.prototype, "play", {
      configurable: true,
      // Define the property getter
      get() {
        setTimeout(() => this.onloadeddata && this.onloadeddata());
        return () => {};
      },
    });
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("displays an image", () => {
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              img: "test_img/logo.png",
              alt: "evg-logo",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>,
    );

    expect(screen.queryByDataCy("carousel-image")).toBeVisible();
  });

  // mock video play function
  it("displays an video on a video slide", () => {
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              video: "test_img/video.webm",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>,
    );
    expect(screen.queryByDataCy("carousel-video")).toBeVisible();
  });

  it("clicking the pagination buttons change the slides", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <WelcomeModal
          carouselCards={[
            {
              title: "Slide 1",
              subtitle: "A Subtitle",
              description: "A Description 1",
              img: "test_img/logo.png",
            },
            {
              title: "Slide 2",
              description: "A Description 2",
              img: "test_img/logo.png",
            },
          ]}
          param="spruceV1"
        />
      </MockedProvider>,
    );
    expect(screen.getByText("Slide 1")).toBeVisible();
    expect(screen.queryByDataCy("carousel-dot-1")).toBeVisible();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("carousel-dot-1"));
    expect(screen.getByText("Slide 2")).toBeVisible();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("carousel-dot-0"));
    expect(screen.getByText("Slide 1")).toBeVisible();
  });
});
