export type DrillStatus = "new" | "confident" | "review" | "stumbled" | "unfamiliar";

export type DrillCard = {
  id: string;
  domain: string;
  type: "open-answer" | "mcq";
  prompt: string;
  status?: DrillStatus;
};
