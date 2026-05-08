import {
  MockedProvider,
  render,
  screen,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { AdminBanner } from "components/Banners";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";

const mock = getSpruceConfigMock;

describe("site banner", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a warning banner", async () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "New feature announcement";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "Note of severe system outage";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "Some information";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "General announcement";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    mock.result.data.spruceConfig.banner = "This is not an ideal banner";
    // @ts-expect-error: FIXME. This comment was added by an automated script.
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
