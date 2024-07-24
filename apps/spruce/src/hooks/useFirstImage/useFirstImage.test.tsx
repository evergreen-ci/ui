import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useFirstImage } from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useFirstImage", () => {
  it("retrieve first image from list", async () => {
    const { result } = renderHook(() => useFirstImage(), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [getImages],
        }),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.image).toBe("amazon2");
  });
});

const getImages: ApolloMock<ImagesQuery, ImagesQueryVariables> = {
  request: {
    query: IMAGES,
  },
  result: {
    data: {
      images: ["amazon2", "debian12", "suse15", "ubuntu1604"],
    },
  },
};
