import { MongoDbEnvironment } from "gql/generated/types";
import { validateResourceTags } from "./ProvidersTab";
import { ProvidersFormState } from "./types";

const validateFormResourceTags = (
  mongodbEnv: MongoDbEnvironment | "",
  mongodbOwner: string,
  initialValues = { mongodbEnv, mongodbOwner },
) => {
  const addEnvironmentError = vi.fn();
  const addOwnerError = vi.fn();
  const errors = {
    providers: {
      aws: {
        resourceTags: {
          mongodbEnv: { addError: addEnvironmentError },
          mongodbOwner: { addError: addOwnerError },
        },
      },
    },
  };

  validateResourceTags(initialValues)(
    {
      providers: {
        aws: {
          resourceTags: { mongodbEnv, mongodbOwner },
        },
      },
    } as ProvidersFormState,
    errors as unknown as Parameters<ReturnType<typeof validateResourceTags>>[1],
  );

  return { addEnvironmentError, addOwnerError };
};

describe("providers tab validation", () => {
  it("allows resource tags to be unset", () => {
    const { addEnvironmentError, addOwnerError } = validateFormResourceTags(
      "",
      "",
    );

    expect(addEnvironmentError).not.toHaveBeenCalled();
    expect(addOwnerError).not.toHaveBeenCalled();
  });

  it("allows an owner without an environment", () => {
    const { addEnvironmentError, addOwnerError } = validateFormResourceTags(
      "",
      "evergreen@mongodb.com",
    );

    expect(addEnvironmentError).not.toHaveBeenCalled();
    expect(addOwnerError).not.toHaveBeenCalled();
  });

  it("allows an environment without an owner", () => {
    const { addEnvironmentError, addOwnerError } = validateFormResourceTags(
      MongoDbEnvironment.Staging,
      "",
    );

    expect(addEnvironmentError).not.toHaveBeenCalled();
    expect(addOwnerError).not.toHaveBeenCalled();
  });

  it("rejects clearing values that have already been set", () => {
    const clearedEnvironment = validateFormResourceTags(
      "",
      "evergreen@mongodb.com",
      {
        mongodbEnv: MongoDbEnvironment.Staging,
        mongodbOwner: "",
      },
    );
    const clearedOwner = validateFormResourceTags(
      MongoDbEnvironment.Staging,
      "",
      {
        mongodbEnv: "",
        mongodbOwner: "evergreen@mongodb.com",
      },
    );

    expect(clearedEnvironment.addEnvironmentError).toHaveBeenCalledOnce();
    expect(clearedEnvironment.addOwnerError).not.toHaveBeenCalled();
    expect(clearedOwner.addEnvironmentError).not.toHaveBeenCalled();
    expect(clearedOwner.addOwnerError).toHaveBeenCalledOnce();
  });
});
