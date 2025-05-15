export type AiChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  links?: {
    title: string;
    url: string;
  }[];
};
