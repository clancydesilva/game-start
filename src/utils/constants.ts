import type { ProjectItem, IdeaItem, LeaderboardEntry } from '../types';

export const TETRIS_COLS = 6;
export const TETRIS_ROWS = 8;

export const PROJECTS: ProjectItem[] = [
  {
    id: 'arcade-tetris',
    title: 'CYBER-TETRIS 6',
    type: 'I',
    color: '#00f0f0',
    accentColor: '#00b8b8',
    tagline: '6-Column Reactive Drop Engine',
    description: 'A hardware-accelerated 6-column arcade puzzle engine featuring dynamic scroll mechanics, solved-board state verification, and Web Audio 8-bit sound synthesizers. Zero external dependencies.',
    tags: ['React 19', 'TypeScript', 'Web Audio API', 'Vite'],
    solvedCells: [
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }
    ],
    metrics: '60 FPS / 0ms Lag',
    githubUrl: 'https://github.com/clancydesilva/game-start',
    liveUrl: '#',
    points: 1200
  },
  {
    id: 'algo-visualizer',
    title: 'ALGO-MAZE 3D',
    type: 'O',
    color: '#f0f000',
    accentColor: '#b8b800',
    tagline: 'A* Pathfinding & Maze Generator',
    description: 'Interactive visualization of graph exploration algorithms: Dijkstra, A*, and recursive backtracker maze generation with real-time heuristic cost mapping and node step debugging.',
    tags: ['TypeScript', 'Canvas 2D', 'Data Structures', 'Algorithms'],
    solvedCells: [
      { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 6 }, { x: 5, y: 6 }
    ],
    metrics: '10K Nodes / Sec',
    githubUrl: 'https://github.com/clancydesilva/decision-trees',
    liveUrl: '#',
    points: 800
  },
  {
    id: 'hyper-l-drive',
    title: 'HYPER-L ENGINE',
    type: 'I',
    color: '#00e5ff',
    accentColor: '#0099cc',
    tagline: 'High-Throughput Task Pipeline',
    description: 'Concurrent worker pool in TypeScript inspired by Go channels. Implements prioritized work-stealing, backpressure queues, and automatic retry backoffs with jitter.',
    tags: ['TypeScript', 'Concurrency', 'Web Workers', 'Queues'],
    solvedCells: [
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }
    ],
    metrics: '50K Ops / Sec',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1200
  },
  {
    id: 'p2p-arcade',
    title: 'P2P RETRO NET',
    type: 'L',
    color: '#ffaa00',
    accentColor: '#cc8800',
    tagline: 'Local-First WebRTC Multiplayer',
    description: 'Serverless peer-to-peer multiplayer state synchronization using WebRTC data channels, rollback netcode for latency hiding, and delta-compression for arcade games.',
    tags: ['WebRTC', 'P2P', 'CRDT', 'Rollback Netcode'],
    solvedCells: [
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 0, y: 4 }
    ],
    metrics: '<15ms Peer Latency',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1000
  },
  {
    id: 'chip8-emu',
    title: 'CHIP-8 VIRTUAL CPU',
    type: 'J',
    color: '#3388ff',
    accentColor: '#1a55cc',
    tagline: 'Cycle-Accurate Instruction Emulator',
    description: 'Full cycle-accurate implementation of the CHIP-8 CPU specification. Includes 35 opcodes, 4KB RAM, 64x32 monochrome display buffer, sound timers, and custom disassembly stepping.',
    tags: ['Emulation', 'Low-Level', 'Binary Ops', 'TypeScript'],
    solvedCells: [
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 5 }
    ],
    metrics: '100% Spec Pass',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1000
  },
  {
    id: 'quantum-o',
    title: 'QUANTUM-O STORAGE',
    type: 'O',
    color: '#b53df5',
    accentColor: '#8a1fbf',
    tagline: 'Local IndexedDB Key-Value Cache',
    description: 'Ultra-lightweight reactive IndexedDB key-value store with LRU eviction, automatic schema migration, and cross-tab BroadcastChannel state replication.',
    tags: ['IndexedDB', 'Storage', 'Reactive', 'Zero-Dep'],
    solvedCells: [
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }
    ],
    metrics: '0.8KB Minified',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 800
  },
  {
    id: 'neon-synth',
    title: 'NEON CHIP SYNTH',
    type: 'O',
    color: '#00ff66',
    accentColor: '#00b347',
    tagline: '8-Bit Waveform Audio Synthesizer',
    description: 'Web Audio API music studio with square, triangle, and noise wave generators, ADSR envelopes, arpeggiators, and custom export to MIDI and chiptune byte arrays.',
    tags: ['Web Audio', 'DSP', 'Sound Design', 'Chiptune'],
    solvedCells: [
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }
    ],
    metrics: '3 Polyphonic Tracks',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 800
  },
  {
    id: 'voxel-raster',
    title: 'VOXEL RASTER 8',
    type: 'L',
    color: '#ff7700',
    accentColor: '#c45b00',
    tagline: 'Software Raycaster Engine',
    description: 'Wolfenstein-style pseudo-3D DDA raycaster running entirely on HTML5 Canvas without WebGL. Features texture mapping, sprite billboard sorting, and lighting attenuation.',
    tags: ['Graphics', 'Raycasting', 'Math', 'Canvas'],
    solvedCells: [
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 2, y: 2 }
    ],
    metrics: '60 FPS Pure CPU',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1000
  },
  {
    id: 'pixel-craft',
    title: 'SPRITE FORGE PRO',
    type: 'J',
    color: '#0077ff',
    accentColor: '#004fc4',
    tagline: 'Pixel Art Animation Studio',
    description: 'Web-based pixel art editor with onion skinning, custom palette constraints (NES, GameBoy, PICO-8), isometric projection guides, and animated spritesheet exporter.',
    tags: ['Pixel Art', 'Canvas', 'Tooling', 'Export'],
    solvedCells: [
      { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 3 }
    ],
    metrics: 'PICO-8 Ready',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1000
  },
  {
    id: 'ai-heuristics',
    title: 'TETRIS AI AGENT',
    type: 'I',
    color: '#ff2255',
    accentColor: '#c7103a',
    tagline: 'Genetic Heuristic Game Solver',
    description: 'Autonomous Tetris player using genetic algorithm weights evaluating aggregate height, complete lines, holes, and bumpiness. Consistently reaches 500,000+ points in benchmark tests.',
    tags: ['AI', 'Genetic Algorithm', 'Game AI', 'Optimization'],
    solvedCells: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }
    ],
    metrics: '1.2M Max Score',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1200
  },
  {
    id: 'matrix-shield',
    title: 'MATRIX VAULT',
    type: 'O',
    color: '#ffcc00',
    accentColor: '#c49c00',
    tagline: 'WebCrypto Zero-Knowledge Vault',
    description: 'Client-side end-to-end encrypted password and notes store using AES-GCM-256 with PBKDF2 key derivation and WebAuthn hardware security key biometric integration.',
    tags: ['WebCrypto', 'Security', 'WebAuthn', 'AES-256'],
    solvedCells: [
      { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 4, y: 1 }, { x: 5, y: 1 }
    ],
    metrics: 'AES-GCM-256',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 800
  },
  {
    id: 'terminal-os',
    title: 'RETRO TERM CLI',
    type: 'I',
    color: '#ff00aa',
    accentColor: '#b8007a',
    tagline: 'Interactive UNIX Terminal Emulator',
    description: 'In-browser VT100 terminal emulator with virtual in-memory file system, command piping, globbing, grep, cat, vim clone, and easter egg arcade text games.',
    tags: ['CLI', 'Virtual FS', 'Parser', 'TypeScript'],
    solvedCells: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }
    ],
    metrics: 'POSIX Subset',
    githubUrl: 'https://github.com/clancydesilva',
    liveUrl: '#',
    points: 1200
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

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    initials: 'CDS',
    score: 999990,
    name: 'Clancy DeSilva',
    role: 'Creator & Architect',
    date: '2026-10-28',
    contactUrl: 'mailto:clancydesilva@example.com'
  },
  {
    rank: 2,
    initials: 'LIN',
    score: 842100,
    name: 'Linus Torvalds Fan',
    role: 'Kernel Hacker',
    date: '2026-10-24'
  },
  {
    rank: 3,
    initials: 'ADA',
    score: 720450,
    name: 'Ada Lovelace Club',
    role: 'Algorithm Pioneer',
    date: '2026-10-20'
  },
  {
    rank: 4,
    initials: 'CAR',
    score: 610000,
    name: 'Carmack Devotee',
    role: 'Raycast Speedrunner',
    date: '2026-10-18'
  },
  {
    rank: 5,
    initials: 'YOU',
    score: 450000,
    name: 'New Challenger',
    role: 'Arcade Guest',
    date: 'TODAY'
  }
];

export const SKILLS_LIST = [
  'REACT 19',
  'TYPESCRIPT',
  'VITE',
  'PYTHON',
  'WEB AUDIO API',
  'CANVAS 2D & SHADERS',
  'WEBRTC & P2P',
  'REST & GRAPHQL',
  'DOCKER & LINUX',
  'EMULATION & LOW-LEVEL',
  'SYSTEMS ARCHITECTURE'
];
