interface AnalyzeRequest {
  resumeText: string;
  jobDescription: string;
  role?: string;
  seniority?: string;
  emphasis?: string[];
}

interface AnalyzeResponse {
  id: string;
  createdAt: string;
  score: number;
  matchedSkills: string[];
  improvementAreas: string[];
  highlights: string[];
  resumePreview?: string;
  jobTitle?: string;
}

interface HistoryItem {
  id: string;
  createdAt: string;
  role: string;
  score: number;
}

// Mock data storage
let historyItems: AnalyzeResponse[] = [
  {
    id: '1',
    createdAt: '2024-01-15T14:30:00Z',
    score: 87,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Agile'],
    improvementAreas: [
      'Add more specific metrics and quantified achievements',
      'Include experience with CI/CD pipelines',
      'Highlight leadership experience more prominently'
    ],
    highlights: [
      'Led development of 3 React applications serving 50K+ users',
      'Implemented TypeScript migration reducing bugs by 40%',
      'Optimized AWS infrastructure cutting costs by 30%'
    ],
    resumePreview: 'Software Engineer with 5+ years experience...',
    jobTitle: 'Senior Frontend Developer'
  },
  {
    id: '2',
    createdAt: '2024-01-10T09:15:00Z',
    score: 72,
    matchedSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    improvementAreas: [
      'Add more ML project details',
      'Include cloud platform experience',
      'Strengthen statistical analysis skills'
    ],
    highlights: [
      'Built ML models achieving 95% accuracy on customer churn prediction',
      'Processed 1M+ records daily using Python data pipelines',
      'Collaborated with cross-functional teams on 5 ML projects'
    ],
    resumePreview: 'Data Scientist with 3 years experience...',
    jobTitle: 'Machine Learning Engineer'
  },
  {
    id: '3',
    createdAt: '2024-01-08T16:45:00Z',
    score: 94,
    matchedSkills: ['Product Management', 'Analytics', 'A/B Testing', 'Roadmapping'],
    improvementAreas: [
      'Add more startup experience details',
      'Include mobile product experience'
    ],
    highlights: [
      'Launched 8 product features with 90% user adoption rate',
      'Increased user engagement by 45% through data-driven decisions',
      'Managed product roadmap for $2M ARR product line'
    ],
    resumePreview: 'Product Manager with 4+ years experience...',
    jobTitle: 'Senior Product Manager'
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    await delay(2000); // Simulate API call
    
    // Generate realistic response based on input
    const skills = extractSkillsFromText(request.resumeText + ' ' + request.jobDescription);
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    const response: AnalyzeResponse = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      score,
      matchedSkills: skills.slice(0, 6),
      improvementAreas: [
        'Quantify achievements with specific metrics',
        'Add more relevant keywords from the job description',
        'Highlight leadership and collaboration skills',
        'Include certifications or continuous learning'
      ].slice(0, Math.floor(Math.random() * 2) + 2),
      highlights: generateHighlights(request.role || 'Professional'),
      resumePreview: request.resumeText.slice(0, 100) + '...',
      jobTitle: request.role || 'Target Position'
    };
    
    // Add to history
    historyItems.unshift(response);
    
    return response;
  },

  async getHistory(): Promise<{ items: HistoryItem[] }> {
    await delay(500);
    
    return {
      items: historyItems.map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        role: item.jobTitle || 'Unnamed Role',
        score: item.score
      }))
    };
  },

  async getHistoryItem(id: string): Promise<AnalyzeResponse | null> {
    await delay(300);
    
    return historyItems.find(item => item.id === id) || null;
  },

  async deleteHistoryItem(id: string): Promise<void> {
    await delay(300);
    
    historyItems = historyItems.filter(item => item.id !== id);
  }
};

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'Agile', 'Scrum', 'SQL', 'MongoDB', 'PostgreSQL',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Statistics',
    'Product Management', 'Analytics', 'A/B Testing', 'Roadmapping', 'Figma',
    'Leadership', 'Communication', 'Problem Solving', 'Project Management'
  ];
  
  const textLower = text.toLowerCase();
  return commonSkills.filter(skill => 
    textLower.includes(skill.toLowerCase())
  ).slice(0, 8);
}

function generateHighlights(role: string): string[] {
  const baseHighlights = [
    `Led cross-functional team of 5+ members on ${role.toLowerCase()} initiatives`,
    `Improved key performance metrics by 25-40% through strategic improvements`,
    `Successfully delivered 3+ major projects ahead of schedule and under budget`,
    `Mentored junior team members and contributed to knowledge sharing initiatives`
  ];
  
  return baseHighlights.slice(0, Math.floor(Math.random() * 2) + 2);
}