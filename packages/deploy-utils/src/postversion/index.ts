import { push, pushTags } from "../utils/git";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const countdownTimer = async (seconds: number) => {
  for (let i = seconds - 1; i >= 0; i--) {
    process.stdout.write(
      `Waiting ${i}s for Evergreen to pick up the version\r`,
    );
    await sleep(1000); // eslint-disable-line no-await-in-loop
  }
};

export const postversion = async () => {
  push();
  await countdownTimer(10);
  pushTags();
};
