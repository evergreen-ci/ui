import { createRef } from "react";
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { SpruceForm, SpruceFormRef } from "components/SpruceForm";
import { MongoDbEnvironment } from "gql/generated/types";
import { formSchema } from "./getFormSchema";
import { validateResourceTags } from "./ProvidersTab";
import { ProvidersFormState } from "./types";

type ResourceTags = ProvidersFormState["providers"]["aws"]["resourceTags"];
const defaultResourceTags: ResourceTags = {
  mongodbEnv: "",
  mongodbOwner: "",
  mongodbOwnerEmailDomains: ["mongodb.com", "10gen.com"],
};

const validateFormResourceTags = (
  values: Partial<ResourceTags>,
  initialValues: Partial<ResourceTags> = values,
) => {
  const form = {
    providers: {
      aws: {
        resourceTags: { ...defaultResourceTags, ...values },
      },
    },
  };
  const resourceTagErrors = {
    mongodbEnv: { __errors: [], addError: vi.fn() },
    mongodbOwner: { __errors: [], addError: vi.fn() },
    mongodbOwnerEmailDomains: { __errors: [], addError: vi.fn() },
  };
  const errors = {
    providers: { aws: { resourceTags: resourceTagErrors } },
  };
  validateResourceTags({ ...defaultResourceTags, ...initialValues })(
    form as ProvidersFormState,
    errors as unknown as Parameters<ReturnType<typeof validateResourceTags>>[1],
  );
  return resourceTagErrors;
};

describe("providers tab validation", () => {
  it("allows an unset owner and environment with the default domains", () => {
    const errors = validateFormResourceTags({});
    expect(errors.mongodbEnv.addError).not.toHaveBeenCalled();
    expect(errors.mongodbOwner.addError).not.toHaveBeenCalled();
    expect(errors.mongodbOwnerEmailDomains.addError).not.toHaveBeenCalled();
  });

  it("allows an owner without an environment", () => {
    const errors = validateFormResourceTags({
      mongodbOwner: "evergreen@mongodb.com",
    });
    expect(errors.mongodbEnv.addError).not.toHaveBeenCalled();
    expect(errors.mongodbOwner.addError).not.toHaveBeenCalled();
  });

  it("allows an environment without an owner", () => {
    const errors = validateFormResourceTags({
      mongodbEnv: MongoDbEnvironment.Staging,
    });
    expect(errors.mongodbEnv.addError).not.toHaveBeenCalled();
    expect(errors.mongodbOwner.addError).not.toHaveBeenCalled();
  });

  it("rejects clearing values that have already been set", () => {
    const errors = validateFormResourceTags(
      {},
      {
        mongodbEnv: MongoDbEnvironment.Staging,
        mongodbOwner: "evergreen@mongodb.com",
      },
    );
    expect(errors.mongodbEnv.addError).toHaveBeenCalledWith(
      "MongoDB Environment cannot be unset after it has been configured.",
    );
    expect(errors.mongodbOwner.addError).toHaveBeenCalledWith(
      "MongoDB Owner Email cannot be unset after it has been configured.",
    );
  });

  it.each([
    "@mongodb.com",
    "*.mongodb.com",
    "MONGODB.COM",
    "mongodb.com ",
    "https://mongodb.com",
    "sub..mongodb.com",
    "-mongodb.com",
    "mongodb-.com",
    "mongodb",
  ])("rejects invalid domain %s", (domain) => {
    const errors = validateFormResourceTags({
      mongodbOwnerEmailDomains: [domain],
    });
    expect(errors.mongodbOwnerEmailDomains.addError).toHaveBeenCalledWith(
      "Enter lowercase domains without @, wildcards, or whitespace.",
    );
  });

  it.each([
    { domains: [], message: /must NOT have fewer than 1 items/ },
    {
      domains: ["mongodb.com", "mongodb.com"],
      message: /must NOT have duplicate items/,
    },
  ])(
    "shows a validation error for domain list $domains",
    ({ domains, message }) => {
      const formRef = createRef<SpruceFormRef>();
      const formData = {
        providers: {
          aws: {
            resourceTags: {
              ...defaultResourceTags,
              mongodbOwnerEmailDomains: domains,
            },
          },
        },
      };
      render(
        <SpruceForm
          {...formSchema}
          ref={formRef}
          formData={formData}
          liveValidate={false}
          onError={vi.fn()}
        />,
      );

      act(() => {
        expect(formRef.current?.validateFormWithFormData(formData)).toBe(false);
      });
      expect(screen.getByText(message)).toBeVisible();
    },
  );

  it.each([
    "team@mongodb.com",
    "team@notexample.com",
    "team@sub.example.com",
    "team@EXAMPLE.COM",
  ])("rejects owner %s outside the configured domains", (mongodbOwner) => {
    const errors = validateFormResourceTags({
      mongodbOwner,
      mongodbOwnerEmailDomains: ["example.com"],
    });
    expect(errors.mongodbOwner.addError).toHaveBeenCalledWith(
      "MongoDB Owner Email must use an allowed email domain.",
    );
  });

  it("allows replacing the owner and its domain in one save", () => {
    const errors = validateFormResourceTags(
      {
        mongodbOwner: "team@example.com",
        mongodbOwnerEmailDomains: ["example.com"],
      },
      { mongodbOwner: "team@mongodb.com" },
    );
    expect(errors.mongodbOwner.addError).not.toHaveBeenCalled();
    expect(errors.mongodbOwnerEmailDomains.addError).not.toHaveBeenCalled();
  });

  it("renders the editable domain chips and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SpruceForm
        {...formSchema}
        formData={{
          providers: { aws: { resourceTags: defaultResourceTags } },
        }}
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText("MongoDB Owner Email Domains");
    expect(screen.getByText("mongodb.com")).toBeVisible();
    expect(screen.getByText("10gen.com")).toBeVisible();
    await user.type(input, "example.com{enter}");
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(
      onChange.mock.lastCall?.[0].formData.providers.aws.resourceTags
        .mongodbOwnerEmailDomains,
    ).toEqual(["mongodb.com", "10gen.com", "example.com"]);
  });
});
