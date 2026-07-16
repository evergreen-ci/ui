import {
  MockedProvider,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import widgets from "./Widgets";
import { SpruceForm, SpruceFormContainer } from ".";

describe("spruce form", () => {
  it("should render as expected", () => {
    render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          formData={basicForm.formData}
          onChange={vi.fn()}
          schema={basicForm.schema}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>,
    );
    expect(screen.getByLabelText("Project Cloning Method")).toBeInTheDocument();
    expect(screen.queryByText("Username Label")).not.toBeInTheDocument();
    expect(screen.getByDataCy("add-button")).toHaveTextContent("New User");
    expect(screen.getAllByRole("heading", { level: 3 })[1]).toHaveTextContent(
      "Manage Access",
    );
  });

  it("updating the form should trigger a callback and update the form state", async () => {
    let data = {};
    const onChange = vi.fn((x) => {
      const { formData } = x;
      data = formData;
    });

    const user = userEvent.setup();
    render(
      <SpruceFormContainer title="Just a test">
        <SpruceForm
          formData={basicForm.formData}
          onChange={onChange}
          schema={basicForm.schema}
          uiSchema={basicForm.uiSchema}
        />
      </SpruceFormContainer>,
    );
    await user.clear(screen.getByDataCy("valid-projects-input"));
    await user.type(screen.getByDataCy("valid-projects-input"), "new value");
    await user.click(screen.getByDataCy("add-button"));
    expect(screen.queryAllByDataCy("new-user-input")).toHaveLength(2);
    await user.type(screen.getAllByDataCy("new-user-input")[0], "new-user");
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByDataCy("valid-projects-input")).toHaveValue("new value");
    expect(data).toStrictEqual({
      ...basicForm.formData,
      access: null,
      users: ["new-user", "initial-user"],
      validProjects: "new value",
    });
  });

  describe("form elements", () => {
    describe("text input", () => {
      describe("invisible errors", () => {
        it("should work with validate function", async () => {
          let formErrors = {};
          const onChange = vi.fn((x) => {
            const { errors } = x;
            formErrors = errors;
          });
          const validate = vi.fn((_formData, err) => err);

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textInput();
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
                validate={validate}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-input"), "new value");
          await user.clear(screen.getByDataCy("text-input"));
          expect(screen.getByDataCy("text-input")).toHaveValue("");

          // Invisible errors should be in the form error state but not visible on the page.
          expect(formErrors).toStrictEqual([{ stack: "textInput: invisible" }]);
          expect(screen.queryByText("invisible")).toBeNull();
        });
      });

      describe("emptyValue", () => {
        it("defaults to '' when not specified", async () => {
          let data = {};
          const onChange = vi.fn((x) => {
            const { formData } = x;
            data = formData;
          });

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textInput();
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-input"), "new value");
          await user.clear(screen.getByDataCy("text-input"));
          expect(screen.getByDataCy("text-input")).toHaveValue("");
          expect(data).toStrictEqual({
            textInput: "",
          });
        });

        it("uses provided value when specified", async () => {
          let data = {};
          const onChange = vi.fn((x) => {
            const { formData } = x;
            data = formData;
          });

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textInput("myEmptyValue");
          render(
            <SpruceFormContainer title="Test for Text Input">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-input"), "new value");
          await user.clear(screen.getByDataCy("text-input"));
          expect(screen.getByDataCy("text-input")).toHaveValue("myEmptyValue");
          expect(data).toStrictEqual({
            textInput: "myEmptyValue",
          });
        });
      });
    });

    describe("text area", () => {
      describe("invisible errors", () => {
        it("should work with validate function", async () => {
          let formErrors = {};
          const onChange = vi.fn((x) => {
            const { errors } = x;
            formErrors = errors;
          });
          const validate = vi.fn((_formData, err) => err);

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textArea();
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
                validate={validate}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-area"), "new value");
          await user.clear(screen.getByDataCy("text-area"));
          expect(screen.getByDataCy("text-area")).toHaveValue("");

          // Invisible errors should be in the form error state but not visible on the page.
          expect(formErrors).toStrictEqual([{ stack: "textArea: invisible" }]);
          expect(screen.queryByText("invisible")).toBeNull();
        });
      });

      describe("emptyValue", () => {
        it("defaults to '' when not specified", async () => {
          let data = {};
          const onChange = vi.fn((x) => {
            const { formData } = x;
            data = formData;
          });

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textArea();
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-area"), "new value");
          await user.clear(screen.getByDataCy("text-area"));
          expect(screen.getByDataCy("text-area")).toHaveValue("");
          expect(data).toStrictEqual({
            textArea: "",
          });
        });

        it("uses provided value when specified", async () => {
          let data = {};
          const onChange = vi.fn((x) => {
            const { formData } = x;
            data = formData;
          });

          const user = userEvent.setup();
          const { formData, schema, uiSchema } = textArea("myEmptyValue");
          render(
            <SpruceFormContainer title="Test for Text Area">
              <SpruceForm
                formData={formData}
                onChange={onChange}
                schema={schema}
                uiSchema={uiSchema}
              />
            </SpruceFormContainer>,
          );
          await user.type(screen.getByDataCy("text-area"), "new value");
          await user.clear(screen.getByDataCy("text-area"));
          expect(screen.getByDataCy("text-area")).toHaveValue("myEmptyValue");
          expect(data).toStrictEqual({
            textArea: "myEmptyValue",
          });
        });
      });
    });

    describe("select", () => {
      it("renders with the specified default selected", () => {
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        expect(screen.getByText("Vanilla")).toBeInTheDocument();
        expect(screen.queryByText("Chocolate")).not.toBeInTheDocument();
        expect(screen.queryByText("Strawberry")).not.toBeInTheDocument();
      });

      it("shows three options on click", async () => {
        const user = userEvent.setup();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        await user.click(screen.getByRole("button"));
        expect(screen.queryAllByText("Vanilla")).toHaveLength(2);
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.getByText("Strawberry")).toBeInTheDocument();
      });

      it.each([true, false])(
        "closes the menu and displays the new selected option on click (liveValidate=%s)",
        async (liveValidate) => {
          const user = userEvent.setup();
          const { formData, schema, uiSchema } = select;
          render(
            <SpruceForm
              formData={formData}
              liveValidate={liveValidate}
              onChange={vi.fn()}
              schema={schema}
              uiSchema={uiSchema}
            />,
          );
          await user.click(screen.getByRole("button"));
          await user.click(screen.getByRole("option", { name: "Chocolate" }));
          await waitFor(() => {
            expect(screen.queryByText("Vanilla")).not.toBeInTheDocument();
          });
          expect(screen.getByText("Chocolate")).toBeInTheDocument();
          expect(screen.queryByText("Strawberry")).not.toBeInTheDocument();
        },
      );

      it("disables options included in enumDisabled", async () => {
        const user = userEvent.setup();
        const { formData, schema, uiSchema } = select;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        await user.click(screen.getByRole("button"));

        // LeafyGreen doesn't label disabled options as such, so instead of checking for a property
        // ensure that the disabled element is not clickable.
        expect(
          screen.getByRole("option", {
            name: "Strawberry",
          }),
        ).toHaveStyle("cursor: not-allowed");
      });
    });

    describe("radio group", () => {
      it("renders 3 inputs with the specified default selected", () => {
        const { formData, schema, uiSchema } = radioGroup;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        expect(screen.getAllByRole("radio")).toHaveLength(3);
        expect(screen.getByLabelText("New York")).toBeChecked();
      });

      it("disables options in enumDisabled", () => {
        const { formData, schema, uiSchema } = radioGroup;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        expect(screen.getByLabelText("Connecticut")).toHaveAttribute(
          "aria-disabled",
          "true",
        );
      });

      it("shows option descriptions", () => {
        const { formData, schema, uiSchema } = radioGroup;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        expect(screen.getByText("The Garden State")).toBeVisible();
      });
    });

    describe("segmented control", () => {
      it("renders with the specified default selected", () => {
        const { formData, schema, uiSchema } = segmentedControl;
        render(
          <SpruceForm
            formData={formData}
            onChange={vi.fn()}
            schema={schema}
            uiSchema={uiSchema}
          />,
        );
        expect(screen.getByRole("tab", { name: "Small" })).toHaveAttribute(
          "aria-selected",
          "true",
        );
      });

      it.each([true, false])(
        "calls onChange when clicking a different option (liveValidate=%s)",
        async (liveValidate) => {
          const user = userEvent.setup();
          let data = {};
          const onChange = vi.fn((x) => {
            data = x.formData;
          });
          const { formData, schema, uiSchema } = segmentedControl;
          render(
            <SpruceForm
              formData={formData}
              liveValidate={liveValidate}
              onChange={onChange}
              schema={schema}
              uiSchema={uiSchema}
            />,
          );
          await user.click(screen.getByRole("tab", { name: "Medium" }));
          expect(onChange).toHaveBeenCalled();
          expect(data).toStrictEqual({ size: "medium" });
        },
      );
    });

    describe("datetime picker", () => {
      beforeEach(() => {
        Element.prototype.scrollIntoView = () => {};
      });

      it("renders the default time correctly", async () => {
        const { schema, uiSchema } = dateTimePicker;
        const onChangeMock = vi.fn();
        render(
          <MockedProvider mocks={[getUserSettingsMock]}>
            <SpruceForm
              onChange={onChangeMock}
              schema={schema}
              uiSchema={uiSchema}
            />
          </MockedProvider>,
        );

        expect(screen.getByLabelText("year")).toHaveValue("2025");
        expect(screen.getByLabelText("month")).toHaveValue("09");
        expect(screen.getByLabelText("day")).toHaveValue("16");
        // Wait for the useUserSettings hook to move to success state and timezone conversion to apply
        await waitFor(() => {
          expect(screen.getByDataCy("hour-input")).toHaveValue("11");
        });
        expect(screen.getByDataCy("minute-input")).toHaveValue("19");
      });

      it("correctly sets the date, preserving time", async () => {
        const user = userEvent.setup();
        const { schema, uiSchema } = dateTimePicker;
        const onChangeMock = vi.fn();
        render(
          <MockedProvider mocks={[getUserSettingsMock]}>
            <SpruceForm
              onChange={onChangeMock}
              schema={schema}
              uiSchema={uiSchema}
            />
          </MockedProvider>,
        );

        // Wait for the useUserSettings hook to move to success state and timezone conversion to apply
        await waitFor(() => {
          expect(screen.getByDataCy("hour-input")).toHaveValue("11");
        });

        await user.clear(screen.getByLabelText("day"));
        await user.type(screen.getByLabelText("day"), "19");
        expect(onChangeMock).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            formData: {
              dateTime:
                "Fri Sep 19 2025 15:19:00 GMT+0000 (Coordinated Universal Time)",
            },
          }),
        );
      });

      it("correctly sets the time, preserving date", async () => {
        const user = userEvent.setup();
        const { schema, uiSchema } = dateTimePicker;
        const onChangeMock = vi.fn();
        render(
          <MockedProvider mocks={[getUserSettingsMock]}>
            <SpruceForm
              onChange={onChangeMock}
              schema={schema}
              uiSchema={uiSchema}
            />
          </MockedProvider>,
        );

        // Wait for the useUserSettings hook to move to success state and timezone conversion to apply
        await waitFor(() => {
          expect(screen.getByDataCy("hour-input")).toHaveValue("11");
        });

        await user.click(screen.getByRole("button", { name: "Clock Icon" }));
        await waitFor(() => {
          expect(screen.getByDataCy("time-picker-options")).toBeVisible();
        });
        await user.click(
          within(screen.getByDataCy("minute-options")).getByText("56"),
        );

        expect(screen.getByDataCy("minute-input")).toHaveValue("56");
        expect(onChangeMock).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            formData: {
              dateTime:
                "Tue Sep 16 2025 15:56:00 GMT+0000 (Coordinated Universal Time)",
            },
          }),
        );
      });
    });
  });
});

const basicForm = {
  formData: {
    cloneMethod: "legacy-ssh",
    users: ["initial-user"],
    validProjects: "spruce",
  },
  schema: {
    properties: {
      access: {
        title: "Manage Access",
        type: "null" as const,
      },
      cloneMethod: {
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
        title: "Project Cloning Method",
        type: "string" as const,
      },
      users: {
        items: {
          type: "string" as const,
        },
        title: "Users",
        type: "array" as const,
      },
      validProjects: {
        placeholder: "Sample input",
        title: "Valid Projects",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    access: {
      "ui:rootFieldId": "access",
      "ui:sectionTitle": true,
    },
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    users: {
      items: {
        "ui:ariaLabelledBy": "root_access",
        "ui:data-cy": "new-user-input",
      },
      "ui:addButtonText": "New User",
    },
    validProjects: {
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
      "ui:widget": "textarea",
    },
  },
};

const textInput = (emptyValue?: string) => ({
  formData: {},
  schema: {
    properties: {
      textInput: {
        default: "",
        minLength: 1,
        title: "Text Input",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    textInput: {
      "ui:data-cy": "text-input",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const textArea = (emptyValue?: string) => ({
  formData: {},
  schema: {
    properties: {
      textArea: {
        default: "",
        minLength: 1,
        title: "Text Area",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    textArea: {
      "ui:data-cy": "text-area",
      "ui:widget": "textarea",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const select = {
  formData: {},
  schema: {
    properties: {
      iceCream: {
        default: "vanilla",
        oneOf: [
          {
            enum: ["vanilla"],
            title: "Vanilla",
            type: "string" as const,
          },
          {
            enum: ["chocolate"],
            title: "Chocolate",
            type: "string" as const,
          },
          {
            enum: ["strawberry"],
            title: "Strawberry",
            type: "string" as const,
          },
        ],
        title: "Ice Cream",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    iceCream: {
      "ui:enumDisabled": ["strawberry"],
    },
  },
};

const radioGroup = {
  formData: {},
  schema: {
    properties: {
      states: {
        default: "ny",
        oneOf: [
          {
            enum: ["ny"],
            title: "New York",
            type: "string" as const,
          },
          {
            description: "The Garden State",
            enum: ["nj"],
            title: "New Jersey",
            type: "string" as const,
          },
          {
            enum: ["ct"],
            title: "Connecticut",
            type: "string" as const,
          },
        ],
        title: "Tri-state Area",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    states: {
      "ui:enumDisabled": ["ct"],
      "ui:widget": "radio",
    },
  },
};

const segmentedControl = {
  formData: { size: "small" },
  schema: {
    properties: {
      size: {
        default: "small",
        oneOf: [
          {
            enum: ["small"],
            title: "Small",
            type: "string" as const,
          },
          {
            enum: ["medium"],
            title: "Medium",
            type: "string" as const,
          },
          {
            enum: ["large"],
            title: "Large",
            type: "string" as const,
          },
        ],
        title: "Size",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    size: {
      "ui:widget": widgets.SegmentedControlWidget,
    },
  },
};

const dateTimePicker = {
  formData: {},
  schema: {
    properties: {
      dateTime: {
        default: new Date(
          "Tue Sep 16 2025 11:19:00 GMT-0400 (Eastern Daylight Time)",
        ).toString(),
        title: "Date Time Picker",
        type: "string" as const,
      },
    },
    type: "object" as const,
  },
  uiSchema: {
    dateTime: {
      "ui:widget": "date-time",
    },
  },
};
