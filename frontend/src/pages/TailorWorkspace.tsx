import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader, RefreshCw, Copy, Download, Star, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { useToast } from '../hooks/useToast';

interface AnalysisResult {
  id: string;
  score: number;
  matchedSkills: string[];
  improvementAreas: string[];
  highlights: string[];
  breakdown?: { skill_match: number; semantic_similarity: number; ats_optimization: number };
  weakRequirements?: string[];
  evidence?: { jd: string; resume: string; similarity: number }[];
}

export function TailorWorkspace() {
  const { showToast } = useToast();
  
  // Form state
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [seniority, setSeniority] = useState('');
  const [emphasis, setEmphasis] = useState<string[]>([]);
  
  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [inputMethod, setInputMethod] = useState<'upload' | 'paste'>('paste');
  
  // Clear any saved data on mount
  useEffect(() => {
    storage.clear();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      showToast('error', 'Please upload a plain text (.txt) file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setResumeText(text);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      showToast('error', 'Please provide your resume text');
      return;
    }
    
    if (!jobDescription.trim()) {
      showToast('error', 'Please provide the job description');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await api.analyze({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
        emphasis: emphasis.length > 0 ? emphasis : undefined,
        role: targetRole.trim() || undefined,
        seniority: seniority.trim() || undefined,
      });
      
      setResult(response);
      showToast('success', 'Analysis complete! Check your results below.');
    } catch {
      showToast('error', 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setTargetRole('');
    setSeniority('');
    setEmphasis([]);
    setResult(null);
    storage.clear();
    showToast('success', 'Form cleared successfully');
  };

  const copyHighlights = () => {
    if (result?.highlights) {
      const text = result.highlights.map(h => `• ${h}`).join('\n');
      navigator.clipboard.writeText(text);
      showToast('success', 'Highlights copied to clipboard');
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const downloadResults = () => {
    if (!result) return;
    
    const content = [
      'RESUME ANALYSIS RESULTS',
      '======================',
      '',
      `Match Score: ${result.score}%`,
      '',
      'MATCHED SKILLS:',
      ...result.matchedSkills.map(skill => `• ${skill}`),
      '',
      'IMPROVEMENT AREAS:',
      ...result.improvementAreas.map(area => `• ${area}`),
      '',
      'SUGGESTED HIGHLIGHTS:',
      ...result.highlights.map(highlight => `• ${highlight}`),
      '',
      `Generated on: ${new Date().toLocaleString()}`
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('success', 'Results downloaded successfully');
  };

  const toggleEmphasis = (tag: string) => {
    setEmphasis(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const emphasisOptions = ['Leadership', 'Technical Skills', 'Communication', 'Problem Solving', 'Teamwork', 'Innovation'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Tailor Workspace</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Analyze your resume against a specific job description and get personalized improvement suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resume Input</h2>
            
            {/* Input method toggle */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
              <button
                onClick={() => setInputMethod('paste')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'paste'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Paste Text
              </button>
              <button
                onClick={() => setInputMethod('upload')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  inputMethod === 'upload'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload File
              </button>
            </div>

            {inputMethod === 'upload' ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <span className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Click to upload
                  </span>
                  <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                  <input
                    id="resume-upload"
                    type="file"
                    className="hidden"
                    accept=".txt"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Plain text files (.txt) only
                </p>
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Optional fields */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Optional Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Developer"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Seniority Level
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead/Principal</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emphasis Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {emphasisOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleEmphasis(option)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      emphasis.includes(option)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Match Score */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Match Score</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyHighlights}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Copy highlights"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={downloadResults}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      title="Download results"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2.51 * result.score} 251.2`}
                        className={`transition-all duration-1000 ${
                          result.score >= 80
                            ? 'text-green-500'
                            : result.score >= 60
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${
                        result.score >= 80
                          ? 'text-green-600 dark:text-green-400'
                          : result.score >= 60
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.score >= 80
                      ? 'Excellent match! Your resume aligns well with this job.'
                      : result.score >= 60
                      ? 'Good match with room for improvement.'
                      : 'Consider significant improvements to better match this role.'
                    }
                  </p>
                </div>
              </div>

              {/* Detailed Analysis */}
              {result.breakdown && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Detailed Analysis
                  </h3>
                  <div className="space-y-4">
                    {(['skill_match', 'semantic_similarity', 'ats_optimization'] as const).map(key => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <span>{result.breakdown![key]}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                          <div
                            className="h-2 bg-blue-500 rounded"
                            style={{ width: `${result.breakdown![key]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.weakRequirements && result.weakRequirements.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Weak Requirements</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                        {result.weakRequirements.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.evidence && result.evidence.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <h4 className="font-medium mb-2">Evidence</h4>
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <th className="pr-4">JD Requirement</th>
                            <th className="pr-4">Resume Evidence</th>
                            <th>Similarity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.evidence.map((ev, i) => (
                            <tr key={i} className="align-top">
                              <td className="pr-4 pb-2">{ev.jd}</td>
                              <td className="pr-4 pb-2">
                                <div className="flex items-start gap-2">
                                  <span>{ev.resume}</span>
                                  <button
                                    onClick={() => copyText(ev.resume)}
                                    className="text-blue-600 hover:text-blue-800"
                                    aria-label="Copy resume sentence"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                              <td className="pb-2">{Math.round(ev.similarity * 100)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Matched Skills */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Star className="h-5 w-5 text-green-500 mr-2" />
                  Matched Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvement Areas */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.improvementAreas.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Highlights */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Suggested Highlights
                </h3>
                <ul className="space-y-3">
                  {result.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={copyHighlights}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Highlights
                  </button>
                  <button
                    onClick={downloadResults}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .txt
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready for Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in your resume and job description, then click "Analyze Resume" to see detailed results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}