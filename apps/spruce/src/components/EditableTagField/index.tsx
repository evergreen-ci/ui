import { useState } from "react";
import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { InstanceTag, ParameterInput } from "gql/generated/types";
import { array } from "utils";
import { TagRow } from "./TagRow";

const { convertArrayToObject } = array;

type Tag = InstanceTag | ParameterInput;
type EditableTagFieldProps = {
  onChange: (data: Tag[]) => void;
  inputTags: Tag[];
  visible?: boolean;
  buttonText: string;
  id?: string;
};

export const EditableTagField: React.FC<EditableTagFieldProps> = ({
  buttonText,
  id,
  inputTags,
  onChange,
}) => {
  const [visibleTags, setVisibleTags] = useState(inputTags);
  // Convert this tag array to an object it makes searching through them faster if there are allot of tags
  const visibleTagsAsObject = convertArrayToObject(visibleTags, "key");

  const deleteHandler = (key: string) => {
    const tags = { ...visibleTagsAsObject };
    delete tags[key];
    const tagsBackToArray = Object.values(tags);
    setVisibleTags(tagsBackToArray);
    onChange(tagsBackToArray);
  };

  // tag is the value to replace
  const updateTagHandler = (tag: Tag, deleteKey: string) => {
    const tags = { ...visibleTagsAsObject };
    if (deleteKey) {
      tags[deleteKey] = tag;
    } else {
      tags[tag.key] = tag;
    }
    const tagsBackToArray = Object.values(tags);
    setVisibleTags(tagsBackToArray);
    onChange(tagsBackToArray);
  };

  const validateKey = (key: string) => {
    if (visibleTagsAsObject[key]) {
      return false;
    }
    return true;
  };

  return (
    <FlexColumnContainer id={id}>
      {visibleTags.map((tag) => (
        <TagRow
          key={tag.key}
          buttonText={buttonText}
          isValidKey={validateKey}
          onDelete={deleteHandler}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          onUpdateTag={updateTagHandler}
          tag={tag}
        />
      ))}
      <TagRow
        buttonText={buttonText}
        isNewTag
        isValidKey={validateKey}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        onUpdateTag={updateTagHandler}
      />
    </FlexColumnContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${size.xs};
  max-width: 100%;
`;
