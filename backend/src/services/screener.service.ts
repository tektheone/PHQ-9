import { Injectable } from '@nestjs/common';
import { Answer, AssessmentResult, DomainMapping } from '../interfaces/screener.interface';

@Injectable()
export class ScreenerService {
  private readonly domainMappings: DomainMapping[] = [
    { question_id: 'question_a', domain: 'depression' },
    { question_id: 'question_b', domain: 'depression' },
    { question_id: 'question_c', domain: 'mania' },
    { question_id: 'question_d', domain: 'mania' },
    { question_id: 'question_e', domain: 'anxiety' },
    { question_id: 'question_f', domain: 'anxiety' },
    { question_id: 'question_g', domain: 'anxiety' },
    { question_id: 'question_h', domain: 'substance_use' },
  ];

  private readonly assessmentThresholds = {
    depression: { threshold: 2, assessment: 'PHQ-9' },
    mania: { threshold: 2, assessment: 'ASRM' },
    anxiety: { threshold: 2, assessment: 'PHQ-9' },
    substance_use: { threshold: 1, assessment: 'ASSIST' },
  };

  evaluateScreener(answers: Answer[]): AssessmentResult {
    const domainScores = this.calculateDomainScores(answers);
    const recommendedAssessments = this.determineAssessments(domainScores);
    return { results: recommendedAssessments };
  }

  private calculateDomainScores(answers: Answer[]): Map<string, number> {
    const domainScores = new Map<string, number>();

    answers.forEach(answer => {
      const mapping = this.domainMappings.find(m => m.question_id === answer.question_id);
      if (mapping) {
        const currentScore = domainScores.get(mapping.domain) || 0;
        domainScores.set(mapping.domain, currentScore + answer.value);
      }
    });

    return domainScores;
  }

  private determineAssessments(domainScores: Map<string, number>): string[] {
    const recommendations = new Set<string>();

    for (const [domain, score] of domainScores.entries()) {
      const threshold = this.assessmentThresholds[domain];
      if (threshold && score >= threshold.threshold) {
        recommendations.add(threshold.assessment);
      }
    }

    return Array.from(recommendations);
  }

  getScreener() {
    return {
      id: 'abcd-123',
      name: 'BPDS',
      disorder: 'Cross-Cutting',
      content: {
        sections: [
          {
            type: 'standard',
            title: 'During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?',
            answers: [
              { title: 'Not at all', value: 0 },
              { title: 'Rare, less than a day or two', value: 1 },
              { title: 'Several days', value: 2 },
              { title: 'More than half the days', value: 3 },
              { title: 'Nearly every day', value: 4 },
            ],
            questions: [
              { question_id: 'question_a', title: 'Little interest or pleasure in doing things?' },
              { question_id: 'question_b', title: 'Feeling down, depressed, or hopeless?' },
              { question_id: 'question_c', title: 'Sleeping less than usual, but still have a lot of energy?' },
              { question_id: 'question_d', title: 'Starting lots more projects than usual or doing more risky things than usual?' },
              { question_id: 'question_e', title: 'Feeling nervous, anxious, frightened, worried, or on edge?' },
              { question_id: 'question_f', title: 'Feeling panic or being frightened?' },
              { question_id: 'question_g', title: 'Avoiding situations that make you feel anxious?' },
              { question_id: 'question_h', title: 'Drinking at least 4 drinks of any kind of alcohol in a single day?' },
            ],
          },
        ],
        display_name: 'BDS',
      },
      full_name: 'Blueprint Diagnostic Screener',
    };
  }
}
