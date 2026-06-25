export type StepNumber = 1 | 2 | 3 | 4;

export interface QuizAnswers {
  step1: string;
  step2: string;
  step3: string;
}

export interface LeadSubmission {
  name: string;
  clinicName: string;
  email: string;
  phone: string;
  niche?: string;
  preferredContact?: string;
  answers: QuizAnswers;
  offerType: 'launch' | 'audit';
  submittedAt: string;
}
