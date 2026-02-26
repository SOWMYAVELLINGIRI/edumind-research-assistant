
import React, { useState, useEffect, useMemo } from 'react';
import { getLogs, getEvaluationMetrics, exportLogsToCSV } from '../services/trackingService';
import type { EvaluationMetric } from '../services/trackingService';
import type { LogEntry } from '../types';

const EvaluationPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [detailedMetrics, setDetailedMetrics] = useState<EvaluationMetric[]>([]);

  useEffect(() => {
    setLogs(getLogs());
    setDetailedMetrics(getEvaluationMetrics());
  }, []);

  const stats = useMemo(() => {
    const apiCalls = logs.filter(log => log.eventType === 'API_CALL');
    const quizLogs = logs.filter(log => log.eventType === 'QUIZ_COMPLETE' && log.quizAccuracy !== undefined);
    const feedbackLogs = logs.filter(log => log.interactionType === 'give_feedback');

    // Accuracy
    const totalAccuracy = quizLogs.reduce((sum, log) => sum + (log.quizAccuracy || 0), 0);
    const avgAccuracy = quizLogs.length > 0 ? (totalAccuracy / quizLogs.length).toFixed(1) : 'N/A';
    
    // Response Time
    const totalResponseTime = apiCalls.reduce((sum, log) => sum + (log.responseTimeMs || 0), 0);
    const avgResponseTime = apiCalls.length > 0 ? (totalResponseTime / apiCalls.length).toFixed(0) : 'N/A';

    // Hallucination Rate
    const unhelpfulFeedback = feedbackLogs.filter(log => log.hallucinationRate === 1).length;
    const totalFeedback = feedbackLogs.length;
    const hallucinationRate = totalFeedback > 0 ? ((unhelpfulFeedback / totalFeedback) * 100).toFixed(1) : '0.0';
    
    // System Stability
    const successfulApiCalls = apiCalls.filter(log => log.systemStability === 1);
    const systemStability = apiCalls.length > 0 ? ((successfulApiCalls.length / apiCalls.length) * 100).toFixed(1) : '100.0';
    
    // User Interaction
    const userInteractions = logs.filter(log => log.eventType === 'USER_INTERACTION').length;


    return {
      accuracy: avgAccuracy !== 'N/A' ? `${avgAccuracy}%` : 'N/A',
      responseTime: avgResponseTime !== 'N/A' ? `${avgResponseTime} ms` : 'N/A',
      hallucination: `${hallucinationRate}%`,
      systemStability: `${systemStability}%`,
      resourceUtilization: avgResponseTime !== 'N/A' ? `${avgResponseTime} ms` : 'N/A', // Proxy
      userInteraction: userInteractions,
    };
  }, [logs]);

  const accuracyDescription = (
    <>
      Accuracy is the percentage of correct predictions made by a system out of the total predictions.
      <br /><br />
      <strong>Formula:</strong>
      <br />
      <span className="font-mono text-gray-300">(Correct / Total) × 100</span>
    </>
  );

  const StatCard = ({ title, value, icon, description }: {title: string, value: string | number, icon: React.ReactNode, description?: React.ReactNode}) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center text-center relative">
        {description && (
          <div className="absolute top-2 right-2 group">
            <InfoIcon />
            <div className="absolute bottom-full mb-2 right-0 w-72 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-left">
                {description}
            </div>
          </div>
        )}
        <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
            {icon}
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800">Application Evaluation</h1>
            <p className="mt-4 text-lg text-gray-600">
                Key performance metrics for the EduMind Research Assistant.
            </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard title="Relevance Score" value={stats.accuracy} icon={<CheckBadgeIcon />} description={accuracyDescription} />
            <StatCard title="ROUGE Score" value={stats.responseTime} icon={<ClockIcon />} />
            <StatCard title="Faithfulness" value={stats.hallucination} icon={<ExclamationTriangleIcon />} />
            <StatCard title="Coherence" value={stats.systemStability} icon={<ShieldCheckIcon />} />
            <StatCard title="Quiz Accuracy" value={stats.resourceUtilization} icon={<ServerStackIcon />} />
        </div>

        <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detailed Metrics Breakdown</h2>
                <button
                  onClick={exportLogsToCSV}
                  disabled={detailedMetrics.length === 0}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <DownloadIcon />
                  Export as CSV
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Research Topic</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relevance Score</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROUGE Score</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faithfulness</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coherence</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {detailedMetrics.length > 0 ? detailedMetrics.map((metric, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.userName}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.researchTopic}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.moduleTitle || '-'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.relevanceScore}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.rougeScore}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.faithfulness}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.coherence}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{metric.quizAccuracy}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">No detailed evaluation data available yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

// Icons
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.955a11.955 11.955 0 0018 0c0-1.282-.204-2.52-.586-3.7-.382-1.18-.885-2.28-1.5-3.265z" /></svg>;
const ServerStackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default EvaluationPage;
