import { useState } from "react";
import styled from "@emotion/styled";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { ConfirmationModal } from "components/ConfirmationModal";
import { getNextHostStart } from "components/Spawn/utils";
import { size } from "constants/tokens";
import { SleepSchedule } from "gql/generated/types";

const todayDate = new Date();

export const PauseSleepScheduleModal: React.FC<{
  handleConfirm: (shouldKeepOff?: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  sleepSchedule: SleepSchedule;
}> = ({ handleConfirm, open, setOpen, sleepSchedule }) => {
  const [shouldKeepOff, setShouldKeepOff] = useState(false);

  const { nextStartDay, nextStartTime } = getNextHostStart(
    sleepSchedule,
    todayDate,
  );
  return (
    <ConfirmationModal
      buttonText={`Pause host ${shouldKeepOff ? "indefinitely" : `until ${nextStartDay}`}`}
      data-cy="pause-sleep-schedule-modal"
      open={open}
      onCancel={() => setOpen(false)}
      onConfirm={() => {
        handleConfirm(shouldKeepOff);
        setOpen(false);
      }}
      setOpen={setOpen}
      title="Configure Host Pause"
    >
      <P>
        Since this host has a sleep schedule configured, by default it will wake
        up at the next scheduled start time. If you won&rsquo;t need it then,
        you can pause indefinitely and manually restart it at a later date.
      </P>

      {/* LG's radio group does not support boolean values, so cast the state to a string for use by the component */}
      <RadioGroup
        onChange={(e) => setShouldKeepOff(e.target.value === "true")}
        value={`${shouldKeepOff}`}
      >
        <Radio value="false">
          Start host at its next scheduled time&nbsp;
          <span data-cy="next-start">
            ({nextStartDay}
            {nextStartTime && ` at ${nextStartTime}`})
          </span>
        </Radio>
        <Radio value="true">Pause host indefinitely</Radio>
      </RadioGroup>
    </ConfirmationModal>
  );
};

const P = styled.p`
  margin-bottom: ${size.s};
`;
