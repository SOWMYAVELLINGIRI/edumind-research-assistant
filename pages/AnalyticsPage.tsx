
import React, { useState, useEffect, useMemo } from 'react';
import { getLogs, exportLogsToCSV, clearLogs } from '../services/trackingService';
import type { LogEntry } from '../types';

const AnalyticsPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    setLogs(getLogs().reverse()); // Show most recent logs first
  }, []);

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to permanently delete all analytics data? This action cannot be undone.')) {
        clearLogs();
        setLogs([]);
    }
  };

  const stats = useMemo(() => {
    const apiCalls = logs.filter(log => log.eventType === 'API_CALL');
    const successfulApiCalls = apiCalls.filter(log => log.systemStability === 1);
    const totalResponseTime = apiCalls.reduce((sum, log) => sum + (log.responseTimeMs || 0), 0);
    
    const feedbackLogs = logs.filter(log => log.interactionType === 'give_feedback');
    const helpfulFeedback = feedbackLogs.filter(log => log.hallucinationRate === 0).length;
    const totalFeedback = feedbackLogs.length;
    const contentHelpfulness = totalFeedback > 0 ? ((helpfulFeedback / totalFeedback) * 100).toFixed(1) : 'N/A';

    return {
      totalEvents: logs.length,
      totalApiCalls: apiCalls.length,
      apiSuccessRate: apiCalls.length > 0 ? ((successfulApiCalls.length / apiCalls.length) * 100).toFixed(1) : 'N/A',
      avgResponseTime: apiCalls.length > 0 ? (totalResponseTime / apiCalls.length).toFixed(0) : 'N/A',
      contentHelpfulness,
    };
  }, [logs]);

  const StatCard = ({ title, value, icon }: {title: string, value: string | number, icon: React.ReactNode}) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Application Analytics</h1>
            <div className="flex items-center gap-2">
                <button
                  onClick={exportLogsToCSV}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <DownloadIcon />
                  Export Database (CSV)
                </button>
                 <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <TrashIcon />
                  Clear Database
                </button>
            </div>
        </div>
        <p className="text-md text-gray-600 mb-8">
            Monitoring user interactions and system performance metrics.
        </p>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Logged Events" value={stats.totalEvents} icon={<ListBulletIcon />} />
            <StatCard title="Total API Calls" value={stats.totalApiCalls} icon={<ServerStackIcon />} />
            <StatCard title="API Success Rate" value={`${stats.apiSuccessRate}%`} icon={<ChartPieIcon />} />
            <StatCard title="Avg. API Response Time" value={`${stats.avgResponseTime} ms`} icon={<ClockIcon />} />
            <StatCard title="Content Helpfulness" value={`${stats.contentHelpfulness}%`} icon={<ThumbUpIcon />} />
        </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Database</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interaction</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Research Paper</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citations</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Score</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy %</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response (ms)</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stability</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hallucination</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.length > 0 ? logs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    log.eventType === 'API_CALL' && log.systemStability === 0 ? 'bg-red-100 text-red-800' :
                                    log.eventType === 'API_CALL' ? 'bg-green-100 text-green-800' :
                                    log.eventType === 'QUIZ_COMPLETE' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {log.eventType}
                                </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.interactionType || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.topic || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.moduleTitle || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{log.researchPaperTitle || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.researchPaperYear || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.researchPaperCitations || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.quizId || '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.quizScore ?? '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.quizAccuracy ?? '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.responseTimeMs ?? '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.systemStability ?? '-'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.hallucinationRate ?? '-'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={14} className="text-center py-10 text-gray-500">No activity has been logged yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// Icons
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const ListBulletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const ServerStackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ThumbUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.97l-1.9 4.5M7 14h-1a2 2 0 00-2 2v4a2 2 0 002 2h1v-6z" /></svg>;

export default AnalyticsPage;
