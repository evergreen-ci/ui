import { gql } from "@apollo/client";
import { MODULE_CODE_CHANGE } from "../fragments/moduleCodeChanges";

export const CODE_CHANGES = gql`
  query CodeChanges($id: String!) {
    patch(patchId: $id) {
      id
      moduleCodeChanges {
        ...ModuleCodeChange
      }
    }
  }
  ${MODULE_CODE_CHANGE}
`;
