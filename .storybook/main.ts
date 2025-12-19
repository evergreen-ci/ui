import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// This function was added automatically by Storybook's migration tool.
const getAbsolutePath = (value: string) => {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default {
  addons: [getAbsolutePath("@evg-ui/storybook-addon")],
  stories: ["./README.mdx"],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
  },
  refs: {
    fungi: {
      title: "Fungi Chat Library",
      url: "http://localhost:6009",
    },
    lib: {
      title: "Evergreen UI Library",
      url: "http://localhost:6008",
    },
    parsley: {
      title: "Parsley",
      url: "http://localhost:6007",
    },
    spruce: {
      title: "Spruce",
      url: "http://localhost:6006",
    },
  },
};

