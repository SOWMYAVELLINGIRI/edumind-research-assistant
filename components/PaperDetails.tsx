
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateSummary } from '../services/geminiService';
import Spinner from './Spinner';
import { logEvent } from '../services/trackingService';

const PaperDetails = () => {
  const { user, selectedPaper, progress } = useAppContext();
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  useEffect(() => {
    setSummary('');
    setError('');
    setFeedbackGiven(false);
  }, [selectedPaper]);

  const handleGenerateSummary = async () => {
    if (!selectedPaper || !user) return;
    setIsLoading(true);
    setError('');
    setSummary('');
    setFeedbackGiven(false);
    
    logEvent({
        eventType: 'USER_INTERACTION',
        userId: user.email,
        interactionType: 'generate_summary',
        topic: progress.topic,
        researchPaperTitle: selectedPaper.title,
        researchPaperYear: selectedPaper.year,
        researchPaperCitations: selectedPaper.citations,
    });

    try {
      const result = await generateSummary(selectedPaper.abstract, progress.topic, user);
      setSummary(result);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedback = (value: 'helpful' | 'unhelpful') => {
      if (!user || !selectedPaper) return;
      logEvent({
          eventType: 'USER_INTERACTION',
          userId: user.email,
          interactionType: 'give_feedback',
          hallucinationRate: value === 'helpful' ? 0 : 1,
          topic: progress.topic,
          researchPaperTitle: selectedPaper.title,
          researchPaperYear: selectedPaper.year,
          researchPaperCitations: selectedPaper.citations,
      });
      setFeedbackGiven(true);
  }

  if (!selectedPaper) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-center h-full">
        <p className="text-gray-500">Select a paper to see details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedPaper.title}</h2>
        <p className="text-sm text-gray-600 mb-1">{selectedPaper.authors.join(', ')}</p>
        <p className="text-sm text-gray-500 mb-4">Year: {selectedPaper.year} &middot; Citations: {selectedPaper.citations}</p>
        
        <div className="bg-gray-50 p-4 rounded-lg my-4">
            <h3 className="font-semibold text-gray-700 mb-2">Abstract</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedPaper.abstract}</p>
        </div>

        <div className="mt-auto pt-4">
            <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-gray-700">Summary</h3>
                <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading}
                    className="flex items-center bg-blue-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading && <Spinner />}
                    {isLoading ? 'Generating...' : 'Generate Summary'}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            {summary && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-800 text-sm leading-relaxed">{summary}</p>
                     {!feedbackGiven ? (
                        <div className="flex items-center justify-end space-x-3 mt-3">
                            <span className="text-xs text-gray-600">Was this summary helpful?</span>
                            <button onClick={() => handleFeedback('helpful')} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md hover:bg-green-200">👍 Helpful</button>
                            <button onClick={() => handleFeedback('unhelpful')} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-md hover:bg-red-200">👎 Unhelpful</button>
                        </div>
                    ) : (
                        <p className="text-right text-xs text-green-600 mt-3 font-semibold">Thank you for your feedback!</p>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PaperDetails;
