export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface GridCell {
  x: number; // 0 to 5
  y: number; // 0 to 7
}

export interface ProjectItem {
  id: string;
  title: string;
  type: TetrominoType;
  color: string;
  accentColor: string;
  tagline: string;
  description: string;
  tags: string[];
  solvedCells: GridCell[]; // coordinates in the 6-col board (W=6, H=8)
  metrics: string;
  githubUrl: string;
  liveUrl?: string;
  points: number;
}

export interface IdeaItem {
  id: string;
  title: string;
  type: TetrominoType;
  color: string;
  pitch: string;
  stage: 'CONCEPT' | 'PROTOTYPE' | 'LOOKING FOR CO-DEV' | 'CHAOTIC EXPERIMENT';
  resonances: number;
  tags: string[];
  githubRepo: string;
}

export interface LeaderboardEntry {
  rank: number;
  initials: string;
  score: number;
  name: string;
  role: string;
  date: string;
  contactUrl?: string;
}

export type PageView = 'projects' | 'idealab' | 'gameover' | 'docs';
