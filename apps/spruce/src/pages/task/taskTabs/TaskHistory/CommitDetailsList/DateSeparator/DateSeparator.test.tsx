import { render, screen } from "@evg-ui/lib/test_utils";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { MockedProvider } from "test_utils/graphql";
import DateSeparator from ".";

describe("DateSeparator", () => {
  const dateObject = new Date("2024-06-01T05:00:00Z");

  it("renders the date in the default timezone (UTC)", () => {
    render(
      <MockedProvider>
        <DateSeparator date={dateObject} />
      </MockedProvider>,
    );
    expect(screen.getByText(/Jun 1, 2024/i)).toBeInTheDocument();
  });

  it("renders the date in a specific timezone (America/New_York)", () => {
    render(
      <MockedProvider mocks={[getUserSettingsMock]}>
        <DateSeparator date={dateObject} />
      </MockedProvider>,
    );
    // June 1, 2024 08:00 in New York (EDT)
    expect(screen.getByText(/Jun 1, 2024/i)).toBeInTheDocument();
  });
});
