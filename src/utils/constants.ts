import type { ProjectItem, IdeaItem } from '../types';

export const TETRIS_COLS = 6;
export const TETRIS_ROWS = 8;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'decision-trees',
    title: 'DECISION-TREES',
    type: 'T',
    color: 'var(--tetris-purple)',
    accentColor: 'var(--border-glow)',
    tagline: 'Visualizer & Tree Generator for Sorting Algorithms',
    description: 'Tool that generates and visualizes decision trees for comparison-based algorithms. Implements automated export runners, interactive graph visualizers, and state trees for algorithm analysis.',
    tags: ['Python', 'Algorithms', 'Data Structures', 'Graphviz'],
    solvedCells: [
      { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 },
      { x: 2, y: 6 }
    ],
    metrics: 'Active // Open Source',
    githubUrl: 'https://github.com/clancydesilva/decision-trees',
    liveUrl: 'https://github.com/clancydesilva/decision-trees',
    points: 1500
  },
  {
    id: 'appace',
    title: 'APPACE',
    type: 'O',
    color: 'var(--tetris-yellow)',
    accentColor: 'var(--tetris-yellow)',
    tagline: 'Earn Screen Time As Hours Pass',
    description: 'Productivity and screen-time management system. Earn screen time as productive hours pass, accumulate balance in real time, and spend it intentionally when you choose.',
    tags: ['TypeScript', 'Productivity', 'State Machine', 'React'],
    solvedCells: [
      { x: 4, y: 7 }, { x: 5, y: 7 },
      { x: 4, y: 6 }, { x: 5, y: 6 }
    ],
    metrics: 'TypeScript Core',
    githubUrl: 'https://github.com/clancydesilva/appace',
    liveUrl: 'https://github.com/clancydesilva/appace',
    points: 1500
  },
  {
    id: 'pygame-game',
    title: 'PYGAME TURN-BASED',
    type: 'S',
    color: 'var(--tetris-green)',
    accentColor: 'var(--tetris-green)',
    tagline: 'Turn-Based Strategy & Terminal Engine',
    description: 'Python-based turn-based game played on the terminal and Pygame display. Features combat logic, turn sequencing, stat progression, procedural encounters, and retro sound cues.',
    tags: ['Python', 'Pygame', 'Game Dev', 'Turn-Based RPG'],
    solvedCells: [
      { x: 2, y: 5 }, { x: 3, y: 5 },
      { x: 1, y: 6 }, { x: 2, y: 6 }
    ],
    metrics: 'Turn-Based Engine',
    githubUrl: 'https://github.com/clancydesilva/pygame-game',
    liveUrl: 'https://github.com/clancydesilva/pygame-game',
    points: 1500
  },
  {
    id: 'game-start',
    title: 'GAME-START',
    type: 'I',
    color: 'var(--tetris-cyan)',
    accentColor: 'var(--tetris-cyan)',
    tagline: 'Personal Retro Game Portfolio',
    description: 'Interactive arcade developer portfolio built with React 19, TypeScript, and Vite. Features 6-column falling Tetris project pieces, Web Audio 8-bit sound synthesis, and Pac-Man page sweep transitions.',
    tags: ['React 19', 'TypeScript', 'Vite', 'Web Audio API'],
    solvedCells: [
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }
    ],
    metrics: '60 FPS Hardware Accel',
    githubUrl: 'https://github.com/clancydesilva/game-start',
    liveUrl: 'https://github.com/clancydesilva/game-start',
    points: 2000
  },
  {
    id: 'do-you-remember',
    title: 'DO-YOU-REMEMBER',
    type: 'Z',
    color: 'var(--tetris-red)',
    accentColor: 'var(--tetris-red)',
    tagline: 'Smart Task Manager & Reminders',
    description: 'To-do list and memory application with built-in reminders, priority tags, categorization filters, and clean state persistence for daily task tracking.',
    tags: ['TypeScript', 'Task Management', 'LocalStorage', 'UI/UX'],
    solvedCells: [
      { x: 4, y: 4 }, { x: 5, y: 4 },
      { x: 4, y: 5 }, { x: 3, y: 6 }
    ],
    metrics: 'Category Filters',
    githubUrl: 'https://github.com/clancydesilva/do-you-remember',
    liveUrl: 'https://github.com/clancydesilva/do-you-remember',
    points: 1500
  },
  {
    id: 'JavaScript-Web-Game',
    title: 'JS WEB ARCADE',
    type: 'J',
    color: 'var(--tetris-blue)',
    accentColor: 'var(--tetris-blue)',
    tagline: 'HTML5 Canvas Browser Game',
    description: 'Interactive browser-based game built with pure JavaScript and HTML5 Canvas without heavy external game libraries. Features custom collision detection, sprite animations, and score loops.',
    tags: ['JavaScript', 'HTML5 Canvas', 'Game Loop', 'Physics'],
    solvedCells: [
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
      { x: 0, y: 2 }
    ],
    metrics: 'Native HTML5 Canvas',
    githubUrl: 'https://github.com/clancydesilva/JavaScript-Web-Game',
    liveUrl: 'https://github.com/clancydesilva/JavaScript-Web-Game',
    points: 1500
  },
  {
    id: 'DB-Backed-Website',
    title: 'DB-BACKED PLATFORM',
    type: 'L',
    color: 'var(--tetris-emerald)',
    accentColor: 'var(--tetris-emerald)',
    tagline: 'Full-Stack Database Architecture',
    description: 'Full-stack database-backed web application featuring relational schema modeling, parameterized SQL queries, authentication session flows, and CRUD REST endpoints.',
    tags: ['Python', 'SQL', 'Databases', 'Full Stack'],
    solvedCells: [
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
      { x: 4, y: 2 }, { x: 5, y: 2 }
    ],
    metrics: 'Relational DB & SQL',
    githubUrl: 'https://github.com/clancydesilva/DB-Backed-Website',
    liveUrl: 'https://github.com/clancydesilva/DB-Backed-Website',
    points: 1800
  }
];

export const IDEAS: IdeaItem[] = [
  {
    id: 'weather-or-not',
    title: 'WEATHER-OR-NOT',
    type: 'L',
    color: 'var(--tetris-orange)',
    pitch: 'Variety of machine learning models trained on historical meteorological data to predict weather conditions, precipitation likelihood, temperature trends, and seasonal shifts.',
    stage: 'PROTOTYPE',
    resonances: 42,
    tags: ['Python', 'Machine Learning', 'Data Science', 'Scikit-Learn'],
    githubRepo: 'clancydesilva/weather-or-not'
  }
];
