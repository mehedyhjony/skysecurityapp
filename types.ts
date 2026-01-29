
export type TeamType = 'Red Team' | 'Blue Team';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Language = 'en' | 'bn';
export type AppView = 'landing' | 'profile' | 'red-team' | 'blue-team' | 'forum' | 'intelligence' | 'blog-post' | 'admin';

export interface User {
  id: string;
  codename: string;
  email: string;
  credits: number;
  status: 'Active' | 'Suspended';
  rank: string;
  joinedDate: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lab {
  name: string;
  objective: string;
  bnObjective?: string;
  hackerTechnique: string;
  bnHackerTechnique?: string;
  command?: string;
  rule?: string;
  instructions: string[];
  bnInstructions?: string[];
  quiz: QuizQuestion[];
  targetOs?: string;
  requiredTools?: string[];
  setupWalkthrough?: string;
}

export interface Module {
  id: string;
  title: string;
  category: string;
  type: TeamType;
  difficulty: Difficulty;
  credits: number;
  labs: Lab[];
}

export interface BlogPost {
  id: string;
  title: string;
  bnTitle: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  bnExcerpt: string;
  content: {
    overview: string;
    bnOverview: string;
    labSetup: string;
    bnLabSetup: string;
    attackSteps: string[];
    bnAttackSteps: string[];
    remediation: string;
    bnRemediation: string;
  };
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
}

export interface ForumComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  category: 'Exploit' | 'Defense' | 'General' | 'ZeroDay';
  timestamp: string;
  comments: ForumComment[];
}