import { validators } from "utils";

const {
  validateDuration,
  validateEmail,
  validateJira,
  validateJiraURL,
  validateNoSpecialCharacters,
  validateNoStartingOrTrailingWhitespace,
  validatePercentage,
  validateRegexp,
  validateSlack,
  validateSSHPublicKey,
  validateURL,
  validateURLTemplate,
} = validators;

export const customFormats = (jiraHost: string) => ({
  // Permit empty string but disallow whitespace
  noSpaces: /^$|^\S+$/,
  noSpecialCharacters: validateNoSpecialCharacters,
  noStartingOrTrailingWhitespace: validateNoStartingOrTrailingWhitespace,
  validDuration: validateDuration,
  validEmail: validateEmail,
  validJiraTicket: validateJira,
  validJiraURL: (url: string) => validateJiraURL(jiraHost, url),
  validPercentage: validatePercentage,
  validRegex: validateRegexp,
  validSlack: validateSlack,
  validSSHPublicKey: validateSSHPublicKey,
  validURL: validateURL,
  validURLTemplate: validateURLTemplate,
});
