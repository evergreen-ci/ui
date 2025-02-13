import { SectionData } from "./utils";
import { SectionState } from ".";

const step = "1 of 4";
const sectionData: SectionData = {
  commands: [
    {
      commandID: "command-1",
      commandName: "c1",
      functionID: "function-1",
      isTopLevelCommand: false,
      range: {
        end: 6,
        start: 1,
      },
      step,
    },
    {
      commandID: "command-6",
      commandName: "c2",
      functionID: "function-1",
      isTopLevelCommand: false,
      range: {
        end: 8,
        start: 6,
      },
      step,
    },
    {
      commandID: "command-9",
      commandName: "c3",
      functionID: "function-9",
      isTopLevelCommand: false,
      range: {
        end: 12,
        start: 9,
      },
      step,
    },
    {
      commandID: "command-12",
      commandName: "c4",
      functionID: "function-9",
      isTopLevelCommand: false,
      range: {
        end: 14,
        start: 12,
      },
      step,
    },
  ],
  functions: [
    {
      containsTopLevelCommand: false,
      functionID: "function-1",
      functionName: "f-1",
      range: {
        end: 8,
        start: 1,
      },
    },
    {
      containsTopLevelCommand: false,
      functionID: "function-9",
      functionName: "f-2",
      range: {
        end: 14,
        start: 9,
      },
    },
  ],
};
const sectionStateAllClosed: SectionState = {
  "function-1": {
    commands: {
      "command-1": {
        isOpen: false,
      },
      "command-6": {
        isOpen: false,
      },
    },
    isOpen: false,
  },
  "function-9": {
    commands: {
      "command-9": {
        isOpen: false,
      },
      "command-12": {
        isOpen: false,
      },
    },
    isOpen: false,
  },
};

const sectionStateAllOpen: SectionState = {
  "function-1": {
    commands: {
      "command-1": {
        isOpen: true,
      },
      "command-6": {
        isOpen: true,
      },
    },
    isOpen: true,
  },
  "function-9": {
    commands: {
      "command-9": {
        isOpen: true,
      },
      "command-12": {
        isOpen: true,
      },
    },
    isOpen: true,
  },
};

const sectionStateSomeOpen: SectionState = {
  "function-1": {
    commands: {
      "command-1": {
        isOpen: false,
      },
      "command-6": {
        isOpen: true,
      },
    },
    isOpen: true,
  },
  "function-9": {
    commands: {
      "command-9": {
        isOpen: false,
      },
      "command-12": {
        isOpen: false,
      },
    },
    isOpen: false,
  },
};

export {
  sectionData,
  sectionStateAllClosed,
  sectionStateAllOpen,
  sectionStateSomeOpen,
};
