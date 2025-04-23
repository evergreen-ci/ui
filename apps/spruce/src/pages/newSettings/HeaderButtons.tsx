import React, { useCallback } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { WritableProjectSettingsType } from "pages/projectSettings/tabs/types";
import { useHasUnsavedTab, useNewSettingsContext } from "./Context";

interface Props {
  id?: string;
  tab: WritableProjectSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ tab }) => {
  const dispatchToast = useToastContext();
  const { saveTab } = useNewSettingsContext();
  const { hasUnsaved } = useHasUnsavedTab();

  const handleSave = useCallback(async () => {
    try {
      await saveTab(tab);
      dispatchToast.success("Successfully saved settings.");
    } catch (e) {
      dispatchToast.error(`Error saving settings: ${e}`);
    }
  }, [dispatchToast, saveTab, tab]);

  return (
    <ButtonRow data-cy="header-buttons">
      {hasUnsaved && (
        <Button data-cy="save-button" onClick={handleSave} variant="primary">
          Save changes on page
        </Button>
      )}
    </ButtonRow>
  );
};

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  min-width: fit-content;
`;
