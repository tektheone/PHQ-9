import { Test, TestingModule } from '@nestjs/testing';
import { ScreenerService } from './screener.service';

describe('ScreenerService', () => {
  let service: ScreenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenerService],
    }).compile();

    service = module.get<ScreenerService>(ScreenerService);
  });

  it('should evaluate screener answers correctly', () => {
    const answers = [
      { value: 1, question_id: 'question_a' },
      { value: 0, question_id: 'question_b' },
      { value: 2, question_id: 'question_c' },
      { value: 3, question_id: 'question_d' },
      { value: 1, question_id: 'question_e' },
      { value: 0, question_id: 'question_f' },
      { value: 1, question_id: 'question_g' },
      { value: 0, question_id: 'question_h' },
    ];

    const result = service.evaluateScreener(answers);
    expect(result.results).toContain('ASRM');
    expect(result.results).not.toContain('PHQ-9');
    expect(result.results).not.toContain('ASSIST');
  });
});
