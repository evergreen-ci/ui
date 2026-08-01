import { FieldValidation } from "@rjsf/core";
import { BootstrapMethod, CommunicationMethod } from "gql/generated/types";
import { validate } from "./HostTab";
import { HostFormState } from "./types";

const emptyField = (): FieldValidation => ({
  __errors: [],
  addError: vi.fn(),
});

const makeErrors = () => ({
  setup: { communicationMethod: emptyField() },
  sshConfig: { execUser: emptyField() },
  containerIsolation: {
    image: emptyField(),
    requireIsolation: emptyField(),
  },
});

const baseFormData: HostFormState = {
  setup: {
    bootstrapMethod: BootstrapMethod.Ssh,
    communicationMethod: CommunicationMethod.Ssh,
  },
  sshConfig: {
    execUser: "exec-user",
  },
  containerIsolation: {
    enabled: false,
    image: "",
    requireIsolation: false,
  },
} as unknown as HostFormState;

describe("host tab validate", () => {
  it("does not add errors when container isolation is disabled and unconfigured", () => {
    const errors = makeErrors();
    validate(baseFormData, errors as unknown as Parameters<typeof validate>[1]);
    expect(errors.sshConfig.execUser.addError).not.toHaveBeenCalled();
    expect(errors.containerIsolation.image.addError).not.toHaveBeenCalled();
    expect(
      errors.containerIsolation.requireIsolation.addError,
    ).not.toHaveBeenCalled();
  });

  it("requires exec user when container isolation is enabled", () => {
    const errors = makeErrors();
    const formData = {
      ...baseFormData,
      sshConfig: { execUser: "" },
      containerIsolation: {
        enabled: true,
        image: "some-image",
        requireIsolation: false,
      },
    } as unknown as HostFormState;
    validate(formData, errors as unknown as Parameters<typeof validate>[1]);
    expect(errors.sshConfig.execUser.addError).toHaveBeenCalledWith(
      "Exec User is required when Container Isolation is enabled.",
    );
  });

  it("requires a container image when container isolation is enabled", () => {
    const errors = makeErrors();
    const formData = {
      ...baseFormData,
      containerIsolation: {
        enabled: true,
        image: "",
        requireIsolation: false,
      },
    } as unknown as HostFormState;
    validate(formData, errors as unknown as Parameters<typeof validate>[1]);
    expect(errors.containerIsolation.image.addError).toHaveBeenCalledWith(
      "Container Image is required when Container Isolation is enabled.",
    );
  });

  it("rejects require isolation when container isolation is disabled", () => {
    const errors = makeErrors();
    const formData = {
      ...baseFormData,
      containerIsolation: {
        enabled: false,
        image: "",
        requireIsolation: true,
      },
    } as unknown as HostFormState;
    validate(formData, errors as unknown as Parameters<typeof validate>[1]);
    expect(
      errors.containerIsolation.requireIsolation.addError,
    ).toHaveBeenCalledWith(
      "Require Isolation has no effect when Container Isolation is not enabled.",
    );
  });

  it("does not add errors for a fully valid container isolation config", () => {
    const errors = makeErrors();
    const formData = {
      ...baseFormData,
      sshConfig: { execUser: "exec-user" },
      containerIsolation: {
        enabled: true,
        image: "some-image",
        requireIsolation: true,
      },
    } as unknown as HostFormState;
    validate(formData, errors as unknown as Parameters<typeof validate>[1]);
    expect(errors.sshConfig.execUser.addError).not.toHaveBeenCalled();
    expect(errors.containerIsolation.image.addError).not.toHaveBeenCalled();
    expect(
      errors.containerIsolation.requireIsolation.addError,
    ).not.toHaveBeenCalled();
  });
});
