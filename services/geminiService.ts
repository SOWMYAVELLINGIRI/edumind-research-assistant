
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Question, Paper, Module, User } from '../types';
import { logEvent } from './trackingService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type ApiEndpoint = 'generatePapers' | 'generateModules' | 'generateSummary' | 'generateModuleContent' | 'generateQuiz';

async function callGeminiWithTracking<T>(
    apiEndpoint: ApiEndpoint,
    user: User | null,
    context: { topic?: string; moduleTitle?: string },
    apiCall: () => Promise<GenerateContentResponse>
): Promise<any> {
    const startTime = performance.now();
    const userId = user?.email || 'anonymous';

    try {
        const response = await apiCall();
        const endTime = performance.now();
        const responseTimeMs = Math.round(endTime - startTime);

        logEvent({
            eventType: 'API_CALL',
            apiEndpoint,
            userId,
            ...context,
            responseTimeMs,
            systemStability: 1,
            resourceUtilization: responseTimeMs,
        });

        const jsonText = response.text?.trim();
        if (!jsonText) {
            throw new Error("Received an empty response from the API.");
        }
        
        if (apiEndpoint === 'generateSummary' || apiEndpoint === 'generateModuleContent') {
            return jsonText;
        }

        return JSON.parse(jsonText);

    } catch (error) {
        const endTime = performance.now();
        const responseTimeMs = Math.round(endTime - startTime);
        const errorMessage = error instanceof Error ? error.message : String(error);

        logEvent({
            eventType: 'API_CALL',
            apiEndpoint,
            userId,
            ...context,
            responseTimeMs,
            systemStability: 0,
            resourceUtilization: responseTimeMs,
            errorMessage: errorMessage,
        });

        console.error(`Error calling ${apiEndpoint}:`, error);
        throw new Error(`Failed to execute ${apiEndpoint}.`);
    }
}


export const generatePapers = async (topic: string, user: User | null): Promise<Paper[]> => {
    const paperData = await callGeminiWithTracking('generatePapers', user, { topic }, () => 
        ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a list of 7 fictional, but realistic-sounding, research papers on the topic of "${topic}". For each paper, provide a unique ID, title, a list of authors, a plausible year of publication (between 2020-2023), a citation count, and a detailed abstract of about 100-150 words. The output must be a valid JSON array of objects.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                            year: { type: Type.INTEGER },
                            citations: { type: Type.INTEGER },
                            abstract: { type: Type.STRING }
                        },
                        required: ["id", "title", "authors", "year", "citations", "abstract"]
                    }
                }
            }
        })
    );
    if (!Array.isArray(paperData)) throw new Error("Invalid paper data format.");
    return paperData;
};

export const generateModules = async (topic: string, user: User | null): Promise<Module[]> => {
    const moduleData = await callGeminiWithTracking('generateModules', user, { topic }, () => 
        ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a list of 5 learning modules for the research topic "${topic}". Each module should have a unique ID (e.g., 'module1', 'module2'), a concise title, and a short, engaging description about what the user will learn. The output must be a valid JSON array of objects.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ["id", "title", "description"]
                    }
                }
            }
        })
    );
    if (!Array.isArray(moduleData)) throw new Error("Invalid module data format.");
    return moduleData.map(m => ({ ...m, progress: 0 }));
};

export const generateSummary = async (abstract: string, topic: string | null, user: User | null): Promise<string> => {
    return callGeminiWithTracking('generateSummary', user, { topic: topic ?? undefined }, () => 
        ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize the following research paper abstract in 3-4 lines, making it easy to understand for a student: "${abstract}"`,
        })
    );
};

export const generateModuleContent = async (moduleTitle: string, topic: string, papers: Paper[], user: User | null): Promise<string> => {
    const paperTitles = papers.map(p => `- ${p.title}`).join('\n');
    return callGeminiWithTracking('generateModuleContent', user, { topic, moduleTitle }, () => 
        ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `
              Given the research topic "${topic}" and the following list of available research papers:
              ${paperTitles}

              Now, for the learning module titled "${moduleTitle}", please do the following:
              1.  Write detailed and comprehensive educational content as a single paragraph. This content should be substantial, at least 15-20 lines long, providing in-depth explanations, examples, and key concepts. It must be easy to understand for a student.
              2.  From the provided list, identify 1 to 3 papers that are most relevant to this specific module's topic.

              Structure your response using the following markdown format EXACTLY, with no extra text before or after:

              ### Learning Content
              [Your detailed paragraph content here]

              ### Related Research Papers
              * [Title of the first relevant paper]
              * [Title of the second relevant paper]
            `,
        })
    );
};

export const generateQuiz = async (moduleContent: string, moduleTitle: string, topic: string, user: User | null): Promise<Question[]> => {
    const quizData = await callGeminiWithTracking('generateQuiz', user, { topic, moduleTitle }, () => 
        ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a 10-question multiple-choice quiz based on this content: "${moduleContent}". The quiz must be a valid JSON array. Each question object must have three properties: "question" (string), "options" (an array of 4 strings), and "correctAnswer" (a string matching one of the options).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer"]
                    }
                }
            }
        })
    );
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !q.options || !q.correctAnswer)) {
        throw new Error("Invalid quiz data format.");
    }
    return quizData;
};
