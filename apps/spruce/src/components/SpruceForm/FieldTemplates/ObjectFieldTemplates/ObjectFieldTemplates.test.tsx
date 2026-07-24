import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { SpruceForm } from "components/SpruceForm";
import { AccordionFieldTemplate, CardFieldTemplate, FieldRow } from ".";

const ObjectSchema = {
  type: "object" as const,
  properties: {
    person: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          title: "Name",
        },
        age: {
          type: "integer" as const,
          title: "Age",
        },
      },
    },
  },
};
describe("objectFieldTemplates", () => {
  describe("fieldRow", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": FieldRow,
        name: {
          "ui:data-testid": "name",
        },
        age: {
          "ui:data-testid": "age",
        },
      },
    };
    it("applies data-testid attributes", () => {
      const onChange = vi.fn();
      render(
        <SpruceForm
          formData={{}}
          onChange={onChange}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
    });
    it("renders all fields", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
      expect(screen.getByDataTestId("age")).toBeInTheDocument();
    });

    it("calls onChange when a field is changed", async () => {
      let data;
      const onChange = vi.fn(({ formData }) => {
        data = formData;
      });

      const user = userEvent.setup();
      render(
        <SpruceForm
          formData={{}}
          onChange={onChange}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      await user.type(screen.getByDataTestId("name"), "Bruce Lee");
      await user.type(screen.getByDataTestId("age"), "32");
      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
  });

  describe("cardFieldTemplate", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        name: {
          "ui:data-testid": "name",
        },
        age: {
          "ui:data-testid": "age",
        },
      },
    };
    it("applies data-testid attributes", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
    });
    it("renders all fields in a card", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
      expect(screen.getByDataTestId("age")).toBeInTheDocument();
    });
    it("calls onChange when a field is changed", async () => {
      let data;
      const onChange = vi.fn(({ formData }) => {
        data = formData;
      });

      const user = userEvent.setup();
      render(
        <SpruceForm
          formData={{}}
          onChange={onChange}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      await user.type(screen.getByDataTestId("name"), "Bruce Lee");
      await user.type(screen.getByDataTestId("age"), "32");
      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
  });
  describe("accordionFieldTemplate", () => {
    const uiSchema = {
      person: {
        "ui:ObjectFieldTemplate": AccordionFieldTemplate,
        name: {
          "ui:data-testid": "name",
        },
        age: {
          "ui:data-testid": "age",
        },
      },
    };
    it("applies data-testid attributes", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
    });
    it("renders all fields in an accordion", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(screen.getByDataTestId("name")).toBeInTheDocument();
      expect(screen.getByDataTestId("age")).toBeInTheDocument();
    });
    it("calls onChange when a field is changed", async () => {
      let data;
      const onChange = vi.fn(({ formData }) => {
        data = formData;
      });

      const user = userEvent.setup();
      render(
        <SpruceForm
          formData={{}}
          onChange={onChange}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      await user.type(screen.getByDataTestId("name"), "Bruce Lee");
      await user.type(screen.getByDataTestId("age"), "32");

      expect(data).toStrictEqual({ person: { name: "Bruce Lee", age: 32 } });
    });
    it("accordion is expanded by default", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={uiSchema}
        />,
      );
      expect(
        screen.queryByDataTestId("accordion-collapse-container"),
      ).toHaveAttribute("aria-expanded", "true");
    });
    it("accordion is collapsed by default if defaultOpen is false", () => {
      render(
        <SpruceForm
          formData={{}}
          onChange={vi.fn()}
          schema={ObjectSchema}
          uiSchema={{
            ...uiSchema,
            person: { ...uiSchema.person, "ui:defaultOpen": false },
          }}
        />,
      );
      expect(
        screen.queryByDataTestId("accordion-collapse-container"),
      ).toHaveAttribute("aria-expanded", "false");
    });
  });
});
