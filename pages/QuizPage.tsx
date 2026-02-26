
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateQuiz } from '../services/geminiService';
import type { Question, Module } from '../types';
import { SkillLevel } from '../types';
import QuizComponent from '../components/QuizComponent';
import Spinner from '../components/Spinner';
import { useAppContext } from '../context/AppContext';

const QuizPage = () => {
  const { user, progress } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state?.module as Module;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizResult, setQuizResult] = useState<{ score: number; feedback: string; level: SkillLevel; passed: boolean } | null>(null);

  useEffect(() => {
    if (!module || !module.content) {
      navigate('/modules');
      return;
    }

    const extractLearningContent = (markdown: string): string => {
      const contentMatch = markdown.match(/### Learning Content\s*([\s\S]*?)(?=\s*### Related Research Papers|$)/);
      return contentMatch ? contentMatch[1].trim() : markdown;
    };

    const fetchQuiz = async () => {
      setIsLoading(true);
      setError('');
      try {
        const learningContent = extractLearningContent(module.content!);
        if (!learningContent) {
            throw new Error("No learning content found to generate a quiz from.");
        }
        const quizQuestions = await generateQuiz(learningContent, module.title, progress.topic, user);
        setQuestions(quizQuestions);
      } catch (err) {
        setError('Could not generate quiz. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, navigate]);

  const handleQuizComplete = (result: { score: number; feedback: string; level: SkillLevel; passed: boolean }) => {
    setQuizResult(result);
  };
  
  const handleRetakeQuiz = () => {
    setQuizResult(null); 
  };

  if (!module) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Quiz: {module.title}</h1>
      <p className="text-center text-gray-500 mb-8">Test your knowledge and earn points!</p>
      
      {isLoading && <div className="flex justify-center items-center h-64"><Spinner/> <span className="ml-4 text-lg">Generating your quiz...</span></div>}
      {error && <div className="text-center text-red-500 bg-red-50 p-4 rounded-md">{error}</div>}

      {!isLoading && !error && !quizResult && questions.length > 0 && (
        <QuizComponent 
            questions={questions} 
            moduleId={module.id} 
            moduleTitle={module.title}
            onQuizComplete={handleQuizComplete} 
        />
      )}

      {quizResult && (
        <div className={`bg-white p-8 rounded-xl shadow-lg text-center border-t-4 ${quizResult.passed ? 'border-blue-500' : 'border-red-500'}`}>
          {quizResult.passed ? (
            <>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Congratulations, Quiz Completed!</h2>
              <p className="text-5xl font-bold text-gray-800 mb-2">{quizResult.score / 10}<span className="text-2xl font-medium text-gray-500">/10</span></p>
              <p className="font-semibold text-lg text-gray-600 mb-4">Your Skill Level: <span className="text-blue-600">{quizResult.level}</span></p>
              <p className="text-gray-700 max-w-md mx-auto mb-6">{quizResult.feedback}</p>
              <div className="flex justify-center flex-wrap gap-4 mt-8">
                 <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Go to Home</button>
                 <button onClick={() => navigate('/modules')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Back to Modules</button>
                 <button onClick={() => navigate('/path')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">View Learning Path</button>
              </div>
            </>
          ) : (
             <>
              <h2 className="text-2xl font-bold text-red-700 mb-4">Module Uncompleted</h2>
              <p className="text-5xl font-bold text-gray-800 mb-2">{quizResult.score / 10}<span className="text-2xl font-medium text-gray-500">/10</span></p>
              <p className="font-semibold text-lg text-gray-600 mb-4">You need a score of 5 or higher to pass.</p>
              <p className="text-gray-700 max-w-md mx-auto mb-6">{quizResult.feedback}</p>
              <div className="flex justify-center flex-wrap gap-4 mt-8">
                 <button onClick={() => navigate('/modules')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Re-read Module</button>
                 <button onClick={handleRetakeQuiz} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">Try Quiz Again</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
