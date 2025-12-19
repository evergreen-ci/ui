import { composeStories, setProjectAnnotations } from "@storybook/react-vite";
import { expect } from "vitest";
import path from "path";
import { act, render, stubGetClientRects } from "@evg-ui/lib/test_utils";
import snapshotSerializer from "@evg-ui/lib/test_utils/snapshotSerializer";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import * as addonAnnotations from "@evg-ui/storybook-addon/src/preview";
import * as sprucePreview from "../.storybook/preview";

expect.addSnapshotSerializer(snapshotSerializer);
setProjectAnnotations([addonAnnotations, sprucePreview]);

type StoryFile = {
  default: CustomMeta<unknown>;
  [name: string]: CustomStoryObj<unknown> | CustomMeta<unknown>;
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
    stubGetClientRects();
  });

  beforeEach(() => {
    const mockIntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    vi.stubGlobal("IntersectionObserver", mockIntersectionObserver);

    const mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    vi.stubGlobal("ResizeObserver", mockResizeObserver);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  getAllStoryFiles().forEach((params) => {
    const { filePath, storyFile } = params;
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
