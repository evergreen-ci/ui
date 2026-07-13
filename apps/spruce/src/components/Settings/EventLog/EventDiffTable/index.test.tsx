import { render, screen, stubGetClientRects } from "@evg-ui/lib/test_utils";
import EventDiffTable from ".";

describe("EventDiffTable", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  it("renders a shifted array as one row and highlights only the addition", () => {
    render(
      <EventDiffTable
        after={{
          projectRef: {
            admins: ["bynn.lee", "jonathan.brill", "annie.black"],
          },
        }}
        before={{
          projectRef: {
            admins: ["jonathan.brill", "annie.black"],
          },
        }}
      />,
    );

    expect(screen.getByText("projectRef.admins")).toBeInTheDocument();
    expect(screen.queryByText("projectRef.admins[0]")).not.toBeInTheDocument();
    expect(screen.getByLabelText('Added "bynn.lee"')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Removed/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/"jonathan\.brill"/)).toHaveLength(2);
    expect(screen.getAllByText(/"annie\.black"/)).toHaveLength(2);
  });

  it("highlights a reordered value in both columns", () => {
    render(
      <EventDiffTable
        after={{ admins: ["annie.black", "jonathan.brill"] }}
        before={{ admins: ["jonathan.brill", "annie.black"] }}
      />,
    );

    expect(
      screen.getByLabelText('Removed "jonathan.brill"'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Added "jonathan.brill"')).toBeInTheDocument();
  });

  it("renders changed fields within matched array objects as leaf rows", () => {
    render(
      <EventDiffTable
        after={{
          subscriptions: [
            {
              id: "subscription",
              subscriber: { type: "email" },
              trigger: "git_tag_request",
            },
          ],
        }}
        before={{
          subscriptions: [
            {
              id: "subscription",
              subscriber: { type: "email" },
              trigger: "patch",
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("subscriptions[0].trigger")).toBeInTheDocument();
    expect(screen.getByText('"patch"')).toBeInTheDocument();
    expect(screen.getByText('"git_tag_request"')).toBeInTheDocument();
    expect(screen.queryByText("subscriptions[0].id")).not.toBeInTheDocument();
    expect(
      screen.queryByText("subscriptions[0].subscriber.type"),
    ).not.toBeInTheDocument();
  });
});
