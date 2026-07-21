import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { SpruceForm } from "..";

describe("DurationField", () => {
  it("preserves the loaded value without changing the form", () => {
    const onChange = vi.fn();
    render(
      <SpruceForm
        formData={{ duration: "1w2d" }}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    expect(screen.getByText("Interpreted as 1 week, 2 days.")).toBeVisible();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("serializes explicit default and disabled modes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SpruceForm
        formData={{ duration: "5d" }}
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );

    await user.click(screen.getByRole("radio", { name: /Use default/ }));
    expect(onChange.mock.lastCall?.[0].formData.duration).toBe("0s");

    await user.click(screen.getByRole("radio", { name: /Disabled/ }));
    expect(onChange.mock.lastCall?.[0].formData.duration).toBe("-1s");
  });
});

const schema = {
  type: "object" as const,
  properties: {
    duration: {
      type: "string" as const,
      title: "Retry lookback",
      format: "adminDuration",
    },
  },
};

const uiSchema = {
  duration: {
    "ui:field": "DurationField",
    "ui:options": {
      allowDisabled: true,
      defaultDuration: "7d",
      defaultLabel: "7 days",
    },
  },
};
