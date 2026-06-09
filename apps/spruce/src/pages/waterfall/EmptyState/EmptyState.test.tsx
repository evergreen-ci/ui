import { MemoryRouter, useLocation } from "react-router-dom";
import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { Pagination } from "../types";
import { EmptyState } from ".";

const LocationDisplay: React.FC = () => {
  const location = useLocation();
  return <div data-cy="location-search">{location.search}</div>;
};

const basePagination: Pagination = {
  activeVersionIds: [],
  hasNextPage: true,
  hasPrevPage: false,
  mostRecentVersionOrder: 1000,
  nextPageOrder: 700,
  prevPageOrder: 0,
};

const renderEmptyState = (
  pagination: Pagination,
  initialEntry: string = "/project/spruce/waterfall?tasks=initialsync",
) =>
  render(
    <>
      <EmptyState pagination={pagination} />
      <LocationDisplay />
    </>,
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
      ),
    },
  );

describe("EmptyState", () => {
  it("shows a search older commits button when a task filter has more commits to search", () => {
    renderEmptyState(basePagination);
    expect(
      screen.getByText(
        /Evergreen found no builds matching the applied filters in the 300 commits searched/,
      ),
    ).toBeVisible();
    expect(screen.getByDataCy("search-older-commits-button")).toBeVisible();
  });

  it("clicking the button searches older commits and clears other pagination params", async () => {
    const user = userEvent.setup();
    renderEmptyState(
      basePagination,
      "/project/spruce/waterfall?tasks=initialsync&date=2026-06-01&minOrder=5",
    );

    await user.click(screen.getByDataCy("search-older-commits-button"));

    const search = screen.getByDataCy("location-search");
    expect(search).toHaveTextContent("maxOrder=700");
    expect(search).toHaveTextContent("tasks=initialsync");
    expect(search).not.toHaveTextContent("date");
    expect(search).not.toHaveTextContent("minOrder");
  });

  it("disables the button while the next page is being fetched", () => {
    renderEmptyState(
      basePagination,
      "/project/spruce/waterfall?tasks=initialsync&maxOrder=700",
    );
    expect(screen.getByDataCy("search-older-commits-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("indicates the searched history is exhausted when there is no next page", () => {
    renderEmptyState({
      ...basePagination,
      hasNextPage: false,
      nextPageOrder: 0,
    });
    expect(
      screen.getByText(
        "Evergreen found no builds matching the applied filters in the searched commit history.",
      ),
    ).toBeVisible();
    expect(
      screen.queryByDataCy("search-older-commits-button"),
    ).not.toBeInTheDocument();
  });

  it("does not offer to search older commits when only filters that search the full history are applied", () => {
    renderEmptyState(
      basePagination,
      "/project/spruce/waterfall?requesters=ad_hoc",
    );
    expect(
      screen.getByText(
        "Evergreen found no builds matching the applied filters.",
      ),
    ).toBeVisible();
    expect(
      screen.queryByDataCy("search-older-commits-button"),
    ).not.toBeInTheDocument();
  });
});
