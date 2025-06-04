declare global {
  var api: PromptAPI
}

export interface PromptAPI {
  promptComplete: (value: string, button: string) => Promise<void>;
}
