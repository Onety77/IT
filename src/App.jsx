
import './App.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Twitter, ArrowUpRight, Trophy, Zap, MessageCircle, Heart, Repeat, Ban, TrendingUp, AlertTriangle, X, Terminal, Power, Copy, Check } from 'lucide-react';

/* --- 1. GLOBAL STYLES & ANIMATIONS --- */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Anton&family=Cinzel:wght@900&family=Comic+Neue:wght@700&family=Jacquard+12&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

    :root {
      --bg-color: #050505;
      --text-color: #eeeeee;
      --accent: #ccff00; /* Acid Green */
      --secondary: #ff00ff; /* Hot Magenta */
      --alert: #ff3333;
    }

    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      overflow-x: hidden;
      cursor: crosshair;
      user-select: none;
    }

    ::-webkit-scrollbar { width: 0px; background: transparent; }

    .font-anton { font-family: 'Anton', sans-serif; }
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-mono { font-family: 'Space Mono', monospace; }
    .font-comic { font-family: 'Comic Neue', cursive; }
    .font-gothic { font-family: 'Jacquard 12', cursive; }

    /* Noise Overlay */
    .noise {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: 50; opacity: 0.05;
      background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
    }

    /* Glitch Animation */
    .hover-glitch:hover {
      animation: glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
      color: var(--accent);
      text-shadow: 4px 4px 0px var(--secondary);
    }
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-4px, 4px); }
      40% { transform: translate(-4px, -4px); }
      60% { transform: translate(4px, 4px); }
      80% { transform: translate(4px, -4px); }
      100% { transform: translate(0); }
    }

    /* Elastic Scroll Effect */
    .elastic-content {
      transition: transform 0.1s cubic-bezier(0.1, 0.7, 1.0, 0.1);
      will-change: transform;
    }

    /* Tweet Cards */
    .tweet-card {
      transition: all 0.3s ease;
      transform-style: preserve-3d;
      background: #0a0a0a;
    }
    .tweet-card:hover {
      transform: scale(1.02) rotateZ(-1deg);
      box-shadow: 8px 8px 0px var(--accent);
      z-index: 10;
      background: #111;
      border-color: var(--accent);
    }

    /* Click Explosion */
    @keyframes pop-fade {
      0% { transform: translate(-50%, -50%) scale(0.5) rotate(0deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.5) rotate(var(--rot)); opacity: 0; }
    }
    .click-w {
      position: fixed; pointer-events: none; z-index: 100;
      animation: pop-fade 0.6s ease-out forwards;
      font-weight: 900; text-shadow: 0 0 10px var(--accent);
    }

    /* Victory Flash */
    @keyframes flash-screen {
      0% { filter: invert(0); } 10% { filter: invert(1); } 30% { filter: invert(0); } 50% { filter: invert(1); } 100% { filter: invert(0); }
    }
    .victory-mode { animation: flash-screen 0.5s ease-out; }

    /* Cursor Trail */
    .trail-w {
      position: fixed; pointer-events: none; z-index: 9999;
      font-weight: bold; color: var(--accent);
      font-family: 'Space Mono', monospace;
      animation: trail-fade 0.8s forwards;
    }
    @keyframes trail-fade {
      0% { opacity: 0.8; transform: scale(1) rotate(0deg); }
      100% { opacity: 0; transform: scale(0.2) rotate(180deg); }
    }

    /* ARENA MODE: W-VORTEX STYLES */
    .arena-container {
      perspective: 1000px;
      overflow: hidden;
      background: #000;
    }
    .tunnel-w {
      position: absolute;
      top: 50%; left: 50%;
      transform-style: preserve-3d;
      font-family: 'Anton', sans-serif;
      color: transparent;
      -webkit-text-stroke: 1px var(--accent);
    }
    @keyframes tunnel-move {
      0% { transform: translate(-50%, -50%) translateZ(-1000px) rotate(0deg); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translate(-50%, -50%) translateZ(1000px) rotate(180deg); opacity: 0; }
    }
    
    /* Slide Animation for Facts */
    @keyframes slide-in-right {
        0% { transform: translateX(20px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    .fact-slide {
        animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
  `}</style>
);

/* --- 2. SOUND ENGINE (PROCEDURAL AUDIO) --- */
const SoundEngine = {
    ctx: null,
    arenaOsc: null,
    arenaGain: null,
    
    init: () => {
        if (!SoundEngine.ctx) {
            SoundEngine.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (SoundEngine.ctx && SoundEngine.ctx.state === 'suspended') {
            SoundEngine.ctx.resume().catch(() => {});
        }
    },
    playTone: (freq, type, duration, vol = 0.1) => {
        if (!SoundEngine.ctx) return;
        const osc = SoundEngine.ctx.createOscillator();
        const gain = SoundEngine.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, SoundEngine.ctx.currentTime);
        gain.gain.setValueAtTime(vol, SoundEngine.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, SoundEngine.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(SoundEngine.ctx.destination);
        osc.start();
        osc.stop(SoundEngine.ctx.currentTime + duration);
    },
    click: () => {
        SoundEngine.init();
        SoundEngine.playTone(150, 'square', 0.1);
        SoundEngine.playTone(100, 'sawtooth', 0.15);
    },
    glitch: () => {
        SoundEngine.init();
        if (!SoundEngine.ctx) return;
        
        // NEW: Harsh, rapid stutter for the JUST WIN text
        [0, 0.05, 0.1].forEach(offset => {
             SoundEngine.playTone(800 + Math.random() * 500, 'sawtooth', 0.04, 0.05);
        });
    },
    // UPDATED: Faster Loop for Arena
    startArenaLoop: () => {
        SoundEngine.init();
        if (!SoundEngine.ctx) return;
        if (SoundEngine.arenaOsc) {
            SoundEngine.stopArenaLoop();
        }

        const osc = SoundEngine.ctx.createOscillator();
        const gain = SoundEngine.ctx.createGain();
        
        // Start audible immediately
        osc.frequency.setValueAtTime(60, SoundEngine.ctx.currentTime);
        // Ramp up faster (15 seconds instead of 60) for immediate tension
        osc.frequency.exponentialRampToValueAtTime(400, SoundEngine.ctx.currentTime + 15);
        
        // Louder start
        gain.gain.setValueAtTime(0.2, SoundEngine.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, SoundEngine.ctx.currentTime + 15);
        
        osc.connect(gain);
        gain.connect(SoundEngine.ctx.destination);
        osc.start();
        
        SoundEngine.arenaOsc = osc;
        SoundEngine.arenaGain = gain;
    },
    stopArenaLoop: () => {
        if (SoundEngine.arenaOsc && SoundEngine.ctx) {
            const now = SoundEngine.ctx.currentTime;
            SoundEngine.arenaGain.gain.cancelScheduledValues(now);
            SoundEngine.arenaGain.gain.setValueAtTime(SoundEngine.arenaGain.gain.value, now);
            SoundEngine.arenaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            SoundEngine.arenaOsc.stop(now + 0.1);
            
            SoundEngine.arenaOsc = null;
            SoundEngine.arenaGain = null;
        }
    }
};

/* --- 3. DATA: CONTENT MANAGEMENT --- */
const MOCK_TWEETS = [
  {
    id: 1,
    handle: "@WinnerMindset",
    content: "If you aren't collecting Ws, you are functionally invisible. The W is not a letter, it is a lifestyle choice.",
    likes: "8.2k", retweets: "4.1k", font: "font-mono", rotation: "rotate-1",
    url: "https://twitter.com" 
  },
  {
    id: 2,
    handle: "@TypographyNerd",
    content: "Consider the geometry of the W. Two Vs connected. Double victory. It is structurally the strongest letter in the alphabet.",
    likes: "12k", retweets: "900", font: "font-cinzel", rotation: "-rotate-2",
    url: "https://twitter.com" 
  },
  {
    id: 3,
    handle: "@CryptoDegenz",
    content: "$W ticker is live. We are not going to the moon. We are going to a completely different dimension where gravity is optional.",
    likes: "44k", retweets: "12k", font: "font-anton", rotation: "rotate-3", highlight: true,
    url: "https://twitter.com" 
  },
  {
    id: 101,
    handle: "@NoLs_Official",
    content: "WARNING: Holding Ls is strictly prohibited in this sector. Violators will be mocked.",
    likes: "99k", retweets: "12k", font: "font-mono", rotation: "rotate-2", isAlert: true,
    url: "https://twitter.com" 
  },
  {
    id: 4,
    handle: "@PhilosophyBot",
    content: "L is merely a W waiting to happen. Invert your perspective. Literally turn your phone upside down.",
    likes: "300", retweets: "50", font: "font-gothic", rotation: "-rotate-1",
    url: "https://twitter.com" 
  },
  {
    id: 5,
    handle: "@DesignCrimes",
    content: "Why stick to grid systems when you can just scatter Ws everywhere? Chaos is the new UX.",
    likes: "9k", retweets: "2k", font: "font-comic", rotation: "rotate-6",
    url: "https://twitter.com" 
  },
  {
    id: 102,
    handle: "@ChartGazer",
    content: "I've been staring at the 1m candle for 6 hours. It only goes up. Is my monitor broken or are we just winning that hard?",
    likes: "1.2k", retweets: "400", font: "font-mono", rotation: "-rotate-2",
    url: "https://twitter.com" 
  },
  {
    id: 6,
    handle: "@AbstractArtist",
    content: "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    likes: "100k", retweets: "50k", font: "font-mono", rotation: "-rotate-3",
    url: "https://twitter.com" 
  },
  {
    id: 103,
    handle: "@VibeCheck",
    content: "Just sold my car for more $W. Walking is healthier anyway. W.",
    likes: "555", retweets: "111", font: "font-comic", rotation: "rotate-1",
    url: "https://twitter.com" 
  },
  {
    id: 104,
    handle: "@SystemAdmin",
    content: "root@server:~$ sudo apt-get remove --purge lose_condition.exe \n> Success. Only winning remains.",
    likes: "1337", retweets: "404", font: "font-mono", rotation: "rotate-0", code: true,
    url: "https://twitter.com" 
  },
  {
    id: 105,
    handle: "@FutureOracle",
    content: "In 2030, $W will be the global reserve currency. Coffee will cost 0.00001 W.",
    likes: "88k", retweets: "22k", font: "font-cinzel", rotation: "-rotate-1",
    url: "https://twitter.com" 
  },
  {
    id: 106,
    handle: "@Anon442",
    content: "Instructions unclear, I now own 100% of the supply.",
    likes: "1", retweets: "0", font: "font-gothic", rotation: "rotate-3",
    url: "https://twitter.com" 
  }
];

// NEW: DID YOU KNOW FACTS ARRAY
const DID_YOU_KNOW_FACTS = [
    "Winning is 10% luck, 20% skill, and 70% holding $W until your hands turn into diamonds.",
    "Scientists have confirmed that the shape of the letter 'W' is aerodynamically incapable of losing.",
    "If you type 'W' 10,000 times, your portfolio automatically goes up. (Not financial advice).",
    "The letter 'L' was invented by the government to keep you humble. Reject it.",
    "In ancient Rome, gladiators didn't say 'goodbye', they whispered 'W' and walked away backwards.",
    "Your keyboard has a W key for a reason. Use it or lose it.",
    "Gravity is just the earth trying to give you an L. Jump to assert dominance.",
    "A double U is literally twice the value of a single U. Do the math.",
    "This website consumes 0% electricity and 100% pure adrenaline.",
    "Fact: 99% of people who don't buy $W eventually regret it in the metaverse."
];

/* --- 4. SUB-COMPONENTS --- */

// CONTRACT ADDRESS COMPONENT
const ContractAddress = () => {
    const [copied, setCopied] = useState(false);
    // EDIT CA HERE
    const ca = "0xW000000000000000000000000000000000000000"; 

    const handleCopy = (e) => {
        e.stopPropagation();
        SoundEngine.click();
        
        const fallbackCopy = () => {
             const textArea = document.createElement("textarea");
             textArea.value = ca;
             document.body.appendChild(textArea);
             textArea.select();
             try {
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
             } catch (err) {
                console.error('Fallback copy failed', err);
             }
             document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(ca)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch((err) => {
                    console.warn('Clipboard API blocked, using fallback', err);
                    fallbackCopy();
                });
        } else {
             fallbackCopy();
        }
    };

    return (
        <div 
            className="group relative flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-4 py-2 mt-8 mb-4 font-mono text-xs md:text-sm text-neutral-400 hover:border-[var(--accent)] hover:text-white transition-all cursor-pointer select-none overflow-hidden"
            onClick={handleCopy}
            // Removed onMouseEnter hover sound
        >
            <span className="text-[var(--accent)] font-bold">CA:</span>
            <span className="truncate max-w-[150px] md:max-w-xs">{ca}</span>
            <div className="ml-2 w-px h-4 bg-neutral-700 group-hover:bg-[var(--accent)]"></div>
            {copied ? <Check size={16} className="text-[var(--accent)]" /> : <Copy size={16} />}
            
            {copied && (
                <div className="absolute inset-0 bg-[var(--accent)] text-black flex items-center justify-center font-bold tracking-widest animate-in slide-in-from-bottom duration-200">
                    COPIED
                </div>
            )}
        </div>
    );
};

// Dominance Index
const DominanceIndex = ({ score }) => (
  <div className="fixed bottom-4 right-4 z-[9000] bg-black border border-[var(--accent)] p-3 font-mono text-xs md:text-sm text-[var(--accent)] uppercase tracking-wider select-none shadow-[0_0_10px_rgba(204,255,0,0.3)]">
    <span className="animate-pulse mr-2">●</span>
    Dominance Index: <span className="font-bold text-white">{score}</span> Ws
  </div>
);

// Cursor Trail
const CursorTrail = () => {
  const [trail, setTrail] = useState([]);
  useEffect(() => {
    const handleMove = (e) => {
      if (Math.random() > 0.7) {
        const id = Date.now();
        setTrail(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setTrail(prev => prev.filter(p => p.id !== id)), 800);
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return (
    <>{trail.map(p => (<div key={p.id} className="trail-w text-sm" style={{ left: p.x, top: p.y }}>W</div>))}</>
  );
};

// Floating Background Ws
const FloatingWs = () => {
  const [elements, setElements] = useState([]);
  useEffect(() => {
    const fonts = ['font-anton', 'font-cinzel', 'font-mono', 'font-comic', 'font-gothic'];
    const newElements = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      font: fonts[Math.floor(Math.random() * fonts.length)],
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.2 + 0.05
    }));
    setElements(newElements);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map(el => (
        <div key={el.id} className={`absolute text-white select-none ${el.font}`} style={{
            left: `${el.x}%`, top: `${el.y}%`, fontSize: `${el.size}rem`,
            transform: `rotate(${el.rotation}deg)`, opacity: el.opacity,
            transition: 'top 20s linear, left 20s linear',
          }}>W</div>
      ))}
    </div>
  );
};

// Velocity Marquee
const VelocityMarquee = () => {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef();
  const lastScrollY = useRef(0);

  const animate = useCallback(() => {
    const currentScrollY = window.scrollY;
    const velocity = Math.abs(currentScrollY - lastScrollY.current);
    lastScrollY.current = currentScrollY;
    const speed = 2 + (velocity * 0.5); 
    setOffset(prev => (prev - speed) % 1000); 
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <div className="relative w-full overflow-hidden bg-[var(--accent)] py-2 md:py-4 -rotate-2 scale-110 z-10 border-y-4 border-black mb-12">
      <div className="whitespace-nowrap font-black font-anton text-4xl md:text-6xl text-black flex items-center gap-8" style={{ transform: `translateX(${offset}px)` }}>
        {[...Array(20)].map((_, i) => (
          <span key={i} className="flex items-center gap-4">NO Ls ALLOWED <Ban size={32} strokeWidth={4} /></span>
        ))}
      </div>
    </div>
  );
};

// Tweet Card
const TweetCard = ({ tweet }) => {
  return (
    <div 
      className={`tweet-card w-full max-w-md mx-auto border border-neutral-800 p-6 mb-8 cursor-pointer relative overflow-hidden group ${tweet.rotation}`}
      onClick={(e) => {
          e.stopPropagation();
          SoundEngine.click();
          window.open(tweet.url, '_blank');
      }}
      // Removed onMouseEnter hover sound
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${tweet.isAlert ? 'bg-red-600 text-white' : 'bg-neutral-800 group-hover:bg-[var(--accent)] group-hover:text-black'}`}>
            {tweet.isAlert ? <AlertTriangle size={20} /> : <span className="font-bold text-xl">W</span>}
          </div>
          <div className="flex flex-col">
            <span className={`font-bold group-hover:text-[var(--accent)] ${tweet.isAlert ? 'text-red-500' : 'text-neutral-200'}`}>{tweet.handle}</span>
            <span className="text-xs text-neutral-500">@project_w</span>
          </div>
        </div>
        <Twitter className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 transition-colors" />
      </div>
      
      {tweet.code ? (
        <div className="bg-black p-3 rounded border border-neutral-800 mb-4 font-mono text-xs text-green-400">{tweet.content}</div>
      ) : (
        <p className={`text-xl mb-6 text-neutral-100 leading-snug ${tweet.font} ${tweet.highlight ? 'text-[var(--accent)]' : ''}`}>{tweet.content}</p>
      )}
      
      <div className="flex justify-between text-neutral-500 text-sm font-mono relative z-10">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 hover:text-pink-500 transition-colors"><MessageCircle size={14} /> 22</span>
          <span className="flex items-center gap-1 hover:text-green-500 transition-colors"><Repeat size={14} /> {tweet.retweets}</span>
          <span className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart size={14} /> {tweet.likes}</span>
        </div>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">VIEW <ArrowUpRight size={14} /></span>
      </div>
    </div>
  );
};

// LIVE CHART SECTION
const LiveChartSection = () => {
    return (
        <div className="break-inside-avoid w-full border-4 border-[var(--accent)] bg-black mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 bg-[var(--accent)] text-black font-mono text-xs font-bold px-2 py-1 z-20">
                LIVE MARKET DATA // $W
            </div>
            <div className="w-full h-[400px] flex items-center justify-center bg-neutral-900 text-neutral-500 font-mono text-center p-8">
                 <div className="flex flex-col items-center animate-pulse">
                    <TrendingUp size={48} className="mb-4 text-[var(--accent)]"/>
                    <p>CHART FEED INITIALIZING...</p>
                    <p className="text-xs mt-2 opacity-50">(Edit code to insert Dexscreener Iframe)</p>
                 </div>
            </div>
        </div>
    );
};

// NEW: Interactive "Did You Know" Component
const DidYouKnowBox = () => {
    const [index, setIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const handleNext = (e) => {
        e.stopPropagation();
        SoundEngine.click();
        setAnimating(false);
        // Force reflow for animation restart
        setTimeout(() => {
            setIndex((prev) => (prev + 1) % DID_YOU_KNOW_FACTS.length);
            setAnimating(true);
        }, 10);
    };

    return (
        <div 
             className="break-inside-avoid p-8 bg-[var(--accent)] text-black mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-300 cursor-pointer select-none relative overflow-hidden group"
             // Removed onMouseEnter hover sound
             onClick={handleNext}
        >
             <div className="absolute top-2 right-2 opacity-50"><Repeat size={16}/></div>
             <h3 className="font-anton text-4xl uppercase mb-2">Did you know?</h3>
             <p className={`font-mono text-sm leading-relaxed ${animating ? 'fact-slide' : ''}`} key={index}>
                {DID_YOU_KNOW_FACTS[index]}
             </p>
             <p className="text-[10px] font-bold mt-4 opacity-60 uppercase tracking-widest">TAP FOR MORE TRUTH</p>
        </div>
    );
};


// REPLACEMENT COMPONENT: THE NEURAL MAZE (Escape the Construct)
const ArenaOverlay = ({ onExit }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const [score, setScore] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [level, setLevel] = useState(1);
    
    // Mutable State
    const state = useRef({
        player: { x: 0, y: 0, vx: 0, vy: 0, radius: 8, trail: [] },
        camera: { x: 0, y: 0, shake: 0 },
        walls: [],
        enemies: [],
        particles: [],
        glitchLines: [],
        maze: null,
        cellSize: 80,
        mazeSize: 15,
        goal: null,
        gameOver: false,
        invulnerable: 0,
        keys: {},
        time: 0,
        levelStartTime: 0
    });

    // Generate Maze using Recursive Backtracker
    const generateMaze = (size) => {
        const maze = Array(size).fill().map(() => Array(size).fill(0b1111)); // All walls
        const stack = [];
        const start = { x: 0, y: 0 };
        let current = start;
        maze[0][0] |= 0b10000; // Mark visited
        
        const dirs = [
            { dx: 0, dy: -1, bit: 0b0001, opp: 0b0100 }, // North
            { dx: 1, dy: 0, bit: 0b0010, opp: 0b1000 },  // East
            { dx: 0, dy: 1, bit: 0b0100, opp: 0b0001 },  // South
            { dx: -1, dy: 0, bit: 0b1000, opp: 0b0010 }  // West
        ];
        
        while (true) {
            const neighbors = [];
            dirs.forEach(d => {
                const nx = current.x + d.dx;
                const ny = current.y + d.dy;
                if (nx >= 0 && nx < size && ny >= 0 && ny < size && !(maze[ny][nx] & 0b10000)) {
                    neighbors.push({ ...d, nx, ny });
                }
            });
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                maze[current.y][current.x] &= ~next.bit;
                maze[next.ny][next.nx] &= ~next.opp;
                maze[next.ny][next.nx] |= 0b10000;
                stack.push(current);
                current = { x: next.nx, y: next.ny };
            } else if (stack.length > 0) {
                current = stack.pop();
            } else {
                break;
            }
        }
        
        return maze;
    };

    // Build Wall Segments from Maze
    const buildWalls = (maze, cellSize) => {
        const walls = [];
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const cell = maze[y][x];
                const px = x * cellSize;
                const py = y * cellSize;
                
                if (cell & 0b0001) walls.push({ x1: px, y1: py, x2: px + cellSize, y2: py }); // North
                if (cell & 0b0010) walls.push({ x1: px + cellSize, y1: py, x2: px + cellSize, y2: py + cellSize }); // East
                if (cell & 0b0100) walls.push({ x1: px, y1: py + cellSize, x2: px + cellSize, y2: py + cellSize }); // South
                if (cell & 0b1000) walls.push({ x1: px, y1: py, x2: px, y2: py + cellSize }); // West
            }
        }
        return walls;
    };

    // Spawn Enemies
    const spawnEnemies = (count, cellSize, mazeSize, playerPos) => {
        const enemies = [];
        for (let i = 0; i < count; i++) {
            let ex, ey;
            do {
                ex = (Math.floor(Math.random() * mazeSize) + 0.5) * cellSize;
                ey = (Math.floor(Math.random() * mazeSize) + 0.5) * cellSize;
            } while (Math.hypot(ex - playerPos.x, ey - playerPos.y) < cellSize * 3);
            
            enemies.push({
                x: ex,
                y: ey,
                vx: 0,
                vy: 0,
                radius: 6,
                speed: 0.8 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2,
                huntCooldown: Math.random() * 60
            });
        }
        return enemies;
    };

    // Initialize Level
    const initLevel = (levelNum) => {
        const size = Math.min(15 + levelNum * 2, 30);
        const cellSize = 80;
        const maze = generateMaze(size);
        const walls = buildWalls(maze, cellSize);
        
        state.current.mazeSize = size;
        state.current.cellSize = cellSize;
        state.current.maze = maze;
        state.current.walls = walls;
        state.current.player.x = cellSize * 0.5;
        state.current.player.y = cellSize * 0.5;
        state.current.player.vx = 0;
        state.current.player.vy = 0;
        state.current.player.trail = [];
        state.current.goal = { 
            x: (size - 0.5) * cellSize, 
            y: (size - 0.5) * cellSize 
        };
        state.current.enemies = spawnEnemies(
            2 + levelNum * 2, 
            cellSize, 
            size, 
            state.current.player
        );
        state.current.gameOver = false;
        state.current.invulnerable = 120;
        state.current.levelStartTime = Date.now();
        state.current.glitchLines = [];
        state.current.particles = [];
    };

    useEffect(() => {
        if (typeof SoundEngine !== 'undefined') {
            SoundEngine.init();
            SoundEngine.startArenaLoop(); 
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        initLevel(1);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleKeyDown = (e) => {
            state.current.keys[e.key.toLowerCase()] = true;
            if (state.current.gameOver && e.key === 'r') {
                setDeaths(d => d + 1);
                initLevel(level);
            }
        };

        const handleKeyUp = (e) => {
            state.current.keys[e.key.toLowerCase()] = false;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // --- GAME LOOP ---
        const render = () => {
            const s = state.current;
            s.time++;
            
            if (!s.gameOver) {
                // Player Movement
                const accel = 0.8;
                const friction = 0.88;
                const maxSpeed = 4;
                
                if (s.keys['w'] || s.keys['arrowup']) s.player.vy -= accel;
                if (s.keys['s'] || s.keys['arrowdown']) s.player.vy += accel;
                if (s.keys['a'] || s.keys['arrowleft']) s.player.vx -= accel;
                if (s.keys['d'] || s.keys['arrowright']) s.player.vx += accel;
                
                s.player.vx *= friction;
                s.player.vy *= friction;
                
                const speed = Math.hypot(s.player.vx, s.player.vy);
                if (speed > maxSpeed) {
                    s.player.vx = (s.player.vx / speed) * maxSpeed;
                    s.player.vy = (s.player.vy / speed) * maxSpeed;
                }
                
                // Collision Detection with Walls
                let newX = s.player.x + s.player.vx;
                let newY = s.player.y + s.player.vy;
                
                for (const wall of s.walls) {
                    if (lineCircleCollision(wall, { x: newX, y: newY, r: s.player.radius })) {
                        const nx = wall.y2 - wall.y1;
                        const ny = -(wall.x2 - wall.x1);
                        const len = Math.hypot(nx, ny);
                        const dot = (s.player.vx * nx + s.player.vy * ny) / len;
                        s.player.vx -= (2 * dot * nx) / len;
                        s.player.vy -= (2 * dot * ny) / len;
                        newX = s.player.x;
                        newY = s.player.y;
                        break;
                    }
                }
                
                s.player.x = newX;
                s.player.y = newY;
                
                // Trail
                s.player.trail.push({ x: s.player.x, y: s.player.y, life: 20 });
                s.player.trail = s.player.trail.filter(t => t.life-- > 0);
                
                // Enemy AI
                if (s.invulnerable > 0) s.invulnerable--;
                
                s.enemies.forEach(e => {
                    e.phase += 0.05;
                    e.huntCooldown--;
                    
                    // Hunt player with pathfinding-like behavior
                    const dx = s.player.x - e.x;
                    const dy = s.player.y - e.y;
                    const dist = Math.hypot(dx, dy);
                    
                    if (e.huntCooldown <= 0 && dist > 20) {
                        const angle = Math.atan2(dy, dx) + Math.sin(e.phase) * 0.3;
                        e.vx += Math.cos(angle) * e.speed * 0.2;
                        e.vy += Math.sin(angle) * e.speed * 0.2;
                    }
                    
                    e.vx *= 0.95;
                    e.vy *= 0.95;
                    
                    let eNewX = e.x + e.vx;
                    let eNewY = e.y + e.vy;
                    
                    // Enemy wall collision
                    for (const wall of s.walls) {
                        if (lineCircleCollision(wall, { x: eNewX, y: eNewY, r: e.radius })) {
                            e.vx *= -0.8;
                            e.vy *= -0.8;
                            e.huntCooldown = 60;
                            eNewX = e.x;
                            eNewY = e.y;
                            break;
                        }
                    }
                    
                    e.x = eNewX;
                    e.y = eNewY;
                    
                    // Player collision
                    if (s.invulnerable <= 0 && Math.hypot(e.x - s.player.x, e.y - s.player.y) < e.radius + s.player.radius) {
                        s.gameOver = true;
                        s.camera.shake = 30;
                        
                        // Death explosion
                        for (let i = 0; i < 50; i++) {
                            s.particles.push({
                                x: s.player.x,
                                y: s.player.y,
                                vx: (Math.random() - 0.5) * 10,
                                vy: (Math.random() - 0.5) * 10,
                                life: 60,
                                size: Math.random() * 3
                            });
                        }
                        
                        // Glitch effect
                        for (let i = 0; i < 20; i++) {
                            s.glitchLines.push({
                                x: Math.random() * s.mazeSize * s.cellSize,
                                y: Math.random() * s.mazeSize * s.cellSize,
                                width: Math.random() * 200,
                                height: Math.random() * 5,
                                life: 30
                            });
                        }
                    }
                });
                
                // Check Goal
                if (Math.hypot(s.player.x - s.goal.x, s.player.y - s.goal.y) < 20) {
                    const timeBonus = Math.max(0, 10000 - (Date.now() - s.levelStartTime));
                    setScore(sc => sc + 1000 + Math.floor(timeBonus / 10));
                    setLevel(l => l + 1);
                    initLevel(level + 1);
                    if (typeof SoundEngine !== 'undefined') SoundEngine.click();
                }
            }
            
            // Camera
            s.camera.x = s.player.x - width / 2;
            s.camera.y = s.player.y - height / 2;
            
            if (s.camera.shake > 0) {
                s.camera.shake--;
                s.camera.x += (Math.random() - 0.5) * s.camera.shake;
                s.camera.y += (Math.random() - 0.5) * s.camera.shake;
            }
            
            // === RENDERING ===
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
            
            ctx.save();
            ctx.translate(-s.camera.x, -s.camera.y);
            
            // Grid (Matrix aesthetic)
            ctx.strokeStyle = 'rgba(0, 255, 100, 0.1)';
            ctx.lineWidth = 1;
            const gridSize = s.cellSize / 4;
            for (let x = 0; x < s.mazeSize * s.cellSize; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, s.mazeSize * s.cellSize);
                ctx.stroke();
            }
            for (let y = 0; y < s.mazeSize * s.cellSize; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(s.mazeSize * s.cellSize, y);
                ctx.stroke();
            }
            
            // Walls
            ctx.strokeStyle = '#00ff66';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff66';
            s.walls.forEach(w => {
                ctx.beginPath();
                ctx.moveTo(w.x1, w.y1);
                ctx.lineTo(w.x2, w.y2);
                ctx.stroke();
            });
            ctx.shadowBlur = 0;
            
            // Goal
            ctx.fillStyle = '#ffff00';
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#ffff00';
            ctx.beginPath();
            ctx.arc(s.goal.x, s.goal.y, 15 + Math.sin(s.time * 0.1) * 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Player Trail
            s.player.trail.forEach((t, i) => {
                const alpha = t.life / 20;
                ctx.fillStyle = `rgba(0, 200, 255, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(t.x, t.y, s.player.radius * alpha, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Player
            if (!s.gameOver) {
                const invulnFlash = s.invulnerable > 0 && s.invulnerable % 10 < 5;
                if (!invulnFlash) {
                    ctx.fillStyle = '#00ccff';
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = '#00ccff';
                    ctx.beginPath();
                    ctx.arc(s.player.x, s.player.y, s.player.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
            
            // Enemies
            s.enemies.forEach(e => {
                ctx.fillStyle = '#ff0066';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff0066';
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Eye effect
                const eyeX = e.x + Math.cos(Math.atan2(s.player.y - e.y, s.player.x - e.x)) * 3;
                const eyeY = e.y + Math.sin(Math.atan2(s.player.y - e.y, s.player.x - e.x)) * 3;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
            // Particles
            s.particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.life--;
                
                const alpha = p.life / 60;
                ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                
                if (p.life <= 0) s.particles.splice(i, 1);
            });
            
            // Glitch lines
            s.glitchLines.forEach((g, i) => {
                g.life--;
                ctx.fillStyle = `rgba(255, 0, 100, ${g.life / 30})`;
                ctx.fillRect(g.x, g.y, g.width, g.height);
                if (g.life <= 0) s.glitchLines.splice(i, 1);
            });
            
            ctx.restore();
            
            // === HUD ===
            ctx.fillStyle = '#00ff66';
            ctx.font = '16px monospace';
            ctx.fillText(`LEVEL: ${level}`, 20, 30);
            ctx.fillText(`SCORE: ${score}`, 20, 55);
            ctx.fillText(`DEATHS: ${deaths}`, 20, 80);
            
            if (s.invulnerable > 0) {
                ctx.fillStyle = '#00ccff';
                ctx.fillText(`SHIELD: ${Math.ceil(s.invulnerable / 60)}s`, 20, 105);
            }
            
            if (s.gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#ff0066';
                ctx.font = 'bold 48px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('TERMINATED', width / 2, height / 2 - 40);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '20px monospace';
                ctx.fillText('Press R to REBOOT', width / 2, height / 2 + 20);
                ctx.textAlign = 'left';
            }
            
            // Instructions (first 300 frames)
            if (s.time < 300 && !s.gameOver) {
                ctx.fillStyle = 'rgba(0, 255, 100, 0.8)';
                ctx.font = '14px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('WASD / ARROWS to move | Reach yellow exit | Avoid red sentinels', width / 2, height - 30);
                ctx.textAlign = 'left';
            }
            
            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (typeof SoundEngine !== 'undefined') SoundEngine.stopArenaLoop();
        };
    }, [level, score, deaths]);

    // Line-Circle Collision Helper
    const lineCircleCollision = (line, circle) => {
        const { x1, y1, x2, y2 } = line;
        const { x, y, r } = circle;
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        
        const dot = ((x - x1) * dx + (y - y1) * dy) / (len * len);
        const closestX = x1 + dot * dx;
        const closestY = y1 + dot * dy;
        
        const onSegment = dot >= 0 && dot <= 1;
        if (!onSegment) {
            const d1 = Math.hypot(x - x1, y - y1);
            const d2 = Math.hypot(x - x2, y - y2);
            return Math.min(d1, d2) < r;
        }
        
        const dist = Math.hypot(x - closestX, y - closestY);
        return dist < r;
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black cursor-none overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
            
            <button 
                onClick={onExit}
                className="absolute top-8 right-8 z-50 pointer-events-auto border border-green-500/30 text-green-500/70 hover:bg-green-500 hover:text-black px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all"
            >
                DISCONNECT (EXIT)
            </button>
        </div>
    );
};

/* --- 5. MAIN APP --- */
const App = () => {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isVictoryMode, setIsVictoryMode] = useState(false);
  const [claimText, setClaimText] = useState("Claim Victory");
  const [dominanceScore, setDominanceScore] = useState(0);
  const [clicks, setClicks] = useState([]);
  const [inArena, setInArena] = useState(false);
  
  const lastScrollY = useRef(0);
  const containerRef = useRef(null);

  // Scroll Velocity Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = currentScrollY - lastScrollY.current;
      setScrollVelocity(v => v * 0.9 + velocity * 0.1);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Idle reset
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollVelocity(v => {
        if (Math.abs(v) < 0.1) return 0;
        return v * 0.8;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Global Click Handler
  useEffect(() => {
    const fonts = ['font-anton', 'font-cinzel', 'font-mono', 'font-comic', 'font-gothic'];
    const handleClick = (e) => {
      SoundEngine.init(); 
      SoundEngine.click();
      setDominanceScore(prev => prev + 1); 

      const id = Date.now();
      const newClick = {
        id, x: e.clientX, y: e.clientY,
        rot: Math.random() * 90 - 45 + 'deg',
        font: fonts[Math.floor(Math.random() * fonts.length)],
        color: Math.random() > 0.5 ? 'var(--accent)' : '#fff'
      };
      setClicks(prev => [...prev, newClick]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleClaimVictory = (e) => {
      e.stopPropagation();
      SoundEngine.click();
      setIsVictoryMode(true);
      setClaimText("WINNER DETECTED");
      setTimeout(() => setIsVictoryMode(false), 600);
      setTimeout(() => setClaimText("Claim Victory"), 3000);
  };

  const skewAmount = Math.min(Math.max(scrollVelocity * 0.2, -10), 10);

  // RENDER ARENA
  if (inArena) {
      return (
        <>
            <GlobalStyles />
            <ArenaOverlay onExit={() => setInArena(false)} />
        </>
      );
  }

  return (
    <div className={`min-h-screen bg-black text-white overflow-x-hidden selection:bg-[var(--accent)] selection:text-black ${isVictoryMode ? 'victory-mode' : ''}`}>
      <GlobalStyles />
      <div className="noise" />
      <FloatingWs />
      <CursorTrail />
      <DominanceIndex score={dominanceScore} />

      {/* Click Explosions Render */}
      {clicks.map(c => (
        <div key={c.id} className={`click-w text-4xl ${c.font}`} style={{ left: c.x, top: c.y, '--rot': c.rot, color: c.color }}>W</div>
      ))}

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-4xl font-black font-anton tracking-tighter hover:scale-110 transition-transform cursor-pointer">W</div>
        <button 
          className="border-2 border-[var(--accent)] text-[var(--accent)] px-6 py-2 md:px-8 md:py-2 rounded-full font-mono text-xs md:text-sm bg-black hover:bg-[var(--accent)] hover:text-black transition-all hover:scale-105 hover:rotate-2 uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(204,255,0,0.3)]"
          onClick={() => {
              window.open('https://app.uniswap.org/', '_blank');
          }}
          // Removed onMouseEnter hover sound
        >
          <span>ACQUIRE $W</span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 z-10">
        <div className="elastic-content text-center flex flex-col items-center" style={{ transform: `skewY(${skewAmount}deg)` }}>
          <div className="mb-4 text-[var(--accent)] font-mono text-sm tracking-[0.5em] animate-bounce">
            TICKER: $W
          </div>
          
          <div 
             className="text-[15vw] leading-[0.8] font-black font-anton uppercase mb-4 cursor-default select-none hover-glitch mix-blend-screen transition-transform duration-100 hover:scale-110 hover:skew-x-12"
             // Updated to use glitch sound on hover and click
             onMouseEnter={() => SoundEngine.glitch()}
             onClick={() => SoundEngine.glitch()}
          >
             JUST<br />WIN
          </div>

          <ContractAddress />

          <p className="max-w-xl text-center text-neutral-400 font-mono text-lg md:text-xl leading-relaxed mb-12 mix-blend-exclusion select-none px-4">
            Not a project. A state of being. The ticker is $W. The vibe is absolute victory. Welcome to the winner's circle.
          </p>

          <button 
            className="group relative px-12 py-6 bg-white text-black font-black text-2xl uppercase tracking-tighter overflow-hidden border-2 border-white hover:border-[var(--accent)] transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                SoundEngine.click();
                setInArena(true);
            }}
            // Removed onMouseEnter hover sound
          >
            <span className="relative z-10 group-hover:text-[var(--accent)] mix-blend-difference transition-colors">Enter The Arena</span>
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </button>
        </div>
      </section>

      <VelocityMarquee />

      {/* MAIN CONTENT FEED */}
      <section className="relative z-20 pb-24 px-4 md:px-12 bg-black/50 backdrop-blur-sm">
        
        <div className="mb-24 text-center">
          <h2 className="text-6xl md:text-8xl font-gothic text-white mb-4 transform -rotate-2 select-none">THE FEED</h2>
          <div className="w-24 h-2 bg-[var(--accent)] mx-auto animate-pulse" />
        </div>

        <div ref={containerRef} className="elastic-content max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8" style={{ transform: `skewY(${skewAmount * 0.5}deg)` }}>
          
          <LiveChartSection />

          {MOCK_TWEETS.map((tweet) => (
            <div key={tweet.id} className="break-inside-avoid">
              <TweetCard tweet={tweet} />
            </div>
          ))}
          
          {/* Replaced static Did You Know with interactive box */}
          <DidYouKnowBox />

          <div 
              className={`break-inside-avoid p-12 border-4 ${claimText === 'WINNER DETECTED' ? 'border-[var(--accent)] bg-[var(--accent)] text-black scale-110' : 'border-white text-white hover:bg-white hover:text-black'} mb-8 text-center transition-all duration-100 cursor-pointer group select-none`}
              onClick={handleClaimVictory}
              // Removed onMouseEnter hover sound
          >
            <Trophy size={64} className={`mx-auto mb-4 ${claimText === 'WINNER DETECTED' ? 'animate-bounce' : 'group-hover:animate-spin'}`} />
            <h3 className="font-cinzel text-2xl font-bold">{claimText}</h3>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-20 py-24 bg-[var(--accent)] text-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           {Array.from({length: 10}).map((_, i) => (
             <div key={i} className="absolute text-9xl font-black" style={{ 
               top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)`
             }}>W</div>
           ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h2 className="text-9xl font-black font-anton leading-none tracking-tighter mb-4 select-none">KEEP<br/>WINNING</h2>
            <div className="flex gap-4 font-mono text-sm uppercase font-bold tracking-widest">
              <a href="#" className="hover:underline decoration-4">Twitter</a>
              <a href="#" className="hover:underline decoration-4">Dexscreener</a>
            </div>
          </div>
          
          <div className="mt-12 md:mt-0 text-right">
            <p className="font-mono text-xs max-w-xs ml-auto mb-4 font-bold">Paper hands are a myth. We only know diamond grips and green candles. This is financial advice: Win.</p>
            <div className="text-4xl font-gothic animate-pulse">© 2025</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;