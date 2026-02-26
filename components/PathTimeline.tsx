
import React from 'react';
import type { Module } from '../types';

interface PathTimelineProps {
  modules: Module[];
  completedModules: string[];
}

const PathTimeline: React.FC<PathTimelineProps> = ({ modules, completedModules }) => {
    
  const getStatus = (moduleId: string, index: number): 'completed' | 'current' | 'locked' => {
    if (completedModules.includes(moduleId)) {
      return 'completed';
    }
    // The "current" module is the first one in the list that is not yet completed.
    // Assuming modules are always in order, this will be at the index matching the number of completed modules.
    if (index === completedModules.length) return 'current';

    return 'locked';
  };

  const statusStyles = {
    completed: {
      iconBg: 'bg-green-500',
      icon: <CheckIcon />,
      text: 'text-gray-800',
      badge: 'bg-green-100 text-green-800',
      badgeText: 'Completed',
    },
    current: {
      iconBg: 'bg-blue-500',
      icon: <PencilIcon />,
      text: 'text-blue-700 font-semibold',
      badge: 'bg-blue-100 text-blue-800',
      badgeText: 'Next Up',
    },
    locked: {
      iconBg: 'bg-gray-400',
      icon: <LockIcon />,
      text: 'text-gray-500',
      badge: 'bg-gray-100 text-gray-800',
      badgeText: 'Locked',
    },
  };

  return (
    <div className="p-4 sm:p-6">
      <ol className="relative border-l-2 border-gray-200">
        {modules.map((module, index) => {
          const status = getStatus(module.id, index);
          const styles = statusStyles[status];
          return (
            <li key={module.id} className="mb-10 ml-8">
                <span className={`absolute flex items-center justify-center w-8 h-8 ${styles.iconBg} rounded-full -left-[17px] ring-8 ring-white`}>
                    {styles.icon}
                </span>
                <div className={`p-4 rounded-lg border ${status === 'current' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-lg font-semibold ${styles.text}`}>{module.title}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                            {styles.badgeText}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    {status === 'locked' && (
                        <p className="text-xs text-gray-400 mt-2 italic">Complete previous modules to unlock this one.</p>
                    )}
                </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);
const PencilIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
);

export default PathTimeline;
