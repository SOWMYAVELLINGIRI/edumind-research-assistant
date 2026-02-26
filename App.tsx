
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import QuizPage from './pages/QuizPage';
import LearningPathPage from './pages/LearningPathPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Header';
import { useAppContext } from './context/AppContext';
import AnalyticsPage from './pages/AnalyticsPage';
import EvaluationPage from './pages/EvaluationPage';

function App() {
  const { user, isInitialized, isAdmin } = useAppContext();

  if (!isInitialized) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-xl text-gray-600">Loading...</div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <HashRouter>
        {user && <Header />}
        <main className="p-4 md:p-8">
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/modules" element={user ? <ModulesPage /> : <Navigate to="/login" />} />
            <Route path="/quiz" element={user ? <QuizPage /> : <Navigate to="/login" />} />
            <Route path="/path" element={user ? <LearningPathPage /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/evaluation" element={user ? <EvaluationPage /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user && isAdmin ? <AnalyticsPage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
}

export default App;