
import React from 'react';
import { useAppContext } from '../context/AppContext';
import PathTimeline from '../components/PathTimeline';

const DashboardPage = () => {
  const { user, progress, modules } = useAppContext();
  const totalModules = modules.length;
  const completedCount = progress.completedModules.length;
  const completionPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const getEncouragementMessage = () => {
    if (totalModules === 0) {
        return "Start a search on the Home page to generate your learning path!";
    }
    if (completionPercentage === 100) {
        return `Congratulations on mastering "${progress.topic}"! Try a new topic to keep learning.`;
    }
    if (completedCount > 0) {
        return "You're making fantastic progress! Keep up the great momentum.";
    }
    return `Let's get started on your learning journey for "${progress.topic}".`;
  };

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
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
      </div>
      <p className="text-md text-gray-600 mb-6">{getEncouragementMessage()}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Skill Level" value={progress.skillLevel} icon={<AcademicCapIcon />} />
        <StatCard title="Points Earned" value={progress.points} icon={<StarIcon />} />
        <StatCard title="Modules Completed" value={`${progress.completedModules.length} / ${totalModules}`} icon={<CheckBadgeIcon />} />
        <StatCard title="Completion" value={`${completionPercentage}%`} icon={<ChartPieIcon />} />
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Learning Path Progress</h2>
        <PathTimeline modules={modules} completedModules={progress.completedModules} />
      </div>
    </div>
  );
};

// Icons
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975-2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;


export default DashboardPage;