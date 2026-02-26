
import React from 'react';
import type { Module } from '../types';

interface ModuleCardProps {
  module: Module;
  onSelect: (module: Module) => void;
  isCompleted: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect, isCompleted }) => {
  return (
    <div 
        onClick={() => onSelect(module)} 
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-blue-700">{module.title}</h3>
        {isCompleted ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Completed</span>
        ) : (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Not Started</span>
        )}
      </div>
      <p className="text-gray-600 mt-2 text-sm">{module.description}</p>
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-500">{isCompleted ? 100 : 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${isCompleted ? 100 : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
