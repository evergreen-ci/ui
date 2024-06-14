import { projectAnnotations } from "@evg-ui/storybook-addon";
import {
  composeStories,
  Meta,
  setProjectAnnotations,
  StoryFn,
} from "@storybook/react";
// TODO: Replace with test_utils
import { act, render } from "@testing-library/react";
import { expect } from "vitest";
import path from "path";

setProjectAnnotations([projectAnnotations]);

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

/**
 * `compose` takes a story file and returns a composed story file with the annotations from the storybook preview file.
 * @param entry - The story file to compose
 * @returns - A composed story file
 */
const compose = (
  entry: StoryFile,
): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(
        entry,
      )}, ${e}`,
    );
  }
};

const getAllStoryFiles = () => {
  const storyFiles = Object.entries(
    // @ts-expect-error
    import.meta.glob<StoryFile>("./**/*.stories.tsx", {
      eager: true,
    }),
  );

  return storyFiles.map(([filePath, storyFile]) => {
    const storyDir = path.dirname(filePath);
    const componentName = path
      .basename(filePath)
      .replace(/\.(stories|story)\.[^/.]+$/, "");
    return { componentName, filePath, storyDir, storyFile };
  });
};

const options = {
  snapshotExtension: ".storyshot",
  snapshotsDirName: "__snapshots__",
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  suite: "Snapshot Tests",
};

describe(`${options.suite}`, () => {
  beforeAll(() => {
    // Reintroduce if required
    // stubGetClientRects();
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  getAllStoryFiles().forEach((params) => {
    const { filePath, storyFile } = <
      { filePath: string; storyFile: StoryFile }
    >params;
    const meta = storyFile.default;
    const { title } = meta;

    const storyBookFileBaseName = path
      .basename(filePath)
      .replace(/\.stories\.[^/.]+$/, "");

    // storyName is either the title of the story or the name of the file without the extension
    const storyName = title || storyBookFileBaseName;
    if (
      options.storyKindRegex.test(title || "") ||
      meta.parameters?.storyshots?.disable
    ) {
      // Skip component tests if they are disabled
      return;
    }

    describe(`${storyName}`, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(
          ({ name, story }) =>
            // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
            !options.storyNameRegex.test(name) &&
            !story.parameters.storyshots?.disable,
        );

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`,
        );
      }

      stories.forEach(({ name, story }) => {
        it(`${name}`, async () => {
          const { container } = render(story());
          await act(async () => {
            await new Promise((resolve) => {
              setTimeout(resolve, 0);
            });
          });
          const storyDirectory = path.dirname(filePath);
          const snapshotPath = path.join(
            storyDirectory,
            options.snapshotsDirName,
            `${storyBookFileBaseName}_${name}${options.snapshotExtension}`,
          );
          await expect(container).toMatchFileSnapshot(snapshotPath);
        });
      });
    });
  });
});
