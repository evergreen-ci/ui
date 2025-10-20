import { replaceInFileSync } from "replace-in-file";

export type InjectVariablesInHTMLConfig = {
  files: string | string[];
  variables: string[];
};

/**
 * `injectVariablesInHTML` is a Vite plugin that replaces variables in HTML files with environment variables.
 * @param options - Configuration options for the plugin.
 * @returns A Vite plugin that replaces variables in HTML files with environment variables.
 */
export default function injectVariablesInHTML(
  options: InjectVariablesInHTMLConfig,
) {
  // Prepare regexes and replacement values
  const from = options.variables.map((v) => new RegExp(v, "g"));
  const to = options.variables.map(
    (v) => process.env[v.replace(/%/g, "")] || "",
  );

  return {
    name: "injectVariablesInHTML",
    // This hook runs in dev mode when serving the HTML
    transformIndexHtml(html: string) {
      let updatedHtml = html;
      from.forEach((regex, i) => {
        updatedHtml = updatedHtml.replace(regex, to[i]);
      });
      return updatedHtml;
    },
    // This hook runs during the build, after the bundle has been written
    writeBundle: async () => {
      try {
        replaceInFileSync({
          files: options.files,
          from,
          to,
        });
      } catch (error) {
        console.error("Error occurred while injecting variables:", error);
      }
    },
  };
}
