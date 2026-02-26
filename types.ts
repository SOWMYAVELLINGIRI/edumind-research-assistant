
export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  abstract: string;
}

export interface Module {
  id: string;
  title:string;
  description: string;
  progress: number;
  content?: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  moduleId: string;
  questions: Question[];
}

export interface User {
  name: string;
  email: string;
}

export enum SkillLevel {
    BEGINNER = 'Beginner (Level 1)',
    INTERMEDIATE = 'Intermediate (Level 2)',
    ADVANCED = 'Advanced (Level 3)',
}

export interface UserProgress {
  topic: string;
  completedModules: string[];
  quizScores: { [moduleId: string]: number };
  skillLevel: SkillLevel;
  points: number;
}

// Represents a single row in the new analytics database
export interface LogEntry {
  timestamp: string;
  
  // User Info
  userId: string; // user email will be used as ID
  
  // Event Categorization
  eventType: 'LOGIN' | 'SEARCH' | 'API_CALL' | 'QUIZ_COMPLETE' | 'USER_INTERACTION';
  
  // Specifics for USER_INTERACTION
  interactionType?: 'select_paper' | 'generate_summary' | 'view_module_content' | 'start_quiz' | 'give_feedback';
  
  // Context
  topic?: string;
  moduleTitle?: string;
  
  // Research Paper Context
  researchPaperTitle?: string;
  researchPaperYear?: number;
  researchPaperCitations?: number;
  relatedPaperTitles?: string[]; // For linking quizzes to papers
  
  // API Performance
  apiEndpoint?: 'generatePapers' | 'generateModules' | 'generateSummary' | 'generateModuleContent' | 'generateQuiz';
  responseTimeMs?: number;
  systemStability?: 0 | 1; // 1 for success, 0 for failure
  resourceUtilization?: number; // using responseTimeMs as a proxy
  
  // Quiz Performance
  quizId?: string; // module ID
  quizScore?: number;
  quizAccuracy?: number; // 0-100 percentage
  
  // Content Quality Proxy
  hallucinationRate?: 0 | 1; // 1 for 'unhelpful', 0 for 'helpful'
  
  // Error Info
  errorMessage?: string;
}