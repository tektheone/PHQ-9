import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Answer, Question, AnswerOption, AssessmentResult } from '../interfaces/screener';
import { screenerService } from '../services/screenerService';

export default function Screener() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const { data: screener, isLoading, error } = useQuery({
    queryKey: ['screener'],
    queryFn: screenerService.getScreener,
  });

  const submitMutation = useMutation({
    mutationFn: screenerService.submitScreener,
    onSuccess: (data) => setResult(data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading screener</div>;
  if (!screener) return null;

  const questions = screener.content.sections[0].questions;
  const answerOptions = screener.content.sections[0].answers;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: AnswerOption) => {
    const newAnswer: Answer = {
      question_id: currentQuestion.question_id,
      value: answer.value,
    };

    setAnswers([...answers, newAnswer]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitMutation.mutate(answers);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Assessment Complete</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl mb-4">Recommended Assessments:</h3>
          <ul className="list-disc pl-5">
            {result.results.map((assessment) => (
              <li key={assessment} className="mb-2">{assessment}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{screener.content.display_name}</span>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">
          {screener.content.sections[0].title}
        </h2>
        <div className="mb-8">
          <p className="text-lg mb-4">{currentQuestion.title}</p>
          <div className="space-y-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded border hover:bg-gray-50 transition-colors"
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
