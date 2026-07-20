import { InlineDefinition } from "@leafygreen-ui/inline-definition";
import { Body } from "@leafygreen-ui/typography";
import { Field } from "@rjsf/core";
import {
  Requester,
  requesterToDescription,
  requesterToTitle,
} from "constants/requesters";

const RequesterTypeField: Field = ({ formData }: { formData: Requester }) =>
  requesterToDescription[formData] ? (
    <InlineDefinition definition={requesterToDescription[formData]}>
      {requesterToTitle[formData]}
    </InlineDefinition>
  ) : (
    <Body>{requesterToTitle[formData]}</Body>
  );

export default RequesterTypeField;
