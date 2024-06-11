export default {
  addons: ["@evg-ui/storybook-addon"],
  stories: ["./README.mdx"],
  framework: {
    name: "@storybook/react-vite",
  },
  refs: {
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
