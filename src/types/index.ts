// src/types/index.ts
export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface Answer {
  questionId: number;
  selectedOption: string;
}

export interface Result {
  score: number;
  feedback: string;
}
