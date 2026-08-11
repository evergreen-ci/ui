import { screen, userEvent } from "@evg-ui/lib/test_utils";

/**
 * `selectLGOption` selects an option from a LG select component
 * @param dataCy - data-cy selector of the LG select component
 * @param option - text contents of the option to select
 */
const selectLGOption = async (dataCy: string, option: string) => {
  const user = userEvent.setup();
  expect(screen.queryByTestId(dataCy)).not.toBeDisabled();
  await user.click(screen.getByTestId(dataCy));
  const selectOption = await screen.findByText(option);
  await user.click(selectOption);
  expect(screen.queryByTestId(dataCy)).toHaveTextContent(option);
};

export { selectLGOption };
