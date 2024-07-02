import { useQueryParams } from "hooks/useQueryParam";
import { deduplicatedAppend, toArray } from "utils/array";

const useUpsertQueryParams = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const onSubmit = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    const selectedParams = toArray(queryParams[category]).map((param) =>
      param.toString(),
    );
    const updatedParams = deduplicatedAppend(value, selectedParams);
    setQueryParams({ ...queryParams, [category]: updatedParams });
  };

  return onSubmit;
};
export { useUpsertQueryParams };
