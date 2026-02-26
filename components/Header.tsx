
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header = () => {
    const { user, logout, isAdmin } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 text-base font-medium transition-colors rounded-md ${
        isActive
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
        }`;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            EduMind
                        </Link>
                        <span className="text-2xl font-light text-gray-500 ml-2 hidden sm:inline">– Research Assistant</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-600 mr-4 hidden sm:block">Welcome, {user?.name}!</span>
                         <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                            aria-label="Logout"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                 <nav className="flex justify-center space-x-2 sm:space-x-6 py-2">
                    <NavLink to="/" className={navLinkClass} end>Home</NavLink>
                    <NavLink to="/modules" className={navLinkClass}>Modules</NavLink>
                    <NavLink to="/path" className={navLinkClass}>Path</NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/evaluation" className={navLinkClass}>Evaluation</NavLink>
                    {isAdmin && (
                        <NavLink to="/analytics" className={navLinkClass}>Analytics</NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;