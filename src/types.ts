export enum Category {
  INTRO = "INTRO",
  HISTORY = "HISTORY",
  IMPACT = "IMPACT",
  THEORY = "THEORY",
  FUTURE = "FUTURE",
}

export interface PageData {
  id: number;
  category: Category;
  title: string;
  description: string;
  details?: string;
  bgColor: string;
  isTransition?: boolean;
}
