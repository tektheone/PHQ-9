import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { Radio } from './Radio';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Answer, Question, AnswerOption, AssessmentResult } from '../interfaces/screener';
import { screenerService } from '../services/screenerService';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40 animate-pulse">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="relative pt-1">
    <div className="flex mb-2 items-center justify-between">
      <div>
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
          Progress
        </span>
      </div>
      <div className="text-right">
        <span className="text-xs font-semibold inline-block text-blue-600">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
      <div
        style={{ width: `${progress}%` }}
        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-in-out"
      ></div>
    </div>
  </div>
);

export default function Screener() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isRestarting, setIsRestarting] = useState(false);

  const { data: screener, isLoading, error } = useQuery({
    queryKey: ['screener'],
    queryFn: () => screenerService.getScreener()
  });

  const { data: result, mutate, reset: resetMutation } = useMutation({
    mutationFn: (answers: Answer[]) => screenerService.submitScreener(answers),
    onSuccess: (data: AssessmentResult) => {
      console.log('Assessment completed:', data);
    }
  });

  if (isLoading || isRestarting) return <LoadingSpinner />;
  if (error) return <div>Error loading screener</div>;
  if (!screener) return null;

  const questions = screener.content.sections[0].questions;
  const answerOptions = screener.content.sections[0].answers;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const resetScreener = () => {
    // Reset all states
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsRestarting(true);
    // Reset the mutation state
    resetMutation();
    // Add a slight delay to show transition
    setTimeout(() => setIsRestarting(false), 300);
  };

  const handleAnswer = (answer: AnswerOption) => {
    if (!screener) return;
    const newAnswer: Answer = {
      question_id: currentQuestion.question_id,
      value: answer.value,
    };

    // Update or add the answer for current question
    const existingAnswerIndex = answers.findIndex(a => a.question_id === currentQuestion.question_id);
    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
      setAnswers(updatedAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      mutate(answers);
    }
  };

  const currentAnswer = answers.find(a => a.question_id === currentQuestion?.question_id);
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-slideIn">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Assessment Complete</h2>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Recommended Assessments</h3>
          </div>
          <div className="space-y-4">
            {result.results.map((assessment, index) => (
              <a
                key={assessment}
                href="https://www.blueprint.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="secondary"
                  fullWidth
                  className="p-4 bg-blue-50 border-blue-100 hover:bg-blue-100 animate-scaleIn"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{assessment}</h4>
                      <p className="text-sm text-gray-500">Click to begin assessment</p>
                    </div>
                  </div>
                </Button>
              </a>
            ))}
          </div>
          <div className="mt-12 border-t pt-8">
            <Button
              variant="primary"
              onClick={resetScreener}
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 animate-bounce-in"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Start New Screening</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-800">{screener.content.display_name}</h1>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {screener.content.sections[0].title}
        </h2>
        <div className="mb-8">
          <p className="text-lg mb-6 text-gray-700">{currentQuestion.title}</p>
          <div className="grid gap-3">
            {answerOptions.map((option: AnswerOption, index: number) => (
              <div
                key={option.value}
                className="animate-scaleIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Radio
                  label={option.title}
                  checked={currentAnswer?.value === option.value}
                  onChange={() => handleAnswer(option)}
                  className="w-full p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 
                           transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                />
              </div>
            ))}
            <div className="mt-8 flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`px-6 py-2 ${isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </div>
              </Button>
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!currentAnswer}
                className={`px-6 py-2 ${!currentAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <span>{isLastQuestion ? 'Submit' : 'Next'}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
