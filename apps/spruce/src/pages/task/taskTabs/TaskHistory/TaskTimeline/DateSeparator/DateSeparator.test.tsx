import { render, screen } from "@evg-ui/lib/test_utils";
import DateSeparator from ".";

describe("DateSeparator", () => {
  const dateObject = new Date("2024-06-01T05:00:00Z");

  it("renders the date in the default timezone (UTC)", () => {
    render(<DateSeparator date={dateObject} />);
    expect(screen.getByText(/6\/01/i)).toBeInTheDocument();
  });

  it("renders the date in a specific timezone (America/New_York)", () => {
    render(<DateSeparator date={dateObject} timezone="America/New_York" />);
    expect(screen.getByText(/6\/01/i)).toBeInTheDocument();
  });

  it("renders the date in a different timezone (Asia/Tokyo)", () => {
    render(<DateSeparator date={dateObject} timezone="Asia/Tokyo" />);
    expect(screen.getByText(/5\/31/i)).toBeInTheDocument();
  });

  it("renders correctly for a date string without timezone info", () => {
    render(<DateSeparator date={dateObject} />);
    expect(screen.getByText(/6\/01/i)).toBeInTheDocument();
  });

  it("handles invalid date gracefully", () => {
    render(<DateSeparator date={undefined} />);
    expect(screen.getByText(/Invalid date/i)).toBeInTheDocument();
  });
});
