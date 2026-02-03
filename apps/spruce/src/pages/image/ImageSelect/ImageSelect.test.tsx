import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";
import { ImageSelect } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider mocks={[imagesMock]}>{children}</MockedProvider>
);

describe("image select", () => {
  it("shows image name as dropdown content", async () => {
    const { Component } = RenderFakeToastContext(
      <ImageSelect selectedImage="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getByDataCy("images-select")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue("ubuntu2204")).toBeVisible();
    });
  });

  it("selecting a different image will navigate to the correct URL", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ImageSelect selectedImage="ubuntu2204" />,
    );
    const { router } = render(<Component />, {
      wrapper,
      route: "/image/ubuntu2204/build-information",
      path: "/image/:imageId/:tab",
    });

    await waitFor(() => {
      expect(screen.getByDataCy("images-select")).toBeInTheDocument();
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Images"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeVisible();
    });
    await user.click(screen.getByText("amazon2"));
    expect(router.state.location.pathname).toBe(
      "/image/amazon2/build-information",
    );
  });

  it("typing in the text input will narrow down search results", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ImageSelect selectedImage="ubuntu2204" />,
    );
    render(<Component />, { wrapper });
    await waitFor(() => {
      expect(screen.getByDataCy("images-select")).toBeInTheDocument();
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Images"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeVisible();
    });

    expect(screen.getAllByRole("option")).toHaveLength(3);
    await user.clear(screen.getByPlaceholderText("Select an image"));
    await user.type(screen.getByPlaceholderText("Select an image"), "rhel");
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });
});

const imagesMock: ApolloMock<ImagesQuery, ImagesQueryVariables> = {
  request: {
    query: IMAGES,
    variables: {},
  },
  result: {
    data: {
      images: ["ubuntu2204", "amazon2", "rhel90"],
    },
  },
};
