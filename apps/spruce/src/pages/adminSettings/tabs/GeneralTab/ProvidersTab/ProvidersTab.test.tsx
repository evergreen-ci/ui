import { FieldValidation } from "@rjsf/core";
import { validate } from "./ProvidersTab";
import { resourceTags } from "./schemaFields";
import { ProvidersFormState } from "./types";

const emptyField = (): FieldValidation => ({
  __errors: [],
  addError: vi.fn(),
});

const makeErrors = () => ({
  providers: {
    resourceTags: {
      mongodbEnv: emptyField(),
      mongodbOwner: emptyField(),
    },
  },
});

const makeFormData = (
  mongodbEnv: string,
  mongodbOwner: string,
): ProvidersFormState =>
  ({
    providers: {
      resourceTags: { mongodbEnv, mongodbOwner },
    },
  }) as ProvidersFormState;

describe("providers tab validation", () => {
  it("allows an unset environment in the form schema", () => {
    expect(resourceTags.schema.mongodbEnv.enum).toContain("");
  });

  it("allows resource tags to be unset", () => {
    const errors = makeErrors();

    validate(
      makeFormData("", ""),
      errors as unknown as Parameters<typeof validate>[1],
    );

    expect(
      errors.providers.resourceTags.mongodbEnv.addError,
    ).not.toHaveBeenCalled();
    expect(
      errors.providers.resourceTags.mongodbOwner.addError,
    ).not.toHaveBeenCalled();
  });

  it("requires an environment when an owner is set", () => {
    const errors = makeErrors();

    validate(
      makeFormData("", "evergreen@mongodb.com"),
      errors as unknown as Parameters<typeof validate>[1],
    );

    expect(
      errors.providers.resourceTags.mongodbEnv.addError,
    ).toHaveBeenCalledWith(
      "MongoDB Environment is required when MongoDB Owner Email is set.",
    );
  });

  it("requires an owner when an environment is set", () => {
    const errors = makeErrors();

    validate(
      makeFormData("staging", ""),
      errors as unknown as Parameters<typeof validate>[1],
    );

    expect(
      errors.providers.resourceTags.mongodbOwner.addError,
    ).toHaveBeenCalledWith(
      "MongoDB Owner Email is required when MongoDB Environment is set.",
    );
  });
});
