import { render, screen } from "test_utils";
import { Body, H1, Link } from ".";

describe("via typography wrapper", () => {
  it("renders text components", () => {
    render(
      <>
        <H1>Page title</H1>
        <Body>Body copy</Body>
        <Link href="https://mongodb.com">Docs</Link>
      </>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Page title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "https://mongodb.com",
    );
  });
});
