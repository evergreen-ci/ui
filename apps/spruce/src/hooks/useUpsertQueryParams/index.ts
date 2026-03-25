import { useQueryParams } from "@evg-ui/lib/hooks";
import { url } from "utils";

const { upsertQueryParam } = url;

const useUpsertQueryParams = () => {
  const [queryParams, setQueryParams] = useQueryParams();

  const onSubmit = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    const selectedParams = queryParams[category] as string[] | undefined;
    const updatedParams = upsertQueryParam(selectedParams ?? [], value);
    setQueryParams((current) => ({ ...current, [category]: updatedParams }));
  };

  return onSubmit;
};
export { useUpsertQueryParams };
