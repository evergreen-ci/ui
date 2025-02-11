import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { ValidateProps } from "components/SpruceForm";
import { Form, FormProps } from "./Form";
import {
  FormStateMap,
  initialData,
  TestProvider,
  TestRoutes,
  usePopulateForm,
  useTestContext,
} from "./test-utils";

type ComponentProps = FormProps<TestRoutes, FormStateMap>;

const Component: React.FC<{
  disabled?: ComponentProps["disabled"];
  tab?: ComponentProps["tab"];
  validate?: ComponentProps["validate"];
}> = ({ disabled = false, tab = "foo", validate }) => {
  const state = useTestContext();
  usePopulateForm(initialData[tab], tab);

  return (
    <Form
      disabled={disabled}
      formSchema={formSchema[tab]}
      state={state}
      tab={tab}
      validate={validate}
    />
  );
};

describe("context-based form", () => {
  it("should render the form with the initial data", () => {
    render(<Component />, {
      wrapper: TestProvider,
    });
    expect(screen.getByText("Caps Lock Enabled")).toBeInTheDocument();
    expect(screen.getByLabelText("Caps Lock Enabled")).toBeChecked();
  });

  it("updates the data", async () => {
    const user = userEvent.setup();
    render(<Component />, {
      wrapper: TestProvider,
    });
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    await user.click(screen.getByText("Caps Lock Enabled"));
    expect(checkbox).not.toBeChecked();
  });

  it("applies a validate function that shows an error message", async () => {
    const user = userEvent.setup();
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    render(<Component tab="bar" validate={barValidator} />, {
      wrapper: TestProvider,
    });
    await user.clear(screen.getByLabelText("Age"));
    expect(screen.getByLabelText("Age")).toHaveValue("");
    expect(screen.queryByText("Invalid Age!")).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("Age"), "30");
    expect(screen.getByText("Invalid Age!")).toBeInTheDocument();
  });

  it("disables the entire form when specified", () => {
    render(<Component disabled tab="bar" />, {
      wrapper: TestProvider,
    });
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByLabelText("Age")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

const barValidator = ((formData, errors) => {
  if (formData.age === 30) {
    errors.age.addError("Invalid Age!");
  }
  return errors;
}) satisfies ValidateProps<FormStateMap["bar"]>;

const formSchema = {
  foo: {
    fields: {},
    schema: {
      type: "object" as const,
      title: "Test Form",
      properties: {
        capsLockEnabled: {
          type: "boolean" as const,
          title: "Caps Lock Enabled",
        },
      },
    },
    uiSchema: {},
  },
  bar: {
    fields: {},
    schema: {
      type: "object" as const,
      title: "Add User",
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        age: {
          type: "number" as const,
          title: "Age",
        },
      },
    },
    uiSchema: {},
  },
};
