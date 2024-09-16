import { screen, userEvent } from "@evg-ui/lib/test_utils";

/**
 * `selectLGOption` selects an option from a LG select component
 * @param dataCy - data-cy selector of the LG select component
 * @param option - text contents of the option to select
 */
const selectLGOption = async (dataCy: string, option: string) => {
  const user = userEvent.setup();
  expect(screen.queryByDataCy(dataCy)).not.toBeDisabled();
  await user.click(screen.getByDataCy(dataCy));
  const selectOption = await screen.findByText(option);
  await user.click(selectOption);
  expect(screen.queryByDataCy(dataCy)).toHaveTextContent(option);
};

export { selectLGOption };
