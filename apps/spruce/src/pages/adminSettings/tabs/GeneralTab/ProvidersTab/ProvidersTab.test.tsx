import { createRef } from "react";
import Form from "@rjsf/core";
import { render } from "@evg-ui/lib/test_utils";
import { MongoDbEnvironment } from "gql/generated/types";
import { getFormSchema } from "./getFormSchema";

const validateResourceTags = (
  mongodbEnv: MongoDbEnvironment | "",
  mongodbOwner: string,
  initialValues = { mongodbEnv, mongodbOwner },
) => {
  const ref = createRef<InstanceType<typeof Form>>();
  const formData = {
    providers: {
      aws: {
        resourceTags: { mongodbEnv, mongodbOwner },
      },
    },
  };

  render(
    <Form
      ref={ref}
      customFormats={{ validEmail: () => true }}
      formData={formData}
      schema={getFormSchema(initialValues).schema}
    />,
  );

  return ref.current?.validate(formData).errors ?? [];
};

describe("providers tab validation", () => {
  it("allows resource tags to be unset", () => {
    expect(validateResourceTags("", "")).toHaveLength(0);
  });

  it("allows an owner without an environment", () => {
    expect(validateResourceTags("", "evergreen@mongodb.com")).toHaveLength(0);
  });

  it("allows an environment without an owner", () => {
    expect(validateResourceTags(MongoDbEnvironment.Staging, "")).toHaveLength(
      0,
    );
  });

  it("rejects clearing values that have already been set", () => {
    expect(
      validateResourceTags("", "evergreen@mongodb.com", {
        mongodbEnv: MongoDbEnvironment.Staging,
        mongodbOwner: "",
      }),
    ).toHaveLength(1);
    expect(
      validateResourceTags(MongoDbEnvironment.Staging, "", {
        mongodbEnv: "",
        mongodbOwner: "evergreen@mongodb.com",
      }),
    ).toHaveLength(1);
  });
});
