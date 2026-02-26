
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginPage = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login, signup, resetPassword } = useAppContext();
  const navigate = useNavigate();

  const clearForm = () => {
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      setMessage('');
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (view === 'login') {
        await login(email, password);
      } else { // signup
        await signup(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };
  
  const handlePasswordResetRequest = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setMessage('');
      
      if (!email) {
          setError("Please enter your email address to reset your password.");
          return;
      }
      
      // This will reset the password in localStorage and log it to the console for simulation purposes.
      resetPassword(email);

      // In a real application, an email would be sent. Here, we just show a confirmation
      // and log the password to the console for the user to retrieve.
      setMessage(`If an account with the email "${email}" exists, a password reset has been initiated. Since we can't send an email, the new temporary password has been logged to the browser's console for you to use.`);
  }

  const switchView = (newView: 'login' | 'signup' | 'forgotPassword') => {
      setView(newView);
      clearForm();
  }

  const renderTitle = () => {
      if (view === 'login') return 'Welcome back!';
      if (view === 'signup') return 'Create your account';
      return 'Reset your password';
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">EduMind</h1>
          <p className="mt-2 text-gray-600">{renderTitle()}</p>
        </div>
        
        {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
            </div>
        )}
        
        {message && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                {message}
            </div>
        )}

        {view === 'forgotPassword' ? (
            <form onSubmit={handlePasswordResetRequest} className="space-y-6">
                <div>
                  <p className="text-center text-sm text-gray-600 mb-4">Enter your email address and we will generate a temporary password for you to log in.</p>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                 <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Generate Temporary Password
                    </button>
                  </div>
            </form>
        ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {view === 'signup' && (
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              
              {view === 'login' && (
                  <div className="text-sm text-right">
                      <button type="button" onClick={() => switchView('forgotPassword')} className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot your password?
                      </button>
                  </div>
              )}

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {view === 'login' ? 'Log In' : 'Create Account'}
                </button>
              </div>
            </form>
        )}

        <div className="text-sm text-center">
            {view === 'login' && (
                <button onClick={() => switchView('signup')} className="font-medium text-blue-600 hover:text-blue-500">
                    Don't have an account? Sign up
                </button>
            )}
            {view === 'signup' && (
                <button onClick={() => switchView('login')} className="font-medium text-blue-600 hover:text-blue-500">
                    Already have an account? Log in
                </button>
            )}
             {view === 'forgotPassword' && (
                <button onClick={() => switchView('login')} className="font-medium text-blue-600 hover:text-blue-500">
                    Back to Login
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
