import { gql } from "@apollo/client";
import { FILE_DIFFS } from "./fileDiffs";

export const MODULE_CODE_CHANGE = gql`
  fragment ModuleCodeChange on ModuleCodeChange {
    branchName
    fileDiffs {
      ...FileDiffs
    }
    rawLink
  }
  ${FILE_DIFFS}
`;
