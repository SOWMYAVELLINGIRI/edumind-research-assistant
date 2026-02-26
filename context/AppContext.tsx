
import React, { createContext, useContext, useState, useEffect, useCallback, FC, ReactNode } from 'react';
import type { User, UserProgress, Paper, Module } from '../types';
import { SkillLevel } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { MOCK_PAPERS, MOCK_MODULES } from '../data/mockData';
import { generatePapers, generateModules } from '../services/geminiService';
import { logEvent } from '../services/trackingService';

const ADMIN_EMAIL = 'admin@edumind.com';

interface AllUsersData {
  [email: string]: {
    password: string; 
    name: string;
    progress: UserProgress;
  };
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  isInitialized: boolean;
  progress: UserProgress;
  researchTopic: string;
  papers: Paper[];
  modules: Module[];
  selectedPaper: Paper | null;
  setSelectedPaper: React.Dispatch<React.SetStateAction<Paper | null>>;
  isSearching: boolean;
  searchPapers: (topic: string) => Promise<void>;
  applyFilters: (filters: { year: string; sortBy: string }) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateScore: (moduleId: string, moduleTitle: string, score: number, passed: boolean) => void;
  resetPassword: (email: string) => string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProgress: UserProgress = {
  topic: 'Machine Learning',
  completedModules: [],
  quizScores: {},
  skillLevel: SkillLevel.BEGINNER,
  points: 0,
};

export const AppProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [allUsersData, setAllUsersData] = useLocalStorage<AllUsersData>('edumind_all_users', {});
  const [isInitialized, setIsInitialized] = useState(false);

  const [searchedPapers, setSearchedPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [displayedPapers, setDisplayedPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [modules, setModules] = useState<Module[]>(MOCK_MODULES);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(displayedPapers.length > 0 ? displayedPapers[2] : null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Ensure admin user exists for backend access
    if (!allUsersData[ADMIN_EMAIL]) {
        setAllUsersData(prev => ({
            ...prev,
            [ADMIN_EMAIL]: {
                name: 'Admin',
                password: 'adminpassword',
                progress: initialProgress
            }
        }));
        console.log(`Admin account available. Email: ${ADMIN_EMAIL}, Password: adminpassword`);
    }

    try {
        const loggedInUserEmail = localStorage.getItem('edumind_current_user');
        if (loggedInUserEmail && allUsersData[loggedInUserEmail]) {
            const userData = allUsersData[loggedInUserEmail];
            setUser({ name: userData.name, email: loggedInUserEmail });
            setProgress(userData.progress);
        }
    } catch (e) {
        console.error("Failed to initialize user session:", e);
        localStorage.removeItem('edumind_current_user');
    }
    setIsInitialized(true);
  }, []); // Intentionally empty dependency array to run only once on mount

  const signup = async (name: string, email: string, password: string) => {
    const emailLower = email.toLowerCase();
    if (allUsersData[emailLower]) {
      throw new Error('An account with this email already exists.');
    }
    
    const newUserEntry = { password, name, progress: initialProgress };
    setAllUsersData(prev => ({ ...prev, [emailLower]: newUserEntry }));

    setUser({ name, email: emailLower });
    setProgress(initialProgress);
    localStorage.setItem('edumind_current_user', emailLower);

    logEvent({ eventType: 'LOGIN', userId: emailLower });
  };

  const login = async (email: string, password: string) => {
    const emailLower = email.toLowerCase();
    const userData = allUsersData[emailLower];
    if (!userData || userData.password !== password) {
      throw new Error('Invalid email or password.');
    }

    setUser({ name: userData.name, email: emailLower });
    setProgress(userData.progress);
    localStorage.setItem('edumind_current_user', emailLower);
    
    logEvent({ eventType: 'LOGIN', userId: emailLower });
  };

  const logout = () => {
    setUser(null);
    setProgress(initialProgress);
    localStorage.removeItem('edumind_current_user');
  };
  
  const resetPassword = (email: string): string | null => {
    const emailLower = email.toLowerCase();
    const userData = allUsersData[emailLower];

    if (!userData) {
      return null;
    }

    const tempPassword = Math.random().toString(36).substring(2, 10);

    setAllUsersData(prevData => ({
      ...prevData,
      [emailLower]: {
        ...prevData[emailLower],
        password: tempPassword,
      },
    }));

    console.log(`Password for ${emailLower} has been reset to: ${tempPassword}`);
    return tempPassword;
  };

  const updateScore = (moduleId: string, moduleTitle: string, score: number, passed: boolean) => {
    setProgress(prev => {
        const newScores = { ...prev.quizScores, [moduleId]: score };
        
        if (user) {
            const module = modules.find(m => m.id === moduleId);
            let relatedPapers: string[] = [];
            if (module?.content) {
                const relatedPapersSection = module.content.split('### Related Research Papers')[1];
                if (relatedPapersSection) {
                    const matches = relatedPapersSection.match(/\* (.*)/g);
                    if (matches) {
                        relatedPapers = matches.map(match => match.substring(2).trim());
                    }
                }
            }

            logEvent({
                eventType: 'QUIZ_COMPLETE',
                userId: user.email,
                topic: prev.topic,
                quizId: moduleId,
                moduleTitle: moduleTitle,
                quizScore: score,
                quizAccuracy: (score / 10) * 10, // Score is out of 100
                relatedPaperTitles: relatedPapers.length > 0 ? relatedPapers : undefined,
            });
        }

        const newPoints = passed ? prev.points + score : prev.points;
        const newCompleted = passed 
            ? [...new Set([...prev.completedModules, moduleId])]
            : prev.completedModules;

        const scoreValues = Object.values(newScores);
        const avgScore = scoreValues.length > 0
            ? scoreValues.reduce<number>((a, b) => a + Number(b || 0), 0) / scoreValues.length
            : 0;

        let newSkillLevel = prev.skillLevel;
        if (avgScore > 80) newSkillLevel = SkillLevel.ADVANCED;
        else if (avgScore > 50) newSkillLevel = SkillLevel.INTERMEDIATE;
        else newSkillLevel = SkillLevel.BEGINNER;

        const newProgress = {
            ...prev,
            quizScores: newScores,
            points: newPoints,
            completedModules: newCompleted,
            skillLevel: newSkillLevel,
        };

        if (user?.email) {
            setAllUsersData(allData => ({
                ...allData,
                [user.email]: {
                    ...allData[user.email],
                    progress: newProgress,
                },
            }));
        }
        return newProgress;
    });
  };

  const searchPapers = async (topic: string) => {
    setIsSearching(true);
    setProgress(prev => ({ ...prev, topic, completedModules: [], quizScores: {} })); 
    setSelectedPaper(null);

    if (user) {
        logEvent({
            eventType: 'SEARCH',
            userId: user.email,
            topic: topic,
        });
    }

    try {
        let paperResults: Paper[];
        let moduleResults: Module[];

        if (!topic.trim()) {
            paperResults = MOCK_PAPERS;
            moduleResults = MOCK_MODULES;
        } else {
            [paperResults, moduleResults] = await Promise.all([
                generatePapers(topic, user),
                generateModules(topic, user)
            ]);
        }
        setSearchedPapers(paperResults);
        setDisplayedPapers(paperResults);
        setModules(moduleResults);
    } catch (error) {
        console.error("Failed to search for papers or modules:", error);
        setSearchedPapers([]);
        setDisplayedPapers([]);
        setModules(MOCK_MODULES);
    } finally {
        setIsSearching(false);
    }
  };

  const applyFilters = useCallback((filters: { year: string, sortBy: string }) => {
    let papersToFilter = [...searchedPapers];
    if (filters.year && filters.year !== 'All') {
        papersToFilter = papersToFilter.filter(p => p.year.toString() === filters.year);
    }
    if (filters.sortBy === 'citations') {
        papersToFilter.sort((a, b) => b.citations - a.citations);
    }
    setDisplayedPapers(papersToFilter);
  }, [searchedPapers]);

  const value = {
    user,
    isAdmin: user?.email === ADMIN_EMAIL,
    isInitialized,
    progress,
    researchTopic: progress.topic,
    papers: displayedPapers,
    modules,
    selectedPaper,
    setSelectedPaper,
    isSearching,
    searchPapers,
    applyFilters,
    login,
    signup,
    logout,
    updateScore,
    resetPassword,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};