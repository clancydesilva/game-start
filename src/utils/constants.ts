import type { ProjectItem, IdeaItem } from '../types';

export const TETRIS_COLS = 6;
export const TETRIS_ROWS = 8;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'decision-trees',
    title: 'DECISION-TREES',
    type: 'T',
    color: '#c084fc',
    accentColor: '#9333ea',
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
    color: '#facc15',
    accentColor: '#ca8a04',
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
    id: 'weather-or-not',
    title: 'WEATHER-OR-NOT',
    type: 'L',
    color: '#fb923c',
    accentColor: '#ea580c',
    tagline: 'Machine Learning Weather Forecasting',
    description: 'Variety of machine learning models trained on historical meteorological data to predict weather conditions, precipitation likelihood, temperature trends, and seasonal shifts.',
    tags: ['Python', 'Machine Learning', 'Data Science', 'Scikit-Learn'],
    solvedCells: [
      { x: 0, y: 7 }, { x: 0, y: 6 }, { x: 0, y: 5 },
      { x: 1, y: 5 }
    ],
    metrics: 'ML Trained Models',
    githubUrl: 'https://github.com/clancydesilva/weather-or-not',
    liveUrl: 'https://github.com/clancydesilva/weather-or-not',
    points: 1500
  },
  {
    id: 'pygame-game',
    title: 'PYGAME TURN-BASED',
    type: 'S',
    color: '#4ade80',
    accentColor: '#16a34a',
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
    color: '#00f0f0',
    accentColor: '#00b8b8',
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
    color: '#f87171',
    accentColor: '#dc2626',
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
    color: '#38bdf8',
    accentColor: '#0284c7',
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
    type: 'O',
    color: '#34d399',
    accentColor: '#059669',
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
    id: 'webgpu-voxel-physics',
    title: 'WebGPU Voxel Sand Simulator',
    type: 'T',
    color: '#aa3bff',
    pitch: 'Falling sand physics simulator running on GPU compute shaders via WebGPU. Hundreds of thousands of particles (sand, water, fire, acid) interacting at 60 FPS.',
    stage: 'PROTOTYPE',
    resonances: 84,
    tags: ['WebGPU', 'WGSL', 'Compute Shaders', 'Cellular Automata'],
    githubRepo: 'clancydesilva/game-start'
  },
  {
    id: 'webrtc-gb-link',
    title: 'GameBoy Link Cable over WebRTC',
    type: 'I',
    color: '#00f0f0',
    pitch: 'Cycle-accurate serial link cable protocol emulation connecting two browser-based GameBoy emulators over low-latency WebRTC for Pokémon trade and battle.',
    stage: 'LOOKING FOR CO-DEV',
    resonances: 142,
    tags: ['Rust', 'WebAssembly', 'WebRTC', 'Emulation'],
    githubRepo: 'clancydesilva/game-start'
  },
  {
    id: 'audio-reactive-mesh',
    title: 'Chiptune Spectrogram Shaders',
    type: 'Z',
    color: '#ff2255',
    pitch: 'Real-time 3D frequency waterfall terrain generated from browser audio inputs using raymarched signed distance fields with retro CRT bloom.',
    stage: 'CHAOTIC EXPERIMENT',
    resonances: 67,
    tags: ['GLSL', 'Audio Analysis', 'Three.js', 'Chiptune'],
    githubRepo: 'clancydesilva/game-start'
  },
  {
    id: 'local-first-canvas',
    title: 'Offline Collaborative Pixel Canvas',
    type: 'O',
    color: '#f0f000',
    pitch: 'Infinite r/place style pixel art canvas with zero server requirements, syncs across local Wi-Fi peers via mDNS/WebRTC and resolves conflict with Yjs CRDTs.',
    stage: 'CONCEPT',
    resonances: 119,
    tags: ['Local-First', 'CRDT', 'Yjs', 'Canvas'],
    githubRepo: 'clancydesilva/game-start'
  },
  {
    id: 'arcade-ai-battle',
    title: 'Arcade RL Heuristic Arena',
    type: 'S',
    color: '#00ff66',
    pitch: 'Platform where developers upload 50-line JS heuristic bots that battle each other in live head-to-head Tetris and Snake tournaments in the browser.',
    stage: 'LOOKING FOR CO-DEV',
    resonances: 93,
    tags: ['AI Bots', 'Head-to-Head', 'Web Workers', 'Ranked'],
    githubRepo: 'clancydesilva/game-start'
  }
];
