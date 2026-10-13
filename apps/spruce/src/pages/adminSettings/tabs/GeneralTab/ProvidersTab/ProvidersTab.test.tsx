import { createErrorHandler } from "@rjsf/utils";
import { render, screen, userEvent, waitFor } from "@evg-ui/lib/test_utils";
import { SpruceForm } from "components/SpruceForm";
import { RecursivelyAddError } from "components/SpruceForm/types";
import { MongoDbEnvironment } from "gql/generated/types";
import { adminSettings } from "../../testData";
import { formSchema } from "./getFormSchema";
import { validateResourceTags } from "./ProvidersTab";
import { gqlToForm } from "./transformers";
import { ProvidersFormState } from "./types";

type ResourceTags = ProvidersFormState["providers"]["aws"]["resourceTags"];
const defaultResourceTags: ResourceTags = {
  mongodbEnv: "",
  mongodbOwner: "",
  mongodbOwnerEmailDomains: ["mongodb.com", "10gen.com"],
};

const makeForm = (resourceTags: ResourceTags): ProvidersFormState => {
  const form = gqlToForm(adminSettings)!;
  return {
    ...form,
    providers: {
      ...form.providers,
      aws: { ...form.providers.aws, resourceTags },
    },
  };
};

const validateFormResourceTags = (
  values: Partial<ResourceTags>,
  initialValues: Partial<ResourceTags> = values,
) => {
  const form = makeForm({ ...defaultResourceTags, ...values });
  const errors = createErrorHandler(
    form,
  ) as RecursivelyAddError<ProvidersFormState>;
  return validateResourceTags({ ...defaultResourceTags, ...initialValues })(
    form,
    errors,
  ).providers.aws.resourceTags;
};

describe("providers tab validation", () => {
  it("allows an unset owner and environment with the default domains", () => {
    const errors = validateFormResourceTags({});
    expect(errors.mongodbEnv.__errors).toEqual([]);
    expect(errors.mongodbOwner.__errors).toEqual([]);
    expect(errors.mongodbOwnerEmailDomains.__errors).toEqual([]);
  });

  it("allows an owner without an environment", () => {
    const errors = validateFormResourceTags({
      mongodbOwner: "evergreen@mongodb.com",
    });
    expect(errors.mongodbEnv.__errors).toEqual([]);
    expect(errors.mongodbOwner.__errors).toEqual([]);
  });

  it("allows an environment without an owner", () => {
    const errors = validateFormResourceTags({
      mongodbEnv: MongoDbEnvironment.Staging,
    });
    expect(errors.mongodbEnv.__errors).toEqual([]);
    expect(errors.mongodbOwner.__errors).toEqual([]);
  });

  it("rejects clearing values that have already been set", () => {
    const errors = validateFormResourceTags(
      {},
      {
        mongodbEnv: MongoDbEnvironment.Staging,
        mongodbOwner: "evergreen@mongodb.com",
      },
    );
    expect(errors.mongodbEnv.__errors).toHaveLength(1);
    expect(errors.mongodbOwner.__errors).toHaveLength(1);
  });

  it.each([
    [],
    ["@mongodb.com"],
    ["*.mongodb.com"],
    ["MONGODB.COM"],
    ["mongodb.com "],
    ["https://mongodb.com"],
    ["sub..mongodb.com"],
    ["-mongodb.com"],
    ["mongodb-.com"],
    ["mongodb"],
    ["mongodb.com", "mongodb.com"],
  ])(
    "rejects invalid domain lists %j",
    (...mongodbOwnerEmailDomains: string[]) => {
      const errors = validateFormResourceTags({ mongodbOwnerEmailDomains });
      expect(errors.mongodbOwnerEmailDomains.__errors).toHaveLength(1);
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
    expect(errors.mongodbOwner.__errors).toHaveLength(1);
  });

  it("allows replacing the owner and its domain in one save", () => {
    const errors = validateFormResourceTags(
      {
        mongodbOwner: "team@example.com",
        mongodbOwnerEmailDomains: ["example.com"],
      },
      { mongodbOwner: "team@mongodb.com" },
    );
    expect(errors.mongodbOwner.__errors).toEqual([]);
    expect(errors.mongodbOwnerEmailDomains.__errors).toEqual([]);
  });

  it("renders the editable domain chips and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SpruceForm
        {...formSchema}
        formData={makeForm(defaultResourceTags)}
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
