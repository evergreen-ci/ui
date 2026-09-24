import { useMemo, useState } from "react";
import { FieldValidation } from "@rjsf/utils";
import { render, screen, userEvent } from "@evg-ui/lib/test_utils";
import { SpruceForm } from "components/SpruceForm";
import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  Provider,
} from "gql/generated/types";
import { distroData } from "../testData";
import { getFormSchema } from "./getFormSchema";
import { validate } from "./HostTab";
import { formToGql, gqlToForm } from "./transformers";
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
    arch: Arch.Linux_64Bit,
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

describe("host tab form", () => {
  it("preserves bootstrap settings when switching to Legacy SSH", async () => {
    const user = userEvent.setup();
    const initialFormData = gqlToForm(distroData);
    if (!initialFormData) {
      throw new Error("Expected distro test data");
    }
    const initialState = {
      ...initialFormData,
      setup: {
        ...initialFormData.setup,
        bootstrapMethod: BootstrapMethod.UserData,
        communicationMethod: CommunicationMethod.Ssh,
      },
    };
    const bootstrapSettingsChange = vi.fn();
    const ControlledForm = () => {
      const [formData, setFormData] = useState(initialState);
      const formSchema = useMemo(
        () =>
          getFormSchema({
            architecture: formData.setup.arch,
            bootstrapMethod: formData.setup.bootstrapMethod,
            bootstrapSettings: initialState.bootstrapSettings,
            isSingleTaskDistro: false,
            provider: Provider.Static,
          }),
        [formData.setup.arch, formData.setup.bootstrapMethod],
      );

      return (
        <SpruceForm
          customValidate={validate}
          fields={formSchema.fields}
          formData={formData}
          onChange={({ formData: nextFormData }) => {
            bootstrapSettingsChange(nextFormData.bootstrapSettings);
            formToGql(nextFormData, distroData);
            setFormData(nextFormData);
          }}
          schema={formSchema.schema}
          uiSchema={formSchema.uiSchema}
        />
      );
    };

    render(<ControlledForm />);

    await user.clear(screen.getByLabelText("Client Directory"));
    await user.type(
      screen.getByLabelText("Client Directory"),
      "/tmp/modified-client",
    );
    await user.click(screen.getByLabelText("Host Bootstrap Method"));
    await user.click(screen.getByRole("option", { name: "Legacy SSH" }));

    expect(bootstrapSettingsChange).toHaveBeenLastCalledWith({
      ...initialState.bootstrapSettings,
      clientDir: "/tmp/modified-client",
    });
    expect(screen.queryByText("Bootstrap Settings")).not.toBeInTheDocument();
  });
});

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

  it("ignores stale container isolation state for non-Linux architectures", () => {
    const errors = makeErrors();
    const formData = {
      ...baseFormData,
      setup: { ...baseFormData.setup, arch: Arch.Windows_64Bit },
      sshConfig: { execUser: "" },
      containerIsolation: {
        enabled: true,
        image: "",
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
