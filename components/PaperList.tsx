
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { logEvent } from '../services/trackingService';

const PaperList = () => {
  const { user, papers, selectedPaper, setSelectedPaper, isSearching, progress } = useAppContext();

  const handleSelectPaper = (paper: (typeof papers)[0]) => {
    if (user) {
        logEvent({
            eventType: 'USER_INTERACTION',
            userId: user.email,
            interactionType: 'select_paper',
            topic: progress.topic,
            researchPaperTitle: paper.title,
            researchPaperYear: paper.year,
            researchPaperCitations: paper.citations
        });
    }
    setSelectedPaper(paper);
  };

  const Skeleton = () => (
    <div className="p-4 rounded-lg bg-gray-50 animate-pulse">
        <div className="flex items-start">
            <div className="h-5 w-5 rounded-full bg-gray-200"></div>
            <div className="ml-3 flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Research Papers</h2>
      <div className="space-y-2">
        {isSearching ? (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        ) : papers.length > 0 ? (
          papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => handleSelectPaper(paper)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                selectedPaper?.id === paper.id
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`paper-${paper.id}`}
                    name="papers"
                    type="radio"
                    checked={selectedPaper?.id === paper.id}
                    onChange={() => handleSelectPaper(paper)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                </div>
                <div className="ml-3 text-sm flex-grow">
                  <label htmlFor={`paper-${paper.id}`} className="font-medium text-gray-900 block cursor-pointer">{paper.title}</label>
                  <p className="text-gray-500">{paper.authors.join(', ')}</p>
                  <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-gray-500">Year: {paper.year}</span>
                      <span className="text-gray-500">Citations: {paper.citations}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-semibold">No Research Papers Found</p>
                <p className="text-sm">Try adjusting your search topic for better results.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaperList;
