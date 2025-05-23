import { Answer, Screener, AssessmentResult } from '../interfaces/screener';

const API_BASE_URL = '/api';

export const screenerService = {
  async getScreener(): Promise<Screener> {
    const response = await fetch(`${API_BASE_URL}/screener`);
    if (!response.ok) {
      throw new Error('Failed to fetch screener');
    }
    return response.json();
  },

  async submitScreener(answers: Answer[]): Promise<AssessmentResult> {
    const response = await fetch(`${API_BASE_URL}/screener/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit screener');
    }

    return response.json();
  },
};
