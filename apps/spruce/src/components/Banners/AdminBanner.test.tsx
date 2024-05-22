import { MockedProvider } from "@apollo/client/testing";
import { AdminBanner } from "components/Banners";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { render, screen, waitFor } from "test_utils";

const mock = getSpruceConfigMock;

describe("site banner", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a warning banner", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "Warning to users";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-warning")).toBeVisible();
    });
  });

  it("renders an announcement banner", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "New feature announcement";
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.bannerTheme = "announcement";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-success")).toBeVisible();
    });
  });

  it("renders a danger banner", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "Note of severe system outage";
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.bannerTheme = "important";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-danger")).toBeVisible();
    });
  });

  it("renders an info banner", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "Some information";
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.bannerTheme = "information";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-info")).toBeVisible();
    });
  });

  it("renders an info banner when the theme is empty", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "General announcement";
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.bannerTheme = "";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-info")).toBeVisible();
    });
  });

  it("renders an info banner when the theme is invalid", async () => {
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "This is not an ideal banner";
    // @ts-ignore: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.bannerTheme = "invalid";
    render(
      <MockedProvider mocks={[mock]}>
        <AdminBanner />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("sitewide-banner-info")).toBeVisible();
    });
  });
});
