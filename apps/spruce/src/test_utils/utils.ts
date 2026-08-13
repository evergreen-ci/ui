import { screen, userEvent } from "@evg-ui/lib/test_utils";

/**
 * `selectLGOption` selects an option from a LG select component
 * @param dataTestId - data-testid selector of the LG select component
 * @param option - text contents of the option to select
 */
const selectLGOption = async (dataTestId: string, option: string) => {
  const user = userEvent.setup();
  expect(screen.queryByTestId(dataTestId)).not.toBeDisabled();
  await user.click(screen.getByTestId(dataTestId));
  const selectOption = await screen.findByText(option);
  await user.click(selectOption);
  expect(screen.queryByTestId(dataTestId)).toHaveTextContent(option);
};

export { selectLGOption };
