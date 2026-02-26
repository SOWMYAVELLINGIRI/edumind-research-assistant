
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleCard from '../components/ModuleCard';
import type { Module } from '../types';
import { generateModuleContent } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { useAppContext } from '../context/AppContext';
import { logEvent } from '../services/trackingService';

const ModulesPage = () => {
  const { user, progress, modules: contextModules, papers, isSearching } = useAppContext();
  const [modulesWithContent, setModulesWithContent] = useState<Module[]>(contextModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setModulesWithContent(contextModules);
  }, [contextModules]);

  const handleModuleSelect = async (module: Module) => {
    setSelectedModule(module);
    setFeedbackGiven(false);

    if (user) {
        logEvent({
            eventType: 'USER_INTERACTION',
            userId: user.email,
            interactionType: 'view_module_content',
            topic: progress.topic,
            moduleTitle: module.title
        });
    }

    if (!module.content) {
      setIsLoadingContent(true);
      setError('');
      try {
        const content = await generateModuleContent(module.title, progress.topic, papers, user);
        const updatedModules = modulesWithContent.map(m =>
          m.id === module.id ? { ...m, content } : m
        );
        setModulesWithContent(updatedModules);
        setSelectedModule(prev => prev ? { ...prev, content } : null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoadingContent(false);
      }
    }
  };
  
  const handleFeedback = (value: 'helpful' | 'unhelpful') => {
      if (!user || !selectedModule) return;
      logEvent({
          eventType: 'USER_INTERACTION',
          userId: user.email,
          interactionType: 'give_feedback',
          hallucinationRate: value === 'helpful' ? 0 : 1,
          topic: progress.topic,
          moduleTitle: selectedModule.title
      });
      setFeedbackGiven(true);
  }

  const startQuiz = () => {
    if(selectedModule && user) {
        logEvent({
            eventType: 'USER_INTERACTION',
            userId: user.email,
            interactionType: 'start_quiz',
            topic: progress.topic,
            quizId: selectedModule.id,
            moduleTitle: selectedModule.title
        });
        navigate('/quiz', { state: { module: selectedModule } });
    }
  }

  const parseMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h3>')
      .replace(/\* (.*)/g, '<li class="ml-5 list-disc text-gray-700 mb-1">$1</li>')
      .replace(/(?:\r\n|\r|\n){2,}/g, '<br/><br/>'); // Preserve paragraphs
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Learning Modules for "{progress.topic}"</h1>
      
      {isSearching && contextModules.length === 0 ? (
        <div className="text-center text-gray-500">Generating modules for your topic...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulesWithContent.map(module => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onSelect={handleModuleSelect} 
              isCompleted={progress.completedModules.includes(module.id)}
            />
          ))}
        </div>
      )}

      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-800">{selectedModule.title}</h2>
              <button onClick={() => setSelectedModule(null)} className="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {isLoadingContent && <div className="flex justify-center items-center h-40"><Spinner/> <span className='ml-2'>Loading content...</span></div>}
              {error && <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>}
              {selectedModule.content && (
                  <>
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedModule.content) }}></div>
                     {!feedbackGiven ? (
                        <div className="flex items-center justify-end space-x-3 mt-6 border-t pt-4">
                            <span className="text-xs text-gray-600">Was this content helpful?</span>
                            <button onClick={() => handleFeedback('helpful')} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md hover:bg-green-200">👍 Helpful</button>
                            <button onClick={() => handleFeedback('unhelpful')} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-md hover:bg-red-200">👎 Unhelpful</button>
                        </div>
                    ) : (
                        <p className="text-right text-xs text-green-600 mt-4 font-semibold border-t pt-4">Thank you for your feedback!</p>
                    )}
                  </>
              )}
            </div>
             <div className="p-6 border-t bg-gray-50 flex justify-end space-x-4">
                <button onClick={() => setSelectedModule(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                <button 
                  onClick={startQuiz}
                  disabled={!selectedModule.content || isLoadingContent}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Start Quiz
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesPage;
