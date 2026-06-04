export type AgentProfile = {
  name: string;
  instructions: string;
};

export type AgentRunRequest = {
  agent: AgentProfile;
  input: unknown;
};
