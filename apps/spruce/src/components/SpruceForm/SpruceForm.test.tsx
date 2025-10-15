import { MockedProvider } from "@apollo/client/testing";
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@evg-ui/lib/test_utils";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
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
    expect(screen.queryByDataCy("add-button")).toHaveTextContent("New User");
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
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.clear(screen.queryByDataCy("valid-projects-input"));
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.type(screen.queryByDataCy("valid-projects-input"), "new value");
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    await user.click(screen.queryByDataCy("add-button"));
    expect(screen.queryAllByDataCy("new-user-input")).toHaveLength(2);
    await user.type(screen.queryAllByDataCy("new-user-input")[0], "new-user");
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByDataCy("valid-projects-input")).toHaveValue(
      "new value",
    );
    expect(data).toStrictEqual({
      ...basicForm.formData,
      access: null,
      validProjects: "new value",
      users: ["new-user", "initial-user"],
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-input"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue("");

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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-input"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue("");
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-input"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-input"));
          expect(screen.queryByDataCy("text-input")).toHaveValue(
            "myEmptyValue",
          );
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-area"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("");

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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-area"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("");
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
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.type(screen.queryByDataCy("text-area"), "new value");
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          await user.clear(screen.queryByDataCy("text-area"));
          expect(screen.queryByDataCy("text-area")).toHaveValue("myEmptyValue");
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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        await user.click(screen.queryByRole("button"));
        expect(screen.queryAllByText("Vanilla")).toHaveLength(2);
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.getByText("Strawberry")).toBeInTheDocument();
      });

      it("closes the menu and displays the new selected option on click", async () => {
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
        await user.click(screen.getByRole("option", { name: "Chocolate" }));
        await waitFor(() => {
          expect(screen.queryByText("Vanilla")).not.toBeInTheDocument();
        });
        expect(screen.getByText("Chocolate")).toBeInTheDocument();
        expect(screen.queryByText("Strawberry")).not.toBeInTheDocument();
      });

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
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        await user.click(screen.queryByRole("button"));

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
        // Wait for the useUserSettings hook to move to success state
        expect(await screen.findByDataCy("hour-input")).toHaveValue("11");
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

        // Wait for the useUserSettings hook to move to success state
        expect(await screen.findByDataCy("hour-input")).toHaveValue("11");

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

        // Wait for the useUserSettings hook to move to success state
        expect(await screen.findByDataCy("hour-input")).toHaveValue("11");

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
    validProjects: "spruce",
    users: ["initial-user"],
  },
  schema: {
    type: "object" as const,
    properties: {
      cloneMethod: {
        type: "string" as const,
        title: "Project Cloning Method",
        enum: ["legacy-ssh", "oath-token"],
        enumNames: ["Legacy SSH", "Oath Token"],
      },
      validProjects: {
        type: "string" as const,
        title: "Valid Projects",
        placeholder: "Sample input",
      },
      access: {
        type: "null" as const,
        title: "Manage Access",
      },
      users: {
        type: "array" as const,
        title: "Users",
        items: {
          type: "string" as const,
        },
      },
    },
  },
  uiSchema: {
    cloneMethod: {
      "ui:options": {
        label: false,
      },
    },
    validProjects: {
      "ui:widget": "textarea",
      "ui:options": {
        "data-cy": "valid-projects-input",
        label: false,
      },
    },
    access: {
      "ui:rootFieldId": "access",
      "ui:sectionTitle": true,
    },
    users: {
      "ui:addButtonText": "New User",
      items: {
        "ui:ariaLabelledBy": "root_access",
        "ui:data-cy": "new-user-input",
      },
    },
  },
};

const textInput = (emptyValue?: string) => ({
  formData: {},
  schema: {
    type: "object" as const,
    properties: {
      textInput: {
        type: "string" as const,
        title: "Text Input",
        default: "",
        minLength: 1,
      },
    },
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
    type: "object" as const,
    properties: {
      textArea: {
        type: "string" as const,
        title: "Text Area",
        default: "",
        minLength: 1,
      },
    },
  },
  uiSchema: {
    textArea: {
      "ui:widget": "textarea",
      "ui:data-cy": "text-area",
      ...(emptyValue && { "ui:emptyValue": emptyValue }),
    },
  },
});

const select = {
  formData: {},
  schema: {
    type: "object" as const,
    properties: {
      iceCream: {
        type: "string" as const,
        title: "Ice Cream",
        default: "vanilla",
        oneOf: [
          {
            type: "string" as const,
            title: "Vanilla",
            enum: ["vanilla"],
          },
          {
            type: "string" as const,
            title: "Chocolate",
            enum: ["chocolate"],
          },
          {
            type: "string" as const,
            title: "Strawberry",
            enum: ["strawberry"],
          },
        ],
      },
    },
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
    type: "object" as const,
    properties: {
      states: {
        type: "string" as const,
        title: "Tri-state Area",
        default: "ny",
        oneOf: [
          {
            type: "string" as const,
            title: "New York",
            enum: ["ny"],
          },
          {
            type: "string" as const,
            title: "New Jersey",
            description: "The Garden State",
            enum: ["nj"],
          },
          {
            type: "string" as const,
            title: "Connecticut",
            enum: ["ct"],
          },
        ],
      },
    },
  },
  uiSchema: {
    states: {
      "ui:enumDisabled": ["ct"],
      "ui:widget": "radio",
    },
  },
};

const dateTimePicker = {
  formData: {},
  schema: {
    type: "object" as const,
    properties: {
      dateTime: {
        type: "string" as const,
        title: "Date Time Picker",
        default: new Date(
          "Tue Sep 16 2025 11:19:00 GMT-0400 (Eastern Daylight Time)",
        ).toString(),
      },
    },
  },
  uiSchema: {
    dateTime: {
      "ui:widget": "date-time",
    },
  },
};
