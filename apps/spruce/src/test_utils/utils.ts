import { screen, userEvent } from ".";

const mockEnvironmentVariables = () => {
  // @ts-expect-error: FIXME. This comment was added by an automated script.
  const restoreCalls = [];
  const mockEnv = (variable: string, value: string) => {
    const before = process.env[variable];
    process.env[variable] = value;

    const restore = () => {
      process.env[variable] = before;
    };
    restoreCalls.push(restore);
  };
  const cleanup = () => {
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    restoreCalls.forEach((restore) => {
      restore();
    });
  };

  return { mockEnv, cleanup };
};

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

export { mockEnvironmentVariables, selectLGOption };
