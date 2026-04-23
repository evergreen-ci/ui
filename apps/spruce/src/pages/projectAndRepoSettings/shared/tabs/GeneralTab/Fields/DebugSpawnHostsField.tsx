import { useState } from "react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Description, Label } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import { size } from "@evg-ui/lib/constants/tokens";
import ElementWrapper from "components/SpruceForm/ElementWrapper";

export const DebugSpawnHostsField: Field = ({
  disabled,
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const [showModal, setShowModal] = useState(false);

  const description = uiSchema["ui:description"];
  const { title } = schema;

  const enumOptions = (
    schema.oneOf as Array<{ title: string; enum: Array<boolean | null> }>
  ).map((option) => ({
    label: option.title,
    value: option.enum[0],
  }));

  const valueMap = enumOptions.map(({ value }) => value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = valueMap[Number(e.target.value)];
    if (formData === false && newValue === true) {
      setShowModal(true);
    } else {
      onChange(newValue);
    }
  };

  return (
    <>
      <ElementWrapper>
        <LabelContainer>
          <Label disabled={disabled} htmlFor="debug-spawn-hosts-radio-box">
            {title}
          </Label>
          {description && <Description>{description}</Description>}
        </LabelContainer>
        <RadioBoxGroup
          id="debug-spawn-hosts-radio-box"
          name={title}
          onChange={handleChange}
          value={valueMap.indexOf(formData)}
        >
          {enumOptions.map((o) => (
            <StyledRadioBox
              key={valueMap.indexOf(o.value)}
              disabled={disabled}
              value={valueMap.indexOf(o.value)}
            >
              {o.label}
            </StyledRadioBox>
          ))}
        </RadioBoxGroup>
      </ElementWrapper>
      <ConfirmationModal
        cancelButtonProps={{ onClick: () => setShowModal(false) }}
        confirmButtonProps={{
          children: "Disable",
          onClick: () => {
            onChange(true);
            setShowModal(false);
          },
        }}
        data-cy="disable-debug-spawn-hosts-modal"
        open={showModal}
        title="Disable Debug Spawn Hosts?"
        variant="danger"
      >
        Are you sure you want to disable debug spawn hosts? Any existing debug
        spawn hosts will be terminated.
      </ConfirmationModal>
    </>
  );
};

const LabelContainer = styled.div`
  margin-bottom: ${size.xs};
`;

const StyledRadioBox = styled(RadioBox)`
  line-height: 1.25;
`;
