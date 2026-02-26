
import React from 'react';
import PathTimeline from '../components/PathTimeline';
import { useAppContext } from '../context/AppContext';

const LearningPathPage = () => {
  const { progress, modules } = useAppContext();

  const getEncouragementMessage = () => {
    const totalModules = modules.length;
    const completedCount = progress.completedModules.length;

    if (totalModules === 0) {
        return "Your learning path will appear here once you start a search.";
    }
    if (completedCount === totalModules && totalModules > 0) {
        return `Excellent! You've completed all modules for "${progress.topic}".`;
    }
    if (completedCount > 0) {
        return "Great progress! Here's a look at your journey so far and what's next.";
    }
    return `This is your roadmap to mastering "${progress.topic}". The first step is waiting for you!`;
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Learning Path</h1>
          <p className="text-gray-500 mb-8">{getEncouragementMessage()}</p>
      </div>
      <PathTimeline modules={modules} completedModules={progress.completedModules} />
    </div>
  );
};

export default LearningPathPage;
