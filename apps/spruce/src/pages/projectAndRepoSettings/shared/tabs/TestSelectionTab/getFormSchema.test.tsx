import { render, screen } from "@evg-ui/lib/test_utils";
import { SpruceForm } from "components/SpruceForm";
import { getFormSchema } from "./getFormSchema";
import { TestSelectionFormState } from "./types";

const formData: TestSelectionFormState = {
  projectLevel: {
    allowed: true,
  },
  taskLevel: {
    defaultEnabled: true,
    mainlineDefaultEnabled: false,
  },
};

const renderForm = (canEnableTaskLevel: boolean, canEnableMainline = true) => {
  const { fields, schema, uiSchema } = getFormSchema({
    canEnableTaskLevel,
    canEnableMainline,
  });

  return render(
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={vi.fn()}
      schema={schema}
      uiSchema={uiSchema}
    />,
  );
};

describe("getFormSchema", () => {
  it("renders patch and mainline settings in one task-level card", () => {
    renderForm(true);

    expect(
      screen.getByRole("heading", { name: "Project-Level Test Selection" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Task-Level Test Selection" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Run Test Selection on Patches"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Run Test Selection on Mainline"),
    ).toBeInTheDocument();
  });

  it("warns when task-level settings cannot take effect", () => {
    renderForm(false);

    expect(
      screen.getByText(
        "Test selection must be enabled for the project before it can be enabled for patches or mainline commits.",
      ),
    ).toBeInTheDocument();
  });

  it("explains that mainline test selection requires patch test selection", () => {
    renderForm(true, false);

    expect(
      screen.getByText(
        "Test selection cannot be enabled for mainline commits without also being enabled for patches.",
      ),
    ).toBeInTheDocument();
  });
});
