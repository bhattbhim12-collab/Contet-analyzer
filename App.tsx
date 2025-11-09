import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// Initial structure for analysis cards
const initialAnalysisCards = [
  {
    title: 'Core Concept',
    iconPath: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311l-3.75 0m3.75-7.478c.39.045.777.092 1.158.142m-1.158-.142a23.953 23.953 0 01-1.158-.142m5.8 1.487a23.953 23.953 0 01-5.8 0m11.807 0c.39.045.777.092 1.158.142m-1.158-.142a23.953 23.953 0 01-1.158-.142m-1.32 5.165c-.652.126-1.31.24-1.97.348m-1.97-.348a23.953 23.953 0 01-1.97-.348m0 0a23.953 23.953 0 00-4.04-1.19m4.04 1.19a23.953 23.953 0 004.04 1.19m-4.04-1.19a23.953 23.953 0 01-4.04-1.19m1.45 4.34a23.953 23.953 0 01-1.45-4.34m1.45 4.34a23.953 23.953 0 001.45-4.34m0 0a23.953 23.953 0 00-1.45 4.34M12 21a9 9 0 110-18 9 9 0 010 18z',
    content: 'Results will appear here.',
  },
  {
    title: 'Issue/Innovation',
    iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.472-1.472L13.5 18.75l1.188-.648a2.25 2.25 0 011.472-1.472L16.25 16.5l.648 1.188a2.25 2.25 0 011.472 1.472L18.75 19.5l-1.188.648a2.25 2.25 0 01-1.472 1.472z',
    content: 'Results will appear here.',
  },
  {
    title: 'Key Data',
    iconPath: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    content: 'Results will appear here.',
  },
  {
    title: 'Solution/Future Trend',
    iconPath: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.976 5.364M21.75 9l-5.364-3.976',
    content: 'Results will appear here.',
  },
  {
    title: 'Summary',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    content: 'Results will appear here.',
  }
];

// Deep copy function to avoid mutation issues with initial state
const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

const SkeletonCard: React.FC = () => (
    <div className="output-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-md bg-gray-700 mr-3"></div>
          <div className="h-4 w-1/3 rounded bg-gray-700"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-700"></div>
          <div className="h-4 w-3/4 rounded bg-gray-700"></div>
        </div>
      </div>
    </div>
);

// Component to parse and render basic markdown (bold, lists)
const parseInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
    }
    return part;
  });
};

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    const paragraphs = content.split('\n\n');

    return (
        <div className="text-gray-400">
            {paragraphs.map((paragraph, pIndex) => {
                const lines = paragraph.split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) return null;
                
                const isList = lines.every(line => line.trim().startsWith('* '));

                if (isList) {
                    return (
                        <ul key={pIndex} className="list-disc list-inside space-y-1 my-2">
                            {lines.map((item, lIndex) => (
                                <li key={lIndex}>{parseInline(item.trim().substring(2))}</li>
                            ))}
                        </ul>
                    );
                }
                
                return (
                    <p key={pIndex} className="my-2 whitespace-pre-wrap">
                        {parseInline(paragraph)}
                    </p>
                );
            })}
        </div>
    );
};

// Placeholder for the initial state of the output area
const InitialStatePlaceholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.442V18a3 3 0 00-6 0v.442A3.375 3.375 0 006.548 17.547l-.548-.547z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-300">Your AI Analysis Awaits</h3>
        <p className="mt-2 text-gray-500">
            Paste your content into the text area on the left and click 'Analyze' to see the magic happen.
        </p>
    </div>
);

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysisCards, setAnalysisCards] = useState(deepCopy(initialAnalysisCards));
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy All');
  const [error, setError] = useState('');

  const displayResults = (data: { [key: string]: string }) => {
    const newCards = initialAnalysisCards.map(card => ({
      ...card,
      content: data[card.title] || "Analysis result is not available."
    }));
    setAnalysisCards(newCards);
  };
  
  const analyzeWithGemini = async (text: string) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        
        const schemaProperties = initialAnalysisCards.reduce((acc, card) => {
          acc[card.title] = { type: Type.STRING, description: `A detailed analysis for the section: ${card.title}` };
          return acc;
        }, {} as { [key: string]: { type: Type; description: string } });

        const schema = {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: initialAnalysisCards.map(card => card.title)
        };
        
        const prompt = `You are a professional content analyst. Analyze the following text and provide a structured analysis based on the JSON schema provided. Identify the core concepts, any mentioned issues or innovations, key data points, potential solutions or future trends, and provide a concise summary. Use markdown for formatting like bold text (**text**) and bullet points (* point).

        Text to analyze:
        ---
        ${text}
        ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const analysisData = JSON.parse(response.text);

        displayResults(analysisData);
        setAnalysisCompleted(true);
        setError('');

    } catch (e) {
        console.error("Gemini API call failed:", e);
        let errorMessage = "Failed to analyze content. Please try again later.";
        if (e instanceof Error) {
          if (e.message.includes('API key')) {
            errorMessage = "API key is invalid or missing. Please check your configuration.";
          } else if (e.message.includes('429')) {
            errorMessage = "You have exceeded your API request quota. Please wait and try again."
          }
        }
        setError(errorMessage);
        setAnalysisCards(deepCopy(initialAnalysisCards));
        setAnalysisCompleted(false);
    }
  };


  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please paste content first.');
      return;
    }
    if (isLoading) return;

    setError('');
    setIsLoading(true);
    setAnalysisCompleted(false);

    try {
      await analyzeWithGemini(content);
    } finally {
      setIsLoading(false);
    }
  };


  const handleClear = () => {
    setContent('');
    setAnalysisCards(deepCopy(initialAnalysisCards));
    setAnalysisCompleted(false);
    setError('');
  };

  const handleCopy = () => {
    const allContent = analysisCards.map(card => `${card.title}:\n${card.content}`).join('\n\n');
    navigator.clipboard.writeText(allContent).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy All'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Content Analyzer
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Leverage the power of AI to gain deep insights from any text content.
          </p>
        </header>

        <main>
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Left Column: Input */}
            <div className="md:w-2/5 flex flex-col">
              <label htmlFor="contentInput" className="block mb-2 text-sm font-medium text-gray-400">
                Your Content
              </label>
              <textarea
                id="contentInput"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (error) setError('');
                }}
                className="w-full flex-grow min-h-[400px] p-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300"
                placeholder="Paste your article, blog, research paper, or any content here..."
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2 text-sm h-5">
                <div className="flex items-center text-red-500">
                    {error && (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p>{error}</p>
                        </>
                    )}
                </div>
                <p className="text-gray-500">{content.length} characters</p>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !content.trim()}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze'
                  )}
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-300"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="md:w-3/5 mt-8 md:mt-0">
              <div className="flex justify-end mb-4 h-10">
                {analysisCompleted && !isLoading && (
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-300 bg-gray-800 hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300"
                  >
                    {copyButtonText}
                  </button>
                )}
              </div>
              <div className="space-y-6">
                {isLoading 
                  ? Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)
                  : analysisCompleted
                    ? analysisCards.map((card, index) => (
                      <div 
                        key={index} 
                        className="output-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-600 opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3 text-purple-400 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
                          </svg>
                          <h3 className="text-lg font-semibold text-gray-200">{card.title}</h3>
                        </div>
                        <FormattedContent content={card.content} />
                      </div>
                  ))
                  : <InitialStatePlaceholder />
                }
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center py-8 mt-16 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Content Analyzer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;