import { useState } from "react";
import styled from "@emotion/styled";
import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { size } from "@evg-ui/lib/constants";
import { getNextHostStart } from "components/Spawn/utils";
import { SleepSchedule } from "gql/generated/types";

export const PauseSleepScheduleModal: React.FC<{
  handleConfirm: (shouldKeepOff?: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  sleepSchedule: SleepSchedule;
}> = ({ handleConfirm, open, setOpen, sleepSchedule }) => {
  const [shouldKeepOff, setShouldKeepOff] = useState(false);

  const { nextStartDay, nextStartTime } = getNextHostStart(
    sleepSchedule.dailyStartTime,
    // This "date" is really a string (DEVPROD-1028)
    sleepSchedule.nextStartTime as unknown as string,
  );

  let pauseButtonText = "Pause host";
  if (shouldKeepOff) {
    pauseButtonText += " indefinitely";
  } else if (nextStartDay) {
    pauseButtonText += ` until ${nextStartDay}`;
  }

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: () => setOpen(false),
      }}
      confirmButtonProps={{
        children: pauseButtonText,
        onClick: () => {
          handleConfirm(shouldKeepOff);
          setOpen(false);
        },
      }}
      data-cy="pause-sleep-schedule-modal"
      open={open}
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
