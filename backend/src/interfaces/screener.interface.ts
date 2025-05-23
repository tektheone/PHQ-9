export interface Answer {
  value: number;
  question_id: string;
}

export interface ScreenerResponse {
  answers: Answer[];
}

export interface DomainMapping {
  question_id: string;
  domain: string;
}

export interface AssessmentResult {
  results: string[];
}

export interface Question {
  question_id: string;
  title: string;
}

export interface AnswerOption {
  title: string;
  value: number;
}

export interface Section {
  type: string;
  title: string;
  answers: AnswerOption[];
  questions: Question[];
}

export interface ScreenerContent {
  sections: Section[];
  display_name: string;
}

export interface Screener {
  id: string;
  name: string;
  disorder: string;
  content: ScreenerContent;
  full_name: string;
}
