import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  SingleTaskDistroQuery,
  SingleTaskDistroQueryVariables,
} from "gql/generated/types";
import { SINGLE_TASK_DISTRO } from "gql/queries";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { gqlToForm } from "./transformers";

const formSchema = getFormSchema();

export const SingleTaskDistroTab: React.FC = () => {
  const { data } = useQuery<
    SingleTaskDistroQuery,
    SingleTaskDistroQueryVariables
  >(SINGLE_TASK_DISTRO);
  const initialFormState = useMemo(() => gqlToForm(data), [data]);

  return (
    <BaseTab formSchema={formSchema} initialFormState={initialFormState} />
  );
};
