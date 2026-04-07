import { gql } from "@apollo/client";
import { BASE_SPAWN_HOST } from "../fragments/baseSpawnHost";

const MY_HOSTS = gql`
  query MyHosts {
    myHosts {
      ...BaseSpawnHost
      sleepSchedule {
        dailyStartTime
        dailyStopTime
        nextStartTime
        permanentlyExempt
        shouldKeepOff
        temporarilyExemptUntil
        timeZone
        wholeWeekdaysOff
      }
    }
  }
  ${BASE_SPAWN_HOST}
`;

export default MY_HOSTS;
