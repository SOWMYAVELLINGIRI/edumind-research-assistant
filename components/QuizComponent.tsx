
import React, { useState } from 'react';
import type { Question } from '../types';
import { useAppContext } from '../context/AppContext';
import { SkillLevel } from '../types';

interface QuizComponentProps {
  questions: Question[];
  moduleId: string;
  moduleTitle: string;
  onQuizComplete: (result: { score: number; feedback: string; level: SkillLevel; passed: boolean }) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, moduleId, moduleTitle, onQuizComplete }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const { updateScore } = useAppContext();

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += 10; // 10 points per correct answer
      }
    });

    const passed = score >= 50; // Pass if score is 5/10 or higher
    const percentage = (score / (questions.length * 10)) * 100;
    let feedback = '';
    let level = SkillLevel.BEGINNER;

    if (passed) {
        if (percentage >= 80) {
            feedback = "Excellent work! You have a strong grasp of the material. Keep pushing the boundaries of your knowledge!";
            level = SkillLevel.ADVANCED;
        } else {
            feedback = "Great job passing the quiz! You have a solid understanding. Reviewing the key concepts will help solidify your knowledge.";
            level = SkillLevel.INTERMEDIATE;
        }
    } else {
        feedback = "It looks like this was a tough one. Don't worry, great minds need time to absorb complex topics! Please review the module content and try the quiz again. You've got this!";
        level = SkillLevel.BEGINNER;
    }
    
    updateScore(moduleId, moduleTitle, score, passed);
    onQuizComplete({ score, feedback, level, passed });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((q, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="font-semibold text-lg text-gray-800 mb-4">{index + 1}. {q.question}</p>
          <div className="space-y-3">
            {q.options.map((option, optIndex) => (
              <label
                key={optIndex}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  answers[index] === option
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleAnswerSelect(index, option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center">
        <button
          type="submit"
          disabled={Object.keys(answers).length !== questions.length}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answers
        </button>
      </div>
    </form>
  );
};

export default QuizComponent;