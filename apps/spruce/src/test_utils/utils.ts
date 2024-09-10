import { screen, userEvent } from "@evg-ui/lib/test_utils";

const selectLGOption = async (dataCy: string, option: string) => {
  const user = userEvent.setup();
  expect(screen.queryByDataCy(dataCy)).not.toBeDisabled();
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  await user.click(screen.queryByDataCy(dataCy));
  await screen.findByText(option);
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  await user.click(screen.queryByText(option));
  expect(screen.queryByDataCy(dataCy)).toHaveTextContent(option);
};

export { selectLGOption };
