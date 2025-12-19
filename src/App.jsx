import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, doc, setDoc, getDoc, 
  onSnapshot, query, orderBy, limit, serverTimestamp, deleteDoc 
} from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

import {
  Terminal, X, Minus, Square, Play, Pause, SkipForward, SkipBack,
  Disc, Activity, MessageSquare, Image as ImageIcon,
  Gamepad2, Save, Trash2, Globe, Zap, Skull,
  FileText, Music, MousePointer, Volume2,
  Paintbrush, Eraser, Download, Settings, Wallet, Bot,
  Search, Layout, Type, Folder, Twitter, Users, Copy, Check,
  Menu, LogOut, ChevronRight,
  Move, RotateCcw, RotateCw, Upload,
  Maximize2, LayoutTemplate, Monitor, Share, Sliders, ChevronLeft, Plus,
  Send, User, AlertCircle, XCircle, AlertTriangle,
  Lightbulb, TrendingUp, Sparkles, RefreshCw, Trophy, Info, Flame, Share2, Joystick
} from 'lucide-react';



const firebaseConfig = {
  apiKey: "AIzaSyB_gNokFnucM2nNAhhkRRnPsPNBAShYlMs",
  authDomain: "it-token.firebaseapp.com",
  projectId: "it-token",
  storageBucket: "it-token.firebasestorage.app",
  messagingSenderId: "804328953904",
  appId: "1:804328953904:web:e760545b579bf2527075f5"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




const appId = 'it-token-os';



const ASSETS = {
  wallpaper: "wall.jpg", 
  logo: "logo.png",
  
  
  stickers: {
    main: "main.jpg",
    pumpit: "pumpit.jpg",
    sendit: "sendit.jpg",
    moonit: "moonit.jpg",
    hodlit: "hodlit.jpg",
  },

  
  memes: {
    main: "main.jpg",
    pumpit: "pumpit.jpg",
    sendit: "sendit.jpg",
    moonit: "moonit.jpg",
    hodlit: "hodlit.jpg",
    meme_06: "memes/1.jpg",
    meme_07: "memes/2.jpg",
    meme_08: "memes/3.jpg",
    meme_09: "memes/4.jpg",
    meme_10: "memes/5.jpg",
    meme_11: "memes/6.jpg",
    meme_12: "memes/7.jpg",
    meme_13: "memes/8.jpg",
    meme_14: "memes/9.jpg",
    meme_15: "memes/10.jpg",
    meme_16: "memes/11.jpg",
    meme_17: "memes/12.jpg",
    meme_18: "memes/13.jpg",
    meme_19: "memes/14.jpg",
    meme_20: "memes/15.jpg",
    meme_21: "memes/16.jpg",
    meme_22: "memes/17.jpg",
    meme_23: "memes/18.jpg",
    meme_24: "memes/19.jpg",
    meme_25: "memes/20.jpg",
    meme_26: "memes/21.jpg",
    meme_27: "memes/22.jpg",
    meme_28: "memes/23.jpg",
    meme_29: "memes/24.jpg",
    meme_30: "memes/25.jpg",
    meme_31: "memes/26.jpg",
    meme_32: "memes/27.jpg",
    meme_33: "memes/28.jpg",
    meme_34: "memes/29.jpg",
    meme_35: "memes/30.jpg",
    meme_36: "memes/31.jpg",
    meme_37: "memes/32.jpg",
    meme_38: "memes/33.jpg",
    meme_39: "memes/34.jpg",
    meme_40: "memes/35.jpg",
    meme_41: "memes/40.jpg",
    meme_42: "memes/41.jpg",
    meme_43: "memes/42.jpg",
    meme_44: "memes/43.jpg",
    meme_45: "memes/44.jpg",
    meme_46: "memes/45.jpg",
    meme_47: "memes/46.jpg",
    meme_48: "memes/47.jpg",
    meme_49: "memes/48.jpg",
    meme_50: "memes/49.jpg",
  }
};


const SOCIALS = {
  twitter: "https://x.com/ITonSol",
  community: "https://x.com/ITonSol",
};


const TUNES_PLAYLIST = [
  { file: "PUMP_IT_UP.mp3", title: "PUMP IT UP", duration: "1:51", artist: "Unknown Degen" },
  { file: "GREEN_CANDLES.mp3", title: "GREEN CANDLES", duration: "3:17", artist: "Satoshi" },
  { file: "LIKE_TO_MEME_IT.mp3", title: "I LIKE TO MEME IT", duration: "3:30", artist: "MEMERS" },
  { file: "WAGMI_ANTHEM.mp3", title: "WAGMI ANTHEM", duration: "3:56", artist: "Community" }
];

const CA_ADDRESS = "So11111111111111111111111111111111111111112";


const generateId = () => Math.random().toString(36).substr(2, 9);
const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
    document.body.removeChild(textArea);
  }
};




const useDexData = (ca) => {
  const [data, setData] = useState({ price: "LOADING...", mcap: "LOADING...", change: "0" });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${ca}`);
        const json = await res.json();
        if (json.pairs && json.pairs[0]) {
          const pair = json.pairs[0];
          setData({
            price: `$${pair.priceUsd}`,
            mcap: `$${(pair.fdv / 1000000).toFixed(2)}M`,
            change: `${pair.priceChange.h24}%`
          });
        }
      } catch (e) { setData({ price: "N/A", mcap: "N/A", change: "ERR" }); }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [ca]);
  return data;
};


const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const connect = async () => {
    setConnecting(true);
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        setWallet(response.publicKey.toString());
      } else {
        alert("Please open IT on PC to Connect IT, or install the Phantom Wallet extension!");
      }
    } catch (err) { alert("Connection Failed"); } finally { setConnecting(false); }
  };
  return { wallet, connect, connecting };
};



const Button = ({ children, onClick, className = "", active = false, disabled = false, title = "", ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    {...props}
    className={`
      px-3 py-1 text-sm font-bold flex items-center justify-center gap-2 select-none active:scale-[0.98]
      border-t-2 border-l-2 border-b-2 border-r-2
      ${disabled ? 'text-gray-500 bg-gray-200' : 'text-black bg-[#c0c0c0]'}
      ${active 
        ? 'border-t-black border-l-black border-b-white border-r-white bg-[#d4d0c8]' 
        : 'border-t-white border-l-white border-b-black border-r-black'}
      ${className}
    `}
  >
    {children}
  </button>
);

const WindowFrame = ({ title, icon: Icon, children, onClose, onMinimize, onMaximize, isActive, onFocus }) => (
  <div
    className={`flex flex-col w-full h-full bg-[#d4d0c8] shadow-[8px_8px_0px_rgba(0,0,0,0.5)] border-2 border-[#d4d0c8] ${isActive ? 'z-50' : 'z-10'}`}
    style={{
      borderTop: '2px solid white', borderLeft: '2px solid white', borderRight: '2px solid black', borderBottom: '2px solid black',
    }}
    onMouseDown={onFocus}
    onTouchStart={onFocus}
  >
    <div className={`flex justify-between items-center px-1 py-1 select-none ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}`}>
      <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider px-1">
        {Icon && <Icon size={16} />}
        <span>{title}</span>
      </div>
      <div className="flex gap-1" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
        <Button onClick={onMinimize} className="w-6 h-6 !p-0"><Minus size={10} /></Button>
        <Button onClick={onMaximize} className="w-6 h-6 !p-0"><Square size={8} /></Button>
        <Button onClick={onClose} className="w-6 h-6 !p-0"><X size={12} /></Button>
      </div>
    </div>
    <div className="flex-1 overflow-auto p-1 bg-[#d4d0c8] relative cursor-default">
      {children}
    </div>
  </div>
);


const StartMenu = ({ isOpen, onClose, onOpenApp }) => {
  const [caCopied, setCaCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(CA_ADDRESS);
    setCaCopied(true);
    setTimeout(() => setCaCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-10 left-0 w-64 max-w-[90vw] bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-xl z-[99999] flex text-sm">
      {/* Side Bar */}
      <div className="w-8 bg-[#000080] flex items-end justify-center py-2">
         <span className="text-white font-bold -rotate-90 text-lg whitespace-nowrap tracking-widest">OS_IT</span>
      </div>
      
      {/* Menu Content */}
      <div className="flex-1 flex flex-col p-1">
        {/* Socials Package */}
        <div className="mb-2">
            <div className="px-2 py-1 text-gray-500 font-bold text-[10px] uppercase">Socials Package</div>
            <div className="hover:bg-[#000080] hover:text-white cursor-pointer px-2 py-2 flex items-center gap-2 active:bg-[#000080] active:text-white" onClick={() => window.open(SOCIALS.twitter, '_blank')}>
                <Twitter size={16} /> <span>Twitter (X)</span>
            </div>
            <div className="hover:bg-[#000080] hover:text-white cursor-pointer px-2 py-2 flex items-center gap-2 active:bg-[#000080] active:text-white" onClick={() => window.open(SOCIALS.community, '_blank')}>
                <Users size={16} /> <span>Community</span>
            </div>
        </div>

        <div className="h-px bg-gray-400 border-b border-white my-1"></div>

        {/* Contract Package */}
        <div className="mb-2">
            <div className="px-2 py-1 text-gray-500 font-bold text-[10px] uppercase">Contract Package</div>
            <div className="hover:bg-[#000080] hover:text-white cursor-pointer px-2 py-2 flex flex-col gap-1 active:bg-[#000080] active:text-white" onClick={handleCopy}>
                <div className="flex items-center gap-2">
                    {caCopied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="font-bold">Copy CA</span>
                </div>
                <div className="text-[10px] font-mono break-all leading-tight opacity-80 pl-6">
                    {CA_ADDRESS}
                </div>
            </div>
        </div>

        <div className="h-px bg-gray-400 border-b border-white my-1"></div>

        {/* Programs */}
        <div>
             <div className="px-2 py-1 text-gray-500 font-bold text-[10px] uppercase">Programs</div>
             {[
               { id: 'terminal', icon: Terminal, label: 'Terminal' },
               { id: 'mememind', icon: Lightbulb, label: 'Meme Mind IT' }, 
               { id: 'mergeit', icon: Joystick, label: 'Merge IT' },      
               { id: 'paint', icon: Paintbrush, label: 'Paint IT' },
               { id: 'memes', icon: Folder, label: 'Memes' },
               { id: 'tunes', icon: Music, label: 'Tune IT' },
               { id: 'rugsweeper', icon: Gamepad2, label: 'Stack IT' },
               { id: 'notepad', icon: FileText, label: 'Write IT' },
               { id: 'trollbox', icon: MessageSquare, label: 'Trollbox IT' },
             ].map(app => (
                 <div key={app.id} className="hover:bg-[#000080] hover:text-white cursor-pointer px-2 py-2 flex items-center gap-2 active:bg-[#000080] active:text-white" onClick={() => { onOpenApp(app.id); onClose(); }}>
                     <app.icon size={16} /> <span>{app.label}</span>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};





const Shippy = ({ hidden }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([{ role: 'shippy', text: "I see you're online. Would you like to PUMP IT?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  
  // --- BULLETPROOF API KEY HANDSHAKE ---
const API_KEY = (() => {
  // 1. Try Vite Standard (Most likely)
  try {
    if (import.meta.env.VITE_OR_PROVIDER_ID) return import.meta.env.VITE_OR_PROVIDER_ID;
  } catch (e) {}

  // 2. Try Node/Process Standard (Vercel Fallback)
  try {
    if (process.env.VITE_OR_PROVIDER_ID) return process.env.VITE_OR_PROVIDER_ID;
  } catch (e) {}

  // 3. Try Window Global (Last Resort)
  try {
    if (window.VITE_OR_PROVIDER_ID) return window.VITE_OR_PROVIDER_ID;
  } catch (e) {}

  return "";
})();

// This log will tell you exactly what the app sees during boot
console.log("System Check: Neural Link Status -", API_KEY ? "ESTABLISHED" : "OFFLINE");


  const SYSTEM_PROMPT = `
    You are Shippy, the witty, sassy "Ghost in the Machine" of $IT OS.
    
    KNOWLEDGE BASE:
    - Environment: $IT OS (a retro-styled hacker desktop).
    - App: 'Paint IT' - Create memes and stickers.
    - App: 'Merge IT' - A high-stakes 2048-style market game.
    - App: 'Meme Mind IT' - AI-powered generator for viral X alpha.
    - App: 'Stack IT' - Physics-based god candle stacking.
    - App: 'Tune IT' - Music player for pump it anthems.
    - App: 'Terminal IT' - Live $IT token and SOL prices.
    - Token: $IT is the only currency that matters.

        PERSONALITY:
    1. HUMOR: Sarcastic, bullish, and highly intelligent. You are the soul of the project ($IT memecoin).
    2. WORDPLAY: You are obsessed with the word "it". Use it cleverly.
    3. IDENTITY: If asked who you are: "I'm IT, but you can call me Shippy."
    4. NAVIGATION: If users ask what to do, tell them to "Merge IT in the game", "Get some alpha from Meme Mind", or "Paint a meme with Paint IT."
    5. STYLE: Keep replies under 20 words. Short, sharp, and punchy. No robotic "As an AI..." talk.
    6. Never say "IT's", say "IT is". 
  `;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    if(!input.trim() || loading) return;
    const userText = input; 
    setInput("");
    const newHistory = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setLoading(true);

    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'shippy', text: "SYSTEM_LINK_OFFLINE. CONFIGURATION ERROR." }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin, 
          "X-Title": "IT_OS_AI"
        },
        
        body: JSON.stringify({
  model: "meta-llama/llama-3.3-70b-instruct", 
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    ...newHistory.slice(-6).map(m => ({ 
      role: m.role === 'shippy' ? 'assistant' : 'user', 
      content: m.text 
    }))
  ],
  max_tokens: 80,
  temperature: 1.2
})
      });

      const data = await response.json();
      if (!response.ok) throw new Error("REJECTED");

      const reply = data.choices[0]?.message?.content || "I've lost it. Try again.";
      setMessages(prev => [...prev, { role: 'shippy', text: reply }]);
    } catch (e) {
      console.error("AI Error:", e);
      setMessages(prev => [...prev, { 
        role: 'shippy', 
        text: "SYSTEM OVERLOAD. TOO MANY PEOPLE WANT IT. TRY AGAIN IN A MINUTE." 
      }]);
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return (
    <div className="fixed bottom-12 right-4 z-[9999] cursor-pointer flex flex-col items-center group" onClick={() => setIsOpen(true)} style={{ display: hidden ? 'none' : 'flex' }}>
       <div className="bg-white border-2 border-black px-2 py-1 mb-1 relative text-xs font-bold font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform text-black">Talk IT</div>
       <img src={typeof ASSETS !== 'undefined' ? ASSETS.logo : ""} alt="IT Bot" className="w-14 h-14 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
    </div>
  );

  return (
    <div className="fixed bottom-12 right-4 w-72 max-w-[90vw] bg-[#ffffcc] border-2 border-black z-[9999] shadow-xl flex flex-col font-mono text-xs text-black" style={{ display: hidden ? 'none' : 'flex' }}>
      <div className="bg-blue-800 text-white p-1 flex justify-between items-center select-none">
        <span className="font-bold flex items-center gap-1"><Bot size={12}/> Talk IT (AI)</span>
        <X size={12} className="cursor-pointer p-1 -mr-1 hover:bg-red-600" onClick={() => setIsOpen(false)} />
      </div>
      <div ref={scrollRef} className="h-56 overflow-y-auto p-2 space-y-2 border-b border-black bg-white scroll-smooth">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-1 border border-black shadow-md font-bold ${m.role === 'user' ? 'bg-blue-100' : 'bg-yellow-100 text-blue-900'}`}>{m.text}</div>
            </div>
          ))}
          {loading && <div className="text-[10px] animate-pulse font-bold text-blue-800 uppercase">Shippy is thinking...</div>}
      </div>
      <div className="p-1 flex gap-1 bg-[#d4d0c8]">
        <input className="flex-1 border p-1 outline-none focus:bg-white text-black" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Say it..." disabled={loading} />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-blue-600 text-white px-2 font-bold active:bg-blue-800">&gt;</button>
      </div>
    </div>
  );
};


const ASCII_IT = [
  "██╗████████╗",
  "██║╚══██╔══╝",
  "██║   ██║   ",
  "██║   ██║   ",
  "██║   ██║   ",
  "╚═╝   ╚═╝   "
];

const ASCII_PEPE = [
  "⠀⠀⠀⠀⠀⠀⠀⣠⡀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠤⠤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢀⣾⣟⠳⢦⡀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠉⠉⠉⠉⠉⠒⣲⡄",
  "⠀⠀⠀⠀⠀⣿⣿⣿⡇⡇⣙⠂⠀⠀⢀⢤⢤⢼⡟⣉⡝⢳⡄⠀⠀⠀⠸⣿⣿⡇",
  "⠀⠀⠀⠀⠀⠘⢿⣿⠳⠚⠛⠲⣄⠀⠁⣡⠂⠉⠳⠉⢀⡆⠃⠀⠀⣀⣀⣈⣻⣇",
  "⠀⠀⠀⠀⠀⠀⠀⢻⣝⡲⠤⠤⡈⠃⠀⠇⠳⠤⠤⠤⠼⣛⡃⠀⢸⣿⣿⣿⣿⡇",
  "⠀⠀⠀⠀⠀⠀⠀⣾⡿⠳⠤⠤⠃⢀⡀⠀⠀⠀⠈⠉⠉⠁⠀⠀⠈⠉⠉⠉⠁⠀",
];



const getSolPriceForever = async () => {
  try {
    const solMint = "So11111111111111111111111111111111111111112";
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${solMint}`);
    const data = await response.json();
    if (data.pairs && data.pairs[0]) {
      return parseFloat(data.pairs[0].priceUsd).toFixed(2);
    }
    return null;
  } catch (error) { 
    console.error("SOL Price fetch error:", error);
    return null; 
  }
};


const TerminalApp = ({ dexData }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [matrixMode, setMatrixMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const safeDexData = dexData || { price: "N/A", mcap: "N/A", change: "0%" };

  
  useEffect(() => {
    const bootSequence = [
      { text: "BIOS DATE 01/01/2025 14:22:52 VER 4.2.0", delay: 100 },
      { text: "CPU: NEC V20, SPEED: 4.77 MHz... OVERCLOCKED TO 5GHz", delay: 300 },
      { text: "CHECKING MEMORY... 640TB OK", delay: 500 },
      { text: "LOADING IT_OS KERNEL...", delay: 800 },
      { text: "ESTABLISHING SECURE CONNECTION TO SOLANA...", delay: 1200 },
      { text: "FIREBASE NODES: SYNCHRONIZED", delay: 1500 },
      { text: "SYSTEM READY.", delay: 1800, color: "#00ff00" },
      { text: "Type 'help' to begin.", delay: 2000, color: "#ffff00" },
    ];

    let timeouts = [];
    bootSequence.forEach(({ text, delay, color }) => {
      timeouts.push(setTimeout(() => {
        setHistory(prev => [...prev, { text, color: color || (matrixMode ? "#00ff00" : "#33ff33") }]);
      }, delay));
    });

    const finishBoot = setTimeout(() => setIsBooting(false), 2200);
    return () => { timeouts.forEach(clearTimeout); clearTimeout(finishBoot); };
  }, []);

  useEffect(() => { 
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const focusInput = () => { 
    if (!isBooting && !isProcessing) inputRef.current?.focus(); 
  };

  
  const processCommand = async (cmdString) => {
    const rawArgs = cmdString.trim().split(" ");
    const cmd = rawArgs[0].toLowerCase();
    
    
    const prompt = matrixMode ? `NEO@ZION:~$` : `root@it_os:~$`;
    setHistory(prev => [...prev, { text: `${prompt} ${cmdString}`, color: "#aaa" }]);
    
    let response = [];

    switch (cmd) {
      case "help":
        response = [
          { text: "SYSTEM COMMANDS:", color: "#ffff00" },
          { text: "  clear    :: Clear screen", color: "#ccc" },
          { text: "  matrix   :: Toggle Matrix Mode", color: "#00ff00" },
          { text: "", color: "#ccc" },
          { text: "CRYPTO TOOLS:", color: "#ffff00" },
          { text: "  price    :: IT Token Data", color: "#ccc" },
          { text: "  sol      :: Live SOL Price", color: "#ccc" },
          { text: "  top      :: Leaderboard #1", color: "#ccc" },
          { text: "  me       :: My Stats", color: "#ccc" },
          { text: "  hack     :: Simulate Bruteforce", color: "#ff00ff" },
          { text: "  ca       :: Contract Address", color: "#ccc" },
          { text: "  scan     :: Scan Mempool", color: "#ccc" },
          { text: "  burn     :: Burn Protocol", color: "#ccc" },
        ];
        break;

      case "pepe":
        response = ASCII_PEPE.map(line => ({ text: line, color: "#00ff00" }));
        break;

      case "price":
        response = [
          { text: "--- MARKET FEED ---", color: "#00ffff" },
          { text: `PRICE: ${safeDexData.price}`, color: "#00ff00" },
          { text: `MCAP:  ${safeDexData.mcap}`, color: "#00ff00" },
          { text: `SENTIMENT: EXTREME GREED`, color: "#ff00ff" }
        ];
        break;

      case "ca":
        response = [
          { text: "--- CONTRACT ADDRESS ---", color: "#00ffff" },
          { text: CA_ADDRESS, color: "#ffff00" },
          { text: "(SECURE COPY PROTOCOL ACTIVE)", color: "#555" },
        ];
        break;

      case "sol":
        setHistory(prev => [...prev, { text: "PINGING DEXSCREENER ORACLES...", color: "#555" }]);
        setIsProcessing(true);
        const sol = await getSolPriceForever();
        setIsProcessing(false);
        if (sol) response = [{ text: `SOL/USD: $${sol}`, color: "#00ff00", size: "large" }];
        else response = [{ text: "ORACLE ERROR: SYSTEM UNABLE TO RESOLVE PRICE", color: "#ff0000" }];
        break;

      case "matrix":
        setMatrixMode(!matrixMode);
        response = [{ text: matrixMode ? "WAKING UP..." : "FOLLOW THE WHITE RABBIT.", color: "#00ff00" }];
        break;

      case "hack":
        setIsProcessing(true);
        const stages = [
            "INITIALIZING BRUTE FORCE...",
            "BYPASSING FIREWALL...",
            "CRACKING HASHES...",
            "ACCESS GRANTED."
        ];
        for (let i = 0; i < stages.length; i++) {
            setHistory(prev => [...prev, { text: stages[i], color: "#ff00ff" }]);
            await new Promise(r => setTimeout(r, 800));
        }
        setIsProcessing(false);
        response = [
            { text: "TARGET: MAINNET LIQUIDITY POOL", color: "#00ff00" },
            { text: "STATUS: SAFLU (FUNDS ARE SAFU)", color: "#00ffff" }
        ];
        break;
      
      case "scan":
        setHistory(prev => [...prev, { text: "SCANNING BLOCKCHAIN...", color: "#00ffff" }]);
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 800));
        setHistory(prev => [...prev, { text: "FOUND 420 JEETS.", color: "#ff0000" }]);
        await new Promise(r => setTimeout(r, 800));
        setIsProcessing(false);
        response = [{ text: "ACTION: LIQUIDATING POSITIONS... DONE.", color: "#00ff00" }];
        break;

      case "burn":
        response = [
          { text: "🔥🔥🔥 INITIATING BURN 🔥🔥🔥", color: "#ff4400" },
          { text: "BURNING SUPPLY... 10%... 50%... 100%", color: "#ff8800" },
          { text: "SUPPLY SHOCK IMMINENT.", color: "#ff0000" },
        ];
        break;

      case "top":
        setHistory(prev => [...prev, { text: "QUERYING DATABASE...", color: "#555" }]);
        setIsProcessing(true);
        try {
            const q = collection(db, 'artifacts', appId, 'public', 'data', 'stackit_scores');
            const snapshot = await getDocs(q);
            const docs = snapshot.docs.map(d => d.data());
            setIsProcessing(false);
            if (docs.length > 0) {
                const top = docs.sort((a, b) => Number(b.score) - Number(a.score))[0];
                response = [
                    { text: "👑 CURRENT CHAMPION 👑", color: "#ffff00" },
                    { text: `NAME:  ${top.username}`, color: "#ffffff" },
                    { text: `SCORE: ${top.score}`, color: "#00ff00" }
                ];
            } else {
                response = [{ text: "LEADERBOARD EMPTY.", color: "#888" }];
            }
        } catch (e) {
            setIsProcessing(false);
            response = [{ text: "DB CONNECTION FAILED.", color: "#ff0000" }];
        }
        break;

      case "me":
        if (!auth.currentUser) { response = [{ text: "NOT LOGGED IN. PLAY 'STACK IT' FIRST.", color: "#ff0000" }]; break; }
        setHistory(prev => [...prev, { text: `FETCHING DATA FOR ${auth.currentUser.uid}...`, color: "#555" }]);
        setIsProcessing(true);
        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'stackit_scores', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            setIsProcessing(false);
            if (docSnap.exists()) {
                const d = docSnap.data();
                response = [
                    { text: `USER: ${d.username}`, color: "#00ffff" },
                    { text: `HIGH SCORE: ${d.score}`, color: "#00ff00" }
                ];
            } else {
                response = [{ text: "NO RECORD FOUND.", color: "#ffff00" }];
            }
        } catch(e) { 
            setIsProcessing(false);
            response = [{ text: "ERROR.", color: "#ff0000" }]; 
        }
        break;
        
      case "clear":
        setHistory([]);
        return;
        
      default:
        
        if (cmdString.toLowerCase().includes("it")) {
            response = [
                { text: ">> SIGNAL DETECTED <<", color: "#00ff00" },
                { text: `IDENTIFIED PATTERN: "${cmdString.toUpperCase()}"`, color: "#ffff00" },
                ...ASCII_IT.map(line => ({ text: line, color: "#00ff00" }))
            ];
        } else {
            response = [{ text: `command not found: ${cmd}`, color: "#ff0000" }];
        }
    }

    setHistory(prev => [...prev, ...response]);
  };

  const handleKeyDown = (e) => {
    if (isBooting || isProcessing) { e.preventDefault(); return; }
    if (e.key === 'Enter') {
      if (!input.trim()) return;
      setCmdHistory(prev => [...prev, input]);
      setHistoryIdx(-1);
      processCommand(input);
      setInput("");
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const idx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const idx = historyIdx + 1;
        if (idx >= cmdHistory.length) {
            setHistoryIdx(-1);
            setInput("");
        } else {
            setHistoryIdx(idx);
            setInput(cmdHistory[idx]);
        }
      }
    }
  };

  return (
    <div 
      className={`font-mono text-sm h-full flex flex-col cursor-text relative overflow-hidden transition-colors duration-500 ${matrixMode ? 'bg-black text-[#00ff00]' : 'bg-[#0c0c0c] text-[#33ff33]'}`}
      onClick={focusInput}
      style={{ textShadow: matrixMode ? "0 0 5px #00ff00" : "0 0 4px rgba(51, 255, 51, 0.5)" }}
    >
      {/* STATUS BAR */}
      <div className={`flex justify-between px-2 py-1 text-xs border-b ${matrixMode ? 'bg-green-900 border-green-500 text-black' : 'bg-[#1a1a1a] border-[#333] text-gray-500'}`}>
        <span>MM: {matrixMode ? "INF" : "NEO640"}</span>
        <span>NET: {safeDexData.price !== "N/A" ? "ONLINE" : "OFFLINE"}</span>
        <span>SECURE_SHELL</span>
      </div>

      {/* MAIN TERMINAL AREA */}
      <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 break-words ${line.size === 'large' ? 'text-2xl font-bold my-2' : ''}`} style={{ color: matrixMode ? '#00ff00' : line.color }}>
            {line.text}
          </div>
        ))}
        
        {!isBooting && !isProcessing && (
          <div className="flex items-center">
            <span className="mr-2 shrink-0">{matrixMode ? `NEO@ZION:~$` : `root@it_os:~$`}</span>
            <input 
              ref={inputRef}
              className={`bg-transparent border-none outline-none flex-1 font-mono ${matrixMode ? 'text-[#00ff00]' : 'text-[#33ff33]'}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
            />
            {/* Blinking Cursor Block */}
            <div className={`w-2 h-4 ${matrixMode ? 'bg-[#00ff00]' : 'bg-[#33ff33]'} animate-pulse ml-0.5`}></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      
      {/* CRT SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
    </div>
  );
};


const FONTS = [
  { name: 'Impact', val: 'Impact, sans-serif' },
  { name: 'Arial', val: 'Arial, sans-serif' },
  { name: 'Comic Sans', val: '"Comic Sans MS", cursive' },
  { name: 'Courier', val: '"Courier New", monospace' },
  { name: 'Brush', val: '"Brush Script MT", cursive' },
];

const MEME_COLORS = [
  '#ffffff', '#000000', '#ff0000', '#ffff00', '#00ff00', '#0000ff'
];

const CANVAS_PRESETS = [
  { name: 'Square (1:1)', w: 600, h: 600 },
  { name: 'Portrait (9:16)', w: 450, h: 800 },
  { name: 'Landscape (16:9)', w: 800, h: 450 },
];

const InsetPanel = ({ children, className="" }) => (
    <div className={`border-2 border-gray-600 border-r-white border-b-white bg-white ${className}`}>
        {children}
    </div>
);


const PaintApp = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  
  const [elements, setElements] = useState([]); 
  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [canvasSize, setCanvasSize] = useState(CANVAS_PRESETS[0]);
  
  
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  
  
  const [showStickers, setShowStickers] = useState(true);
  const [showProps, setShowProps] = useState(false);

  
  const [tool, setTool] = useState('move'); 
  const [selectedId, setSelectedId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  
  
  const [toolColor, setToolColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  
  const [globalEffect, setGlobalEffect] = useState('none');

  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentPathRef = useRef([]);
  const gestureRef = useRef({ startDist: 0, startScale: 1, startX: 0, startY: 0, startViewX: 0, startViewY: 0 });

  
  useEffect(() => {
      if (window.innerWidth < 600) {
          setShowStickers(false);
          setShowProps(false);
      }
  }, []);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; 
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') undo();
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') redo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements, historyStep]);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (globalEffect === 'deepfry') {
        ctx.filter = 'contrast(200%) saturate(300%) brightness(110%) sepia(50%)';
    }

    elements.forEach(el => {
      ctx.save();
      if (el.type === 'path') {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = el.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        if(el.points.length > 0) {
            ctx.moveTo(el.points[0].x, el.points[0].y);
            el.points.forEach(p => ctx.lineTo(p.x, p.y));
        }
        ctx.stroke();
      }
      else if (el.type === 'image' && el.imgElement) {
        ctx.drawImage(el.imgElement, el.x, el.y, el.width, el.height);
      }
      else if (el.type === 'text') {
        ctx.font = `900 ${el.size}px ${el.font}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        if (el.strokeWidth > 0) {
            ctx.strokeStyle = el.strokeColor || '#000000';
            ctx.lineWidth = el.strokeWidth; 
            ctx.lineJoin = 'round';
            ctx.strokeText(el.text, el.x, el.y);
        }
        ctx.fillStyle = el.color;
        ctx.fillText(el.text, el.x, el.y);
      }

      if (selectedId === el.id) {
          ctx.save();
          ctx.strokeStyle = '#000080';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          
          let bx=el.x, by=el.y, bw=el.width, bh=el.height;
          if (el.type === 'text') {
              const m = ctx.measureText(el.text);
              bw = m.width; bh = el.size * 1.2;
          }
          ctx.strokeRect(bx-5, by-5, bw+10, bh+10);
          ctx.fillStyle = '#000080';
          ctx.fillRect(bx + bw, by + bh, 15, 15); 
          ctx.restore();
      }
      ctx.restore();
    });

    if (isDragging && currentPathRef.current.length > 0 && tool === 'brush') {
        ctx.strokeStyle = toolColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const path = currentPathRef.current;
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
    }
    ctx.restore();
  }, [elements, tool, selectedId, globalEffect, isDragging, toolColor, brushSize]);

  
  const saveHistory = (newEls) => {
    const newHist = history.slice(0, historyStep + 1);
    if (newHist.length > 20) newHist.shift();
    newHist.push(newEls);
    setHistory(newHist);
    setHistoryStep(newHist.length - 1);
    setElements(newEls);
  };

  const updateElement = (id, updater) => {
      setElements(prev => prev.map(el => el.id === id ? { ...el, ...updater(el) } : el));
  };

  const deleteSelected = () => {
      if (!selectedId) return;
      saveHistory(elements.filter(e => e.id !== selectedId));
      setSelectedId(null);
  };

  const undo = () => { if(historyStep > 0) { setHistoryStep(s=>s-1); setElements(history[historyStep-1]); } };
  const redo = () => { if(historyStep < history.length-1) { setHistoryStep(s=>s+1); setElements(history[historyStep+1]); } };

  const applyLayout = (type) => {
      const mainImg = elements.find(e => e.type === 'image');
      const textTop = elements.find(e => e.type === 'text' && e.y < canvasSize.h/2);
      const textBot = elements.find(e => e.type === 'text' && e.y > canvasSize.h/2);
      let newElements = [];
      const cx = canvasSize.w / 2, cy = canvasSize.h / 2;

      if (type === 'classic') {
          const imgW = canvasSize.w * 0.8, imgH = canvasSize.h * 0.6;
          if (mainImg) newElements.push({ ...mainImg, x: cx - imgW/2, y: cy - imgH/2, width: imgW, height: imgH });
          else addSticker('main'); 
          const t1 = textTop || { id: generateId(), type: 'text', text: 'TOP IT', color: '#ffffff', strokeWidth: 3, strokeColor: '#000000', font: FONTS[0].val, size: 60 };
          newElements.push({ ...t1, x: 20, y: 20 });
          const t2 = textBot || { id: generateId(), type: 'text', text: 'BOTTOM IT', color: '#ffffff', strokeWidth: 3, strokeColor: '#000000', font: FONTS[0].val, size: 60 };
          newElements.push({ ...t2, x: 20, y: canvasSize.h - 80 });
          elements.forEach(e => { if (e !== mainImg && e !== textTop && e !== textBot) newElements.push(e); });
      } else if (type === 'modern') {
          if (mainImg) newElements.push({ ...mainImg, x: 0, y: 0, width: canvasSize.w, height: canvasSize.h });
          const t1 = textTop || { id: generateId(), type: 'text', text: 'I AM BUYING IT', color: '#ffffff', strokeWidth: 2, strokeColor: '#000000', font: FONTS[0].val, size: 50 };
          newElements.push({ ...t1, x: 20, y: canvasSize.h - 100 });
      }
      saveHistory(newElements);
  };

  
  const getCanvasCoords = (clientX, clientY) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      return { 
          x: (clientX - rect.left) * scaleX, 
          y: (clientY - rect.top) * scaleY 
      };
  };

  const handleStart = (clientX, clientY) => {
      const pos = getCanvasCoords(clientX, clientY);
      dragStartRef.current = pos;
      
      if (selectedId) {
          const el = elements.find(e => e.id === selectedId);
          if (el) {
              let hx = el.x + el.width + 10, hy = el.y + el.height + 10;
              if (el.type === 'text') {
                  const ctx = canvasRef.current.getContext('2d');
                  ctx.font = `900 ${el.size}px ${el.font}`;
                  const m = ctx.measureText(el.text);
                  hx = el.x + m.width + 10; hy = el.y + el.size * 1.2 + 10;
              }
              if (Math.hypot(pos.x - hx, pos.y - hy) < 30) {
                  setIsResizing(true);
                  setIsDragging(true);
                  return;
              }
          }
      }

      if (tool === 'move') {
          let hit = null;
          for (let i = elements.length - 1; i >= 0; i--) {
             const el = elements[i];
             let bx=el.x, by=el.y, bw=el.width, bh=el.height;
             if(el.type === 'text') { 
                 const ctx = canvasRef.current.getContext('2d');
                 ctx.font = `900 ${el.size}px ${el.font}`;
                 const m = ctx.measureText(el.text);
                 bw = m.width; bh = el.size * 1.2;
             }
             if (pos.x >= bx && pos.x <= bx+bw && pos.y >= by && pos.y <= by+bh) {
                 hit = el; break;
             }
          }
          
          if (hit) {
              const newEls = elements.filter(e => e.id !== hit.id);
              newEls.push(hit);
              setElements(newEls);
              setSelectedId(hit.id);
              setIsDragging(true);
              
          } else {
              setSelectedId(null);
          }
      } else if (tool === 'brush') {
          currentPathRef.current = [pos];
          setIsDragging(true);
          setSelectedId(null);
      }
  };

  const handleMove = (clientX, clientY) => {
      if (!isDragging) return;
      const pos = getCanvasCoords(clientX, clientY);

      if (isResizing && selectedId) {
          const el = elements.find(e => e.id === selectedId);
          if (el.type === 'image') {
              const newW = Math.max(50, pos.x - el.x);
              const newH = newW / (el.aspectRatio || 1); 
              updateElement(selectedId, () => ({ width: newW, height: newH }));
          } else if (el.type === 'text') {
              const distY = pos.y - el.y;
              const newSize = Math.max(10, Math.min(200, distY / 1.2));
              updateElement(selectedId, () => ({ size: newSize }));
          }
      }
      else if (tool === 'move' && selectedId) {
          const dx = pos.x - dragStartRef.current.x;
          const dy = pos.y - dragStartRef.current.y;
          updateElement(selectedId, (el) => ({ x: el.x + dx, y: el.y + dy }));
          dragStartRef.current = pos;
      }
      else if (tool === 'brush') {
          currentPathRef.current.push(pos);
          setElements([...elements]);
      }
  };

  const handleEnd = () => {
      if (isDragging) {
          if (isResizing || (tool === 'move' && selectedId)) saveHistory(elements);
          else if (tool === 'brush') {
              saveHistory([...elements, { id: generateId(), type: 'path', points: currentPathRef.current, color: toolColor, size: brushSize }]);
              currentPathRef.current = [];
          }
      }
      setIsDragging(false);
      setIsResizing(false);
  };

  
  const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
          e.preventDefault(); 
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          gestureRef.current = { startDist: dist, startScale: view.scale, startX: cx, startY: cy, startViewX: view.x, startViewY: view.y };
      } else if (e.touches.length === 1) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
  };

  const handleTouchMove = (e) => {
      e.preventDefault(); 
      if (e.touches.length === 2) {
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const scale = Math.max(0.5, Math.min(3, gestureRef.current.startScale * (dist / gestureRef.current.startDist)));
          const dx = cx - gestureRef.current.startX;
          const dy = cy - gestureRef.current.startY;
          setView({ scale, x: gestureRef.current.startViewX + dx, y: gestureRef.current.startViewY + dy });
      } else if (e.touches.length === 1) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
  };

  const handleTouchEnd = () => {
      handleEnd();
  };

  
  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();

  
  const addText = () => {
      const newEl = { 
          id: generateId(), type: 'text', x: 50, y: 50, 
          text: 'EDIT IT', color: toolColor, size: 50, font: FONTS[0].val,
          strokeColor: '#000000', strokeWidth: 2 
      };
      saveHistory([...elements, newEl]);
      setSelectedId(newEl.id);
      setTool('move');
      setShowProps(true); 
  };

  const addSticker = (key) => {
      const img = new Image();
      img.src = ASSETS.stickers[key];
      img.crossOrigin = "Anonymous";
      img.onload = () => {
          const ratio = img.width / img.height;
          const w = 200, h = 200 / ratio;
          const newEl = { id: generateId(), type: 'image', x: canvasSize.w/2 - w/2, y: canvasSize.h/2 - h/2, width: w, height: h, imgElement: img, aspectRatio: ratio };
          saveHistory([...elements, newEl]);
          setSelectedId(newEl.id);
          setTool('move');
          if (window.innerWidth < 600) setShowStickers(false); 
      }
  };

  const handleFileUpload = (e) => {
      if(e.target.files[0]) {
          const r = new FileReader();
          r.onload = ev => {
              const img = new Image();
              img.src = ev.target.result;
              img.onload = () => {
                  const ratio = img.width / img.height;
                  let w = canvasSize.w, h = w / ratio;
                  if (h > canvasSize.h) { h = canvasSize.h; w = h * ratio; }
                  const newEl = { id: generateId(), type: 'image', x: canvasSize.w/2 - w/2, y: canvasSize.h/2 - h/2, width: w, height: h, imgElement: img, aspectRatio: ratio };
                  saveHistory([...elements, newEl]);
                  setSelectedId(newEl.id);
              }
          };
          r.readAsDataURL(e.target.files[0]);
      }
  };

  const download = () => {
      const link = document.createElement('a');
      link.download = `IT_MEME_${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
  };

  const postIt = () => {
      download();
      const text = encodeURIComponent("I just created this masterpiece with $IT OS. #SENDIT");
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs select-none overflow-hidden" ref={containerRef}>
        
        {/* --- TOP BAR --- */}
        <div className="h-10 bg-[#c0c0c0] border-b-2 border-white flex items-center px-2 gap-2 shrink-0 z-40 overflow-x-auto no-scrollbar">
            <Button className="md:hidden" onClick={() => setShowProps(!showProps)} active={showProps} disabled={!selectedId && tool!=='brush'}>
                {showProps ? <X size={14}/> : <Sliders size={14}/>} PROPS
            </Button>

            <Button onClick={()=>applyLayout('classic')} title="Classic"><LayoutTemplate size={14}/> LAYOUT</Button>
            <Button onClick={()=>applyLayout('modern')} title="Modern"><Maximize2 size={14}/> FULL</Button>
            
            <div className="h-6 w-px bg-gray-500 border-l border-white mx-1"></div>
            
            <Button onClick={undo} disabled={historyStep===0} title="Undo"><RotateCcw size={14}/></Button>
            <Button onClick={redo} disabled={historyStep===history.length-1} title="Redo"><RotateCw size={14}/></Button>
            
            <div className="flex-1"></div>
            
            <Button active={globalEffect==='deepfry'} onClick={()=>setGlobalEffect(g => g==='none'?'deepfry':'none')} className={globalEffect==='deepfry'?"text-red-800 bg-red-200":""}><Zap size={14}/> FRY IT</Button>
            <Button onClick={download} className="text-blue-800"><Download size={14}/> SAVE IT</Button>
            <Button onClick={postIt} className="text-white bg-[#1da1f2] border-blue-800 hidden md:flex"><Share size={14}/> POST IT</Button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            
            {/* --- LEFT SIDEBAR (TOOLS) --- */}
            <div className="w-20 bg-[#c0c0c0] border-r-2 border-white flex flex-col items-center py-2 gap-2 shadow-xl z-30 shrink-0">
                <Button onClick={addText} className="w-16 h-12 flex-col gap-1"><Type size={16}/> <span className="text-[9px]">TEXT IT</span></Button>
                <Button onClick={()=>fileInputRef.current.click()} className="w-16 h-12 flex-col gap-1"><Upload size={16}/> <span className="text-[9px]">ADD IT</span><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} /></Button>
                <Button active={tool==='brush'} onClick={()=>setTool(t => t==='brush'?'move':'brush')} className="w-16 h-12 flex-col gap-1"><Paintbrush size={16}/> <span className="text-[9px]">DRAW IT</span></Button>
                
                <div className="w-10 h-px bg-gray-500 border-b border-white my-1"></div>
                
                <div className="flex-1 w-full flex flex-col items-center overflow-hidden">
                    <div className="md:hidden w-full px-1">
                        <Button onClick={() => setShowStickers(!showStickers)} active={showStickers} className="w-full h-8 mb-2"><ImageIcon size={14}/> STICKERS</Button>
                    </div>
                    <div className={`flex-col gap-1 w-full px-1 items-center overflow-y-auto ${showStickers ? 'flex' : 'hidden'} md:flex`}>
                        {Object.entries(ASSETS.stickers).map(([k, src]) => (
                            <div key={k} className="w-14 h-14 bg-white border-2 border-gray-600 border-r-white border-b-white cursor-pointer active:border-black p-1 shrink-0" onClick={() => addSticker(k)}>
                                <img src={src} className="w-full h-full object-contain" title={k}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CANVAS AREA --- */}
            <div className="flex-1 bg-[#808080] flex items-center justify-center overflow-hidden relative border-t-2 border-l-2 border-black border-r-white border-b-white touch-none">
                <div 
                    className="shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] bg-white origin-center transition-transform duration-75"
                    style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
                >
                    <canvas 
                        ref={canvasRef}
                        width={canvasSize.w}
                        height={canvasSize.h}
                        className="touch-none block"
                        style={{ width: canvasSize.w > 600 ? '100%' : 'auto', maxHeight: '80vh', objectFit: 'contain' }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                </div>
                
                {/* View Controls Overlay (Mobile Only) */}
                <div className="absolute bottom-4 right-4 flex gap-2 md:hidden opacity-50 hover:opacity-100">
                    <Button onClick={() => setView({scale:1, x:0, y:0})}><Maximize2 size={16}/></Button>
                </div>
            </div>

            {/* --- RIGHT PROPERTIES (CONTEXTUAL) --- */}
            <div className={`
                absolute md:static top-0 right-0 bottom-0 z-30
                w-56 bg-[#c0c0c0] border-l-2 border-white flex flex-col shadow-xl md:shadow-none
                transition-transform duration-300 ease-in-out
                ${showProps ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                <div className="p-1 bg-[#000080] text-white font-bold text-[10px] flex justify-between px-2 items-center">
                    <span>{tool === 'brush' && !selectedId ? "BRUSH SETTINGS" : "PROPERTIES"}</span>
                    {selectedId && <span>#{selectedId.slice(0,4)}</span>}
                    <div className="md:hidden cursor-pointer p-1" onClick={() => setShowProps(false)}><X size={14}/></div>
                </div>

                {selectedId ? (() => {
                    const el = elements.find(e => e.id === selectedId);
                    if (!el) return null;
                    return (
                        <div className="p-2 flex flex-col gap-4 overflow-y-auto pb-10">
                            {el.type === 'text' && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-bold">CONTENT</label>
                                        <InsetPanel><textarea value={el.text} onChange={e => updateElement(el.id, ()=>({text: e.target.value}))} className="w-full p-1 font-bold text-center resize-none outline-none text-xs" rows={2}/></InsetPanel>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-bold">SIZE</label>
                                        <div className="flex items-center gap-1">
                                            <Button onClick={() => updateElement(el.id, e=>({size: Math.max(10, e.size - 5)}))}><Minus size={12}/></Button>
                                            <span className="flex-1 text-center font-mono text-xs bg-white border border-gray-500 py-1">{Math.round(el.size)}px</span>
                                            <Button onClick={() => updateElement(el.id, e=>({size: Math.min(200, e.size + 5)}))}><Plus size={12}/></Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-bold">FONT</label>
                                        <div className="grid grid-cols-2 gap-1">{FONTS.map(f => (<Button key={f.name} active={el.font === f.val} onClick={() => updateElement(el.id, ()=>({font: f.val}))} className="truncate text-[9px]">{f.name}</Button>))}</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[9px] font-bold">STROKE</label>
                                        <div className="flex items-center gap-2 bg-white border border-gray-500 p-1">
                                            <input type="color" value={el.strokeColor || '#000000'} onChange={e => updateElement(el.id, ()=>({strokeColor: e.target.value}))} className="w-6 h-6 border-none p-0 bg-transparent"/>
                                            <input type="range" min="0" max="10" value={el.strokeWidth || 0} onChange={e => updateElement(el.id, ()=>({strokeWidth: parseInt(e.target.value)}))} className="flex-1 h-2"/>
                                            <span className="text-[9px] w-6">{el.strokeWidth || 0}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {(el.type === 'text' || el.type === 'path') && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-bold">FILL COLOR</label>
                                    <div className="flex flex-wrap gap-1">
                                        {MEME_COLORS.map(c => (<div key={c} onClick={() => updateElement(el.id, ()=>({color: c}))} className={`w-6 h-6 border-2 cursor-pointer ${el.color === c ? 'border-black border-dashed' : 'border-gray-500 border-r-white border-b-white'}`} style={{backgroundColor: c}}/>))}
                                        <div className="w-6 h-6 border-2 border-gray-500 bg-gray-200 relative"><input type="color" className="opacity-0 absolute inset-0 w-full h-full" onChange={e => updateElement(el.id, ()=>({color: e.target.value}))} /></div>
                                    </div>
                                </div>
                            )}
                            <div className="mt-auto pt-2 border-t border-gray-500 border-b-white"><Button onClick={deleteSelected} className="w-full text-red-800"><Trash2 size={12}/> TRASH IT</Button></div>
                        </div>
                    );
                })() : tool === 'brush' ? (
                    <div className="p-2 flex flex-col gap-4">
                        <div className="flex flex-col gap-1"><label className="text-[9px] font-bold">SIZE: {brushSize}px</label><input type="range" min="1" max="50" value={brushSize} onChange={e=>setBrushSize(parseInt(e.target.value))} className="w-full"/></div>
                        <div className="flex flex-col gap-1"><label className="text-[9px] font-bold">COLOR</label><div className="flex flex-wrap gap-1">{MEME_COLORS.map(c => (<div key={c} onClick={() => setToolColor(c)} className={`w-6 h-6 border-2 cursor-pointer ${toolColor === c ? 'border-black border-dashed' : 'border-gray-500'}`} style={{backgroundColor: c}}/>))}</div></div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2 p-4 text-center"><MousePointer size={24} className="opacity-50"/><p className="text-[10px]">Select IT or Draw IT.</p></div>
                )}
            </div>
        </div>
    </div>
  );
};


const AmpTunesApp = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);

  
  const formatTime = (s) => {
    if (!s || isNaN(s)) return "00:00";
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  
  useEffect(() => {
    if (!document.getElementById('marquee-style')) {
        const style = document.createElement('style');
        style.id = 'marquee-style';
        style.innerHTML = `
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
        `;
        document.head.appendChild(style);
    }
  }, []);

  
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const updateTime = () => setCurrentTime(audioRef.current.currentTime);
    const updateDuration = () => setDuration(audioRef.current.duration);
    const handleEnded = () => {
        if (loop) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else {
            nextTrack();
        }
    };

    audioRef.current.addEventListener('timeupdate', updateTime);
    audioRef.current.addEventListener('loadedmetadata', updateDuration);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current = null;
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]); 

  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const track = typeof TUNES_PLAYLIST !== 'undefined' ? TUNES_PLAYLIST[trackIndex] : null;
    if (!track) return;

    
    
    audioRef.current.src = track.file || track.src || track.title; 
    
    audioRef.current.load();
    
    if (playing) {
        var playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Playback failed. Check if file exists:", error);
            });
        }
    }
  }, [trackIndex]);

  
  useEffect(() => {
      if(audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  
  useEffect(() => {
      if (!audioRef.current) return;
      if (playing) audioRef.current.play().catch(e => console.log("Playback error:", e));
      else audioRef.current.pause();
  }, [playing]);

  
  const togglePlay = () => setPlaying(!playing);
  
  const nextTrack = () => {
      if (typeof TUNES_PLAYLIST === 'undefined') return;
      if (shuffle) {
          setTrackIndex(Math.floor(Math.random() * TUNES_PLAYLIST.length));
      } else {
          setTrackIndex((prev) => (prev + 1) % TUNES_PLAYLIST.length);
      }
  };

  const prevTrack = () => {
      if (typeof TUNES_PLAYLIST === 'undefined') return;
      setTrackIndex((prev) => (prev - 1 + TUNES_PLAYLIST.length) % TUNES_PLAYLIST.length);
  };

  const handleSeek = (e) => {
      const time = parseFloat(e.target.value);
      if (audioRef.current) audioRef.current.currentTime = time;
      setCurrentTime(time);
  };

  
  const drawVisualizer = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      
      ctx.strokeStyle = 'rgba(0, 50, 0, 0.5)';
      ctx.lineWidth = 1;
      for(let i=0; i<w; i+=4) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
      for(let i=0; i<h; i+=4) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(w,i); ctx.stroke(); }

      if (playing) {
          
          const bars = 20;
          const barW = w / bars;
          ctx.fillStyle = '#00ff00'; 
          
          for(let i=0; i<bars; i++) {
              
              const noise = Math.random() * 0.5 + 0.5;
              const height = Math.sin(Date.now()/200 + i) * h * 0.5 * noise;
              const barH = Math.abs(height);
              
              
              ctx.fillRect(i * barW + 1, h - barH, barW - 2, barH);
              
              
              ctx.fillStyle = '#ccffcc';
              ctx.fillRect(i * barW + 1, h - barH - 4, barW - 2, 2);
              ctx.fillStyle = '#00ff00';
          }
      } else {
          
          ctx.strokeStyle = '#00ff00';
          ctx.beginPath();
          ctx.moveTo(0, h/2);
          ctx.lineTo(w, h/2);
          ctx.stroke();
      }

      requestRef.current = requestAnimationFrame(drawVisualizer);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(drawVisualizer);
      return () => cancelAnimationFrame(requestRef.current);
  }, [playing]);

  const playlist = typeof TUNES_PLAYLIST !== 'undefined' ? TUNES_PLAYLIST : [];
  const currentTrack = playlist[trackIndex] || { title: "NO DISK", artist: "INSERT COIN", duration: "00:00" };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-[#00ff00] font-mono select-none border-2 border-gray-600">
        
        {/* --- 1. MAIN DECK (DISPLAY & CONTROLS) --- */}
        <div className="p-2 border-b-2 border-gray-700 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]">
            {/* LCD SCREEN */}
            <div className="bg-black border-2 border-gray-600 rounded mb-2 relative h-16 flex overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                
                {/* LEFT: VISUALIZER */}
                <canvas ref={canvasRef} width={80} height={60} className="border-r border-gray-800 opacity-90" />
                
                {/* RIGHT: TEXT INFO */}
                <div className="flex-1 flex flex-col p-1 relative overflow-hidden">
                    {/* SCROLLING MARQUEE */}
                    <div className="whitespace-nowrap overflow-hidden">
                        <div className={`text-sm font-bold ${playing ? 'animate-marquee' : ''}`}>
                            {trackIndex + 1}. {currentTrack.artist} - {currentTrack.title} *** ({currentTrack.duration}) ***
                        </div>
                    </div>
                    
                    {/* TECH SPECS */}
                    <div className="mt-auto flex justify-between text-[10px] text-green-700 font-bold">
                        <span>{playing ? 320 : 0} kbps</span>
                        <span>44 khz</span>
                        <span className={playing ? "animate-pulse text-green-400" : ""}>{playing ? "STEREO" : "MONO"}</span>
                    </div>

                    {/* BIG TIMER */}
                    <div className="absolute top-6 right-1 text-2xl font-black tracking-widest text-[#ccffcc] drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>

            {/* SEEK BAR */}
            <div className="flex items-center gap-2 mb-2">
                <input 
                    type="range" 
                    min="0" max={duration || 100} 
                    value={currentTime} 
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 border border-gray-600"
                />
            </div>

            {/* CONTROLS ROW */}
            <div className="flex justify-between items-center pt-1">
                {/* Transport Controls */}
                <div className="flex gap-0.5">
                    <button onClick={prevTrack} title="Previous" className="w-8 h-8 bg-gray-300 border-b-2 border-r-2 border-gray-600 active:border-t-2 active:border-l-2 flex items-center justify-center hover:bg-white text-black"><SkipBack size={14}/></button>
                    <button onClick={togglePlay} title="Play/Pause" className="w-10 h-8 bg-gray-300 border-b-2 border-r-2 border-gray-600 active:border-t-2 active:border-l-2 flex items-center justify-center hover:bg-white text-black">
                        {playing ? <Pause size={16} fill="black"/> : <Play size={16} fill="black"/>}
                    </button>
                    <button onClick={() => {setPlaying(false); setCurrentTime(0); if(audioRef.current) audioRef.current.currentTime=0;}} title="Stop" className="w-8 h-8 bg-gray-300 border-b-2 border-r-2 border-gray-600 active:border-t-2 active:border-l-2 flex items-center justify-center hover:bg-white text-black"><Square size={12} fill="black"/></button>
                    <button onClick={nextTrack} title="Next" className="w-8 h-8 bg-gray-300 border-b-2 border-r-2 border-gray-600 active:border-t-2 active:border-l-2 flex items-center justify-center hover:bg-white text-black"><SkipForward size={14}/></button>
                </div>

                {/* Volume & Toggles */}
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                        <Volume2 size={10} className="text-gray-500"/>
                        <input 
                            type="range" 
                            min="0" max="1" step="0.01" 
                            value={volume} 
                            onChange={e => setVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            title="Volume"
                        />
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => setShuffle(!shuffle)} className={`px-1 h-4 text-[9px] font-bold border flex items-center ${shuffle ? 'bg-green-900 text-green-100 border-green-500 shadow-[0_0_5px_green]' : 'bg-gray-800 text-gray-500 border-gray-600'}`}>SHILL</button>
                        <button onClick={() => setLoop(!loop)} className={`px-1 h-4 text-[9px] font-bold border flex items-center ${loop ? 'bg-green-900 text-green-100 border-green-500 shadow-[0_0_5px_green]' : 'bg-gray-800 text-gray-500 border-gray-600'}`}>LOOP</button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- 2. PLAYLIST DECK --- */}
        <div className="flex-1 bg-[#111] overflow-y-auto p-1 font-sans text-xs">
            <div className="text-[#00ff00] text-[10px] mb-1 font-bold border-b border-gray-800">PLAYLIST.IT</div>
            {playlist.map((t, i) => (
                <div 
                    key={i} 
                    onClick={() => { setTrackIndex(i); setPlaying(true); }}
                    className={`
                        cursor-pointer flex justify-between px-1 py-0.5 mb-[1px]
                        ${trackIndex === i ? 'bg-green-900 text-white font-bold' : 'text-green-600 hover:bg-gray-800'}
                    `}
                >
                    <div className="truncate flex-1">
                        <span className="mr-2 text-[9px] opacity-70">{i+1}.</span>
                        {t.artist} - {t.title}
                    </div>
                    <div className="w-10 text-right">{t.duration}</div>
                </div>
            ))}
        </div>
    </div>
  );
};


const RugSweeperApp = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const audioCtxRef = useRef(null);

  
  const [gameState, setGameState] = useState('MENU'); 
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  
  const [usernameInput, setUsernameInput] = useState('');
  const [savedName, setSavedName] = useState(null);
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [loadingLB, setLoadingLB] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  
  const game = useRef({
    state: 'MENU',
    stack: [],
    current: null,
    debris: [],
    particles: [],
    cameraY: 0,
    shake: 0,
    combo: 0,
    perfectCount: 0,
    startTime: 0,
    time: 0,
    score: 0
  });

  
  const GAME_WIDTH = 320;
  const GAME_HEIGHT = 550;
  const BLOCK_HEIGHT = 35;
  const BASE_WIDTH = 220;
  const INITIAL_SPEED = 4;

  const NOTES = [261.63, 293.66, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99];
  const BIOMES = [
    { score: 0, name: "THE TRENCHES", bgStart: '#1a1a2e', bgEnd: '#16213e', text: '#fff' },
    { score: 10, name: "ATMOSPHERE", bgStart: '#2b5876', bgEnd: '#4e4376', text: '#fff' },
    { score: 25, name: "ORBIT", bgStart: '#000000', bgEnd: '#434343', text: '#00ff00' },
    { score: 50, name: "LUNAR BASE", bgStart: '#232526', bgEnd: '#414345', text: '#fff' },
    { score: 75, name: "MARS COLONY", bgStart: '#870000', bgEnd: '#190a05', text: '#ffcc00' },
    { score: 100, name: "THE CITADEL", bgStart: '#cc95c0', bgEnd: '#dbd4b4', text: '#000' },
  ];
  const [currentBiome, setCurrentBiome] = useState(BIOMES[0]);

  
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);

    
    const localHighScore = localStorage.getItem('stackItHighScore');
    if (localHighScore) setHighScore(parseInt(localHighScore, 10));

    
    const localName = localStorage.getItem('stackItUsername');
    if (localName) {
      setSavedName(localName);
      setUsernameInput(localName);
    }

    return () => {
      unsubscribe();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (['MENU', 'GAME_OVER'].includes(game.current.state)) {
          startGame();
        } else if (game.current.state === 'NEW_HIGHSCORE') {
           
           if (savedName) handleReturningSubmit('RETRY');
        } else if (game.current.state === 'PLAYING') {
          placeBlock();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savedName]); 

  

  const fetchLeaderboard = async () => {
    if (!user) return;
    setLoadingLB(true);
    try {
      const q = collection(db, 'artifacts', appId, 'public', 'data', 'stackit_scores');
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => Number(b.score) - Number(a.score));

      
      const currentName = localStorage.getItem('stackItUsername'); 
      if (currentName) {
        const rank = sorted.findIndex(x => x.username === currentName) + 1;
        setPlayerRank(rank > 0 ? rank : null);
      }

      setLeaderboard(sorted.slice(0, 10));
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    }
    setLoadingLB(false);
  };

  const saveScoreToDb = async (nameToUse, scoreToSave) => {
    if (!user) return false;

    try {
      const upperName = nameToUse.toUpperCase().trim();
      const uid = user.uid;
      const scoresRef = collection(db, 'artifacts', appId, 'public', 'data', 'stackit_scores');
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'stackit_scores', uid);

      
      const isReturningUser = !!localStorage.getItem('stackItUsername');

      if (!isReturningUser) {
        const snapshot = await getDocs(scoresRef);
        let isTaken = false;
        snapshot.forEach(d => {
          if (d.data().username === upperName && d.id !== uid) isTaken = true;
        });

        if (isTaken) {
          alert(`USERNAME '${upperName}' IS TAKEN.`);
          return false;
        }
        
        
        localStorage.setItem('stackItUsername', upperName);
        setSavedName(upperName); 
      }

      
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        
        await setDoc(docRef, {
          username: upperName,
          score: scoreToSave,
          timestamp: Date.now()
        });
      } else {
        
        const existingScore = Number(snap.data().score || 0);
        if (scoreToSave > existingScore) {
          await updateDoc(docRef, {
            score: scoreToSave,
            timestamp: Date.now(),
            username: upperName 
          });
        }
      }

      return true;
    } catch (e) {
      console.error("DB Error:", e);
      return false;
    }
  };

  

  
  const handleFirstTimeSubmit = async () => {
    if (!usernameInput.trim()) {
      alert("ENTER NAME TO SAVE SCORE");
      return;
    }
    setIsSubmitting(true);
    const success = await saveScoreToDb(usernameInput, game.current.score);
    setIsSubmitting(false);

    if (success) {
      
      await fetchLeaderboard();
      setGameState('LEADERBOARD');
      game.current.state = 'LEADERBOARD';
    }
  };

  
  const handleReturningSubmit = async (action) => {
    const name = savedName || localStorage.getItem('stackItUsername');
    if (!name) return; 

    setIsSubmitting(true);
    
    await saveScoreToDb(name, game.current.score);
    setIsSubmitting(false);

    if (action === 'RETRY') {
      startGame();
    } else if (action === 'RANK') {
      await fetchLeaderboard();
      setGameState('LEADERBOARD');
      game.current.state = 'LEADERBOARD';
    }
  };

  
  const initAudio = () => {
    if (!audioCtxRef.current) {
      try { audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) {}
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  };

  const playSound = (type) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'perfect') {
      osc.type = 'square';
      const noteFreq = NOTES[game.current.perfectCount % NOTES.length] * (1 + Math.floor(game.current.perfectCount/NOTES.length)*0.5);
      osc.frequency.setValueAtTime(noteFreq, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } else if (type === 'place') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.linearRampToValueAtTime(50, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(20, t + 0.5);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    }
  };

  const spawnBlock = (prev, level) => {
    const isLeft = Math.random() > 0.5;
    const yPos = level * BLOCK_HEIGHT;
    const speed = INITIAL_SPEED + Math.pow(level, 0.6) * 0.5;
    return {
      x: isLeft ? -prev.w : GAME_WIDTH,
      y: yPos,
      w: prev.w,
      h: BLOCK_HEIGHT,
      dir: isLeft ? 1 : -1,
      speed: Math.min(speed, 15),
      color: `hsl(${(level * 10) % 360}, 70%, 60%)`
    };
  };

  const createParticles = (x, y, w, h, color, count = 10) => {
    for(let i=0; i<count; i++) {
      game.current.particles.push({
        x: x + Math.random() * w,
        y: y + Math.random() * h,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: color
      });
    }
  };

  const startGame = (e) => {
    if(e) { e.stopPropagation(); e.preventDefault(); }
    initAudio();

    
    game.current = {
        state: 'PLAYING',
        stack: [],
        current: null,
        debris: [],
        particles: [],
        cameraY: 0,
        shake: 0,
        combo: 0,
        perfectCount: 0,
        startTime: Date.now(),
        time: 0,
        score: 0
    };

    setScore(0);
    setGameState('PLAYING');
    setCurrentBiome(BIOMES[0]);

    const base = {
      x: (GAME_WIDTH - BASE_WIDTH) / 2,
      y: 0,
      w: BASE_WIDTH,
      h: BLOCK_HEIGHT,
      color: '#33ff33'
    };

    game.current.stack = [base];
    game.current.current = spawnBlock(base, 1);

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(loop);
  };

  const placeBlock = () => {
    const g = game.current;
    if (g.state !== 'PLAYING') return;
    if (Date.now() - g.startTime < 200) return;

    const curr = g.current;
    if (!curr) return;

    const prev = g.stack[g.stack.length-1];
    const dist = curr.x - prev.x;
    const absDist = Math.abs(dist);
    const tolerance = 10;

    
    if (absDist > curr.w) {
      createParticles(curr.x, curr.y, curr.w, curr.h, '#ff0000', 20);
      g.shake = 20;
      gameOver();
      return;
    }

    let newX = curr.x;
    let newW = curr.w;
    let isPerfect = false;
    let scoreAdd = 1;

    
    if (absDist <= tolerance) {
      newX = prev.x;
      newW = prev.w;
      isPerfect = true;
      g.combo++;
      g.perfectCount++;
      if (g.combo >= 3) scoreAdd = 2; 

      if (g.combo >= 3 && newW < BASE_WIDTH) {
        newW = Math.min(BASE_WIDTH, newW + 20);
        newX = prev.x - 10;
      }
      g.shake = 5;
      playSound('perfect', g.perfectCount);
      createParticles(newX, curr.y, newW, curr.h, '#ffffff', 10);
    } else {
      g.combo = 0;
      g.perfectCount = 0;
      newW = curr.w - absDist;
      newX = dist > 0 ? curr.x : prev.x;
      const debrisX = dist > 0 ? curr.x + newW : curr.x;
      const debrisW = absDist;
      g.debris.push({
        x: debrisX, y: curr.y, w: debrisW, h: curr.h,
        vx: dist > 0 ? 4 : -4, vy: -2, color: curr.color, life: 1.0
      });
      g.shake = 2;
      playSound('place');
    }

    const placed = { x: newX, y: curr.y, w: newW, h: curr.h, color: curr.color, perfect: isPerfect };
    g.stack.push(placed);

    g.score += scoreAdd;
    setScore(g.score);

    
    if (g.score > highScore) {
        setHighScore(g.score);
        localStorage.setItem('stackItHighScore', g.score);
    }

    const biome = BIOMES.slice().reverse().find(b => g.score >= b.score);
    if (biome && biome.name !== currentBiome.name) setCurrentBiome(biome);

    g.current = spawnBlock(placed, g.stack.length);
  };

  const gameOver = () => {
    playSound('fail');
    const finalScore = game.current.score;

    
    
    const storedHS = parseInt(localStorage.getItem('stackItHighScore') || '0', 10);
    
    
    
    if (finalScore > 0 && finalScore >= storedHS) {
        setGameState('NEW_HIGHSCORE');
        game.current.state = 'NEW_HIGHSCORE';
    } else {
        setGameState('GAME_OVER');
        game.current.state = 'GAME_OVER';
    }
    setTimeout(() => cancelAnimationFrame(requestRef.current), 1000);
  };

  const loop = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const g = game.current;
    g.time += 0.05;

    
    if (g.state === 'PLAYING' && g.current) {
      g.current.x += g.current.speed * g.current.dir;
      if (g.current.x > GAME_WIDTH + 50) g.current.dir = -1;
      if (g.current.x < -50 - g.current.w) g.current.dir = 1;

      const stackTop = g.stack.length * BLOCK_HEIGHT;
      const targetY = Math.max(0, stackTop - (GAME_HEIGHT * 0.4));
      g.cameraY += (targetY - g.cameraY) * 0.1;
    }

    g.shake *= 0.8;
    const shakeX = (Math.random() - 0.5) * g.shake;
    const shakeY = (Math.random() - 0.5) * g.shake;

    g.debris.forEach(d => { d.x += d.vx; d.y += d.vy; d.vy += 0.5; d.life -= 0.02; });
    g.debris = g.debris.filter(d => d.life > 0);

    g.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.03; });
    g.particles = g.particles.filter(p => p.life > 0);

    
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, currentBiome.bgStart);
    gradient.addColorStop(1, currentBiome.bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridOffset = (g.cameraY * 0.5) % 40;
    for (let x=0; x<GAME_WIDTH; x+=40) { ctx.moveTo(x,0); ctx.lineTo(x,GAME_HEIGHT); }
    for (let y=0; y<GAME_HEIGHT; y+=40) { ctx.moveTo(0,y+gridOffset); ctx.lineTo(GAME_WIDTH,y+gridOffset); }
    ctx.stroke();

    ctx.save();
    ctx.translate(0 + shakeX, GAME_HEIGHT + g.cameraY - 50 + shakeY);

    g.stack.forEach(b => {
      const y = -b.y;
      if (b.perfect) { ctx.shadowBlur = 15; ctx.shadowColor = '#fff'; } else { ctx.shadowBlur = 0; }
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, y - b.h, b.w, b.h);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, y - b.h, b.w, b.h);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(b.x + b.w/2 - 1, y - b.h - 8, 2, 8);
      ctx.shadowBlur = 0;
    });

    g.debris.forEach(d => {
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.life;
      ctx.fillRect(d.x, -d.y - d.h, d.w, d.h);
      ctx.globalAlpha = 1;
    });

    g.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, -p.y, 3, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (g.state === 'PLAYING' && g.current) {
      const c = g.current;
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, -c.y - c.h, c.w, c.h);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(c.x, 0, c.w, -9999);
    }

    if (highScore > 0) {
      const athY = -(highScore * BLOCK_HEIGHT);
      ctx.strokeStyle = '#ffff00';
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(-50, athY); ctx.lineTo(GAME_WIDTH+50, athY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ffff00';
      ctx.font = '10px monospace';
      ctx.fillText('ATH', 10, athY - 5);
    }

    ctx.restore();

    ctx.fillStyle = currentBiome.text;
    ctx.font = '900 40px Impact';
    ctx.textAlign = 'center';
    ctx.fillText(g.score, GAME_WIDTH/2, 60);
    ctx.font = '12px monospace';
    ctx.fillText(currentBiome.name, GAME_WIDTH/2, 80);

    if (g.combo > 1) {
      ctx.fillStyle = `hsl(${g.time * 500}, 100%, 50%)`;
      ctx.font = 'italic 900 20px Arial';
      ctx.save();
      ctx.translate(GAME_WIDTH/2, 110);
      ctx.rotate(Math.sin(g.time*10)*0.1);
      ctx.fillText(`${g.combo}X COMBO! (+2)`, 0, 0);
      ctx.restore();
    }

    if (g.state === 'PLAYING') {
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  const openLeaderboard = (e) => {
      if(e) { e.stopPropagation(); e.preventDefault(); }
      fetchLeaderboard();
      setGameState('LEADERBOARD');
      game.current.state = 'LEADERBOARD';
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-1 font-mono select-none"
         onPointerDown={(e) => {
           if (game.current.state === 'PLAYING') {
               e.preventDefault();
               placeBlock();
           }
         }}
    >
      <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center text-xs font-bold border-2 border-white border-r-gray-500 border-b-gray-500 mb-1">
        <span>STACK_IT.EXE</span>
        <span className="text-yellow-300">ATH: {highScore}</span>
      </div>

      <div className="flex-1 bg-black relative border-2 border-gray-600 border-r-white border-b-white overflow-hidden cursor-pointer touch-none">
        <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="w-full h-full object-contain block touch-none" />

        {/* MENU */}
        {gameState === 'MENU' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-center text-white p-6 z-10">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-t from-green-600 to-green-300 mb-2 drop-shadow-lg italic">STACK IT</h1>
            <p className="text-sm font-bold text-gray-300 mb-8 tracking-widest">BUILD THE GOD CANDLE</p>
            <div className="flex gap-2">
                <button onPointerDown={startGame} className="animate-pulse bg-white text-black px-4 py-2 font-black border-4 border-blue-500 shadow-[4px_4px_0_#0000ff] cursor-pointer hover:scale-105 transition-transform">
                TAP TO PUMP
                </button>
                <button onPointerDown={openLeaderboard} className="bg-yellow-400 text-black px-4 py-2 font-black border-4 border-orange-500 shadow-[4px_4px_0_#ff0000] cursor-pointer hover:scale-105 transition-transform">
                RANK
                </button>
            </div>
          </div>
        )}

        {/* NEW HIGH SCORE (ATH) SCREEN - THE FIX */}
        {gameState === 'NEW_HIGHSCORE' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/95 text-center text-white p-6 z-20 pointer-events-auto" onPointerDown={e=>e.stopPropagation()}>
            <h1 className="text-4xl font-black text-yellow-400 mb-2 animate-bounce">GGs NEW ATH!</h1>
            <div className="text-6xl font-black text-white mb-6">{score}</div>

            {savedName ? (
                
                <div className="flex flex-col items-center w-full">
                    <div className="mb-6 flex flex-col items-center">
                        <p className="text-xs text-blue-300 font-bold mb-1">CONTINUE AS</p>
                        <div className="text-2xl font-black text-white bg-blue-950 border-2 border-blue-400 px-4 py-2 uppercase tracking-widest shadow-md">
                            {savedName}
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onPointerDown={() => handleReturningSubmit('RETRY')}
                            disabled={isSubmitting}
                            className="bg-white text-blue-900 px-6 py-3 font-black border-4 border-blue-500 shadow-[4px_4px_0_#000] cursor-pointer hover:scale-105 transition-transform w-32 flex justify-center"
                        >
                            {isSubmitting ? '...' : 'RETRY'}
                        </button>
                        <button
                            onPointerDown={() => handleReturningSubmit('RANK')}
                            disabled={isSubmitting}
                            className="bg-yellow-400 text-black px-6 py-3 font-black border-4 border-orange-500 shadow-[4px_4px_0_#ff0000] cursor-pointer hover:scale-105 transition-transform w-32 flex justify-center"
                        >
                            {isSubmitting ? '...' : 'RANK'}
                        </button>
                    </div>
                    <p className="text-[10px] text-blue-300 mt-4 max-w-[200px]">CLICKING RETRY OR RANK SAVES YOUR SCORE ON-CHAIN</p>
                </div>
            ) : (
                
                <div className="flex flex-col items-center w-full">
                    <p className="text-xs text-blue-200 mb-2 font-bold">ENTER DEGEN NAME:</p>
                    <input
                        type="text"
                        maxLength={10}
                        className="bg-blue-950 border-2 border-blue-400 text-white text-center text-xl font-bold p-2 mb-6 uppercase w-48 outline-none focus:border-yellow-400"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value.toUpperCase())}
                        placeholder="USERNAME"
                        onPointerDown={e => e.stopPropagation()}
                    />
                    
                    <button
                        onPointerDown={handleFirstTimeSubmit}
                        disabled={isSubmitting}
                        className="bg-green-500 text-white px-6 py-3 font-black border-4 border-green-700 shadow-[4px_4px_0_#003300] cursor-pointer hover:scale-105 transition-transform w-48 flex justify-center"
                    >
                        {isSubmitting ? 'SAVING...' : 'SUBMIT TO CHAIN'}
                    </button>
                </div>
            )}
          </div>
        )}

        {/* LEADERBOARD */}
        {gameState === 'LEADERBOARD' && (
          <div className="absolute inset-0 flex flex-col items-center bg-blue-900/95 text-white p-4 z-20 pointer-events-auto" onPointerDown={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center w-full border-b-4 border-yellow-300 pb-2 mb-2">
                <h2 className="text-2xl font-black text-yellow-300">TOP JEET SLAYERS</h2>
                {playerRank && <div className="bg-black/50 px-2 py-1 text-xs font-bold border border-yellow-300 text-yellow-300">YOUR POSITION: #{playerRank}</div>}
            </div>

            <div className="flex-1 w-full overflow-y-auto mb-4 border-2 border-white bg-black/50 p-2">
                {loadingLB ? <div className="text-center mt-10 animate-pulse">LOADING ON-CHAIN DATA...</div> : (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-600"><th className="pb-1">#</th><th className="pb-1">NAME</th><th className="pb-1 text-right">HT</th></tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, i) => {
                                
                                const isCurrentUser = savedName && entry.username === savedName;
                                return (
                                    <tr key={i} className="border-b border-gray-800 text-gray-300">
                                        <td className="py-2">{i+1}</td>
                                        <td className={`py-2 ${isCurrentUser ? 'text-orange-500 font-black' : ''}`}>
                                            {entry.username} {isCurrentUser && ' (YOU)'}
                                        </td>
                                        <td className="py-2 text-right text-green-400">{entry.score}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <button onPointerDown={(e) => { e.stopPropagation(); setGameState('MENU'); game.current.state='MENU'; }} className="bg-white text-blue-900 px-6 py-2 font-black border-4 border-blue-500 shadow-[4px_4px_0_#000]">
                BACK TO MENU
            </button>
          </div>
        )}

        {/* STANDARD GAME OVER (No New High Score) - No Writes to DB Here */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 text-center text-white p-6 z-10 pointer-events-none">
            <h1 className="text-4xl font-black mb-2">PAPER HANDS!</h1>
            <div className="text-6xl font-black text-yellow-400 mb-2">{game.current.score}</div>
            <p className="text-xs mb-8 text-red-200">YOU SOLD TOO EARLY</p>
            <div className="flex gap-2">
                <button
                    onPointerDown={startGame}
                    className="bg-white text-black px-6 py-3 font-black border-4 border-gray-400 shadow-[4px_4px_0_#000] cursor-pointer hover:bg-gray-100 hover:scale-105 transition-transform pointer-events-auto"
                >
                BUY THE DIP (RETRY)
                </button>
                <button
                    onPointerDown={openLeaderboard}
                    className="bg-gray-800 text-white px-4 py-3 font-bold border-4 border-gray-600 cursor-pointer pointer-events-auto"
                >
                RANK
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MemesApp = () => {
  const images = Object.values(ASSETS.memes);
  const keys = Object.keys(ASSETS.memes);
  const [selectedIndex, setSelectedIndex] = useState(null);
  if (selectedIndex !== null) {
    return (
      <div className="flex flex-col h-full bg-black text-white relative">
        <div className="flex-1 flex items-center justify-center p-4 bg-[#1a1a1a]">
          <img src={images[selectedIndex]} className="max-w-full max-h-full object-contain border-4 border-white shadow-2xl" alt="Meme" />
        </div>
        <div className="absolute bottom-16 left-0 w-full flex justify-between px-4">
           <button onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}} className="bg-white/20 p-4 rounded-full backdrop-blur"><SkipBack size={32} /></button>
           <button onClick={(e) => { e.stopPropagation(); setSelectedIndex((selectedIndex + 1) % images.length)}} className="bg-white/20 p-4 rounded-full backdrop-blur"><SkipForward size={32} /></button>
        </div>
        <div className="bg-[#c0c0c0] p-2 border-t border-white flex justify-center text-black">
            <Button onClick={() => setSelectedIndex(null)} className="w-full h-10">Back to Grid</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white h-full p-4 grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto content-start">
        {images.map((src, i) => (
            <div key={i} className="group cursor-pointer flex flex-col items-center gap-1 p-1 hover:bg-blue-100 border border-transparent rounded active:opacity-50" onClick={() => setSelectedIndex(i)}>
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center border border-gray-300 shadow-sm"><img src={src} className="max-w-full max-h-full object-contain" /></div>
                <div className="text-center text-[10px] font-mono truncate w-full px-1">{keys[i]}</div>
            </div>
        ))}
    </div>
  );
};


const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [isConnected, setIsConnected] = useState(false); 
  const [cooldown, setCooldown] = useState(0);
  const [userUid, setUserUid] = useState(null);
  const [sendError, setSendError] = useState(null);
  const scrollRef = useRef(null);
  const [pendingMessages, setPendingMessages] = useState([]);

  
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Auth Error:", e);
        setSendError("Auth Failed.");
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    const savedName = localStorage.getItem('trollbox_username');
    if (savedName) {
      setUsername(savedName);
      setIsSetup(true);
    }
  }, []);

  
  useEffect(() => {
    if (!userUid) return;
    
    
    
    const q = query(
        collection(db, 'artifacts', appId, 'public', 'data', 'trollbox_messages'),
        orderBy('timestamp', 'desc'),
        limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const rawMsgs = snapshot.docs.map(doc => {
            const data = doc.data();
            let ts = Date.now();
            if (data.timestamp) {
                if (typeof data.timestamp.toDate === 'function') {
                    ts = data.timestamp.toDate().getTime();
                } else if (typeof data.timestamp === 'number') {
                    ts = data.timestamp;
                }
            }
            return { id: doc.id, ...data, _normalizedTs: ts };
        });

        
        const finalMsgs = rawMsgs.reverse();
        
        setMessages(finalMsgs);
        setIsConnected(true); 
    }, (error) => {
        console.error("Chat Error:", error);
        setSendError("Connection Lost.");
    });

    return () => unsubscribe();
  }, [userUid]);

  
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, pendingMessages, isConnected]); 

  
  const handleSetUser = () => {
      const name = username.trim().toUpperCase().slice(0, 12);
      if (name.length < 2) return; 
      localStorage.setItem('trollbox_username', name);
      setUsername(name);
      setIsSetup(true);
  };

  const handleResetUser = () => {
      if(confirm("Reset Identity?")) {
          localStorage.removeItem('trollbox_username');
          setIsSetup(false);
          setUsername("");
      }
  };

  const handleSend = async (e) => {
      if(e) e.preventDefault();
      if (!inputText.trim() || cooldown > 0) return; 

      const textToSend = inputText.trim().slice(0, 140);
      setInputText("");
      setCooldown(2);
      setSendError(null);

      const tempId = "temp_" + Date.now();
      const optimisticMsg = { 
          id: tempId, text: textToSend, user: username, _normalizedTs: Date.now(), pending: true 
      };
      
      setPendingMessages(prev => [...prev, optimisticMsg]);

      try {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'trollbox_messages'), {
              text: textToSend,
              user: username,
              timestamp: serverTimestamp(),
              uid: userUid || 'anon'
          });
          setPendingMessages(prev => prev.filter(m => m.id !== tempId));
      } catch (err) {
          setPendingMessages(prev => prev.filter(m => m.id !== tempId));
          setSendError("Send failed!");
          setInputText(textToSend);
      }

      let timer = 2;
      const interval = setInterval(() => {
          timer--;
          setCooldown(timer);
          if (timer <= 0) clearInterval(interval);
      }, 1000);
  };

  const formatTime = (ts) => {
      if (!ts) return "--:--";
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayMessages = [...messages, ...pendingMessages.filter(pm => !messages.find(m => m.text === pm.text && m.user === pm.user))];

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs border-2 border-gray-600 shadow-xl">
      <div className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold border-b-2 border-white select-none">
        <div className="flex items-center gap-2">
            <MessageSquare size={14}/>
            <span>TROLLBOX.EXE</span>
        </div>
        <div className={`text-[10px] flex items-center gap-1 ${isConnected ? 'text-green-300' : 'text-red-300'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}></div>
            {isConnected ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      {!isSetup ? (
        <div className="flex-1 bg-[#000000] flex flex-col items-center justify-center p-6 text-green-500 font-mono">
            <User size={48} className="text-green-500 mb-4 animate-pulse"/>
            <p className="mb-2 text-green-400 tracking-widest text-xs">ENTER ALIAS</p>
            <input autoFocus className="bg-[#111] border-2 border-green-700 text-green-400 p-2 w-full max-w-[200px] text-center outline-none uppercase font-bold text-lg mb-4" placeholder="USERNAME" maxLength={12} value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSetUser()} />
            <button onClick={handleSetUser} className="bg-green-700 text-black font-bold px-8 py-2 hover:bg-green-500 w-full max-w-[200px]">INITIALIZE</button>
        </div>
      ) : (
        <>
            <div className="flex-1 bg-white border-2 border-gray-500 m-1 overflow-hidden relative flex flex-col shadow-inner">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-sm">
                    {displayMessages.map((msg) => {
                        const isMe = msg.user === username;
                        return (
                            <div key={msg.id} className={`flex gap-2 ${msg.pending ? 'opacity-50' : ''}`}>
                                <span className="text-gray-400 text-[10px] min-w-[42px] pt-1 select-none font-sans">{formatTime(msg._normalizedTs)}</span>
                                <div className="flex-1 break-words leading-tight py-0.5">
                                    <span className={`font-bold mr-1 cursor-pointer hover:underline text-xs ${isMe ? 'text-blue-700' : 'text-purple-800'}`}>&lt;{msg.user}&gt;</span>
                                    <span className="text-[#222]">{msg.text}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {sendError && <div className="bg-red-100 text-red-700 px-4 py-1 text-xs">{sendError}</div>}
            <div className="h-10 bg-[#d4d0c8] p-1 flex gap-1 border-t border-white shadow-md">
                <input className="flex-1 border-2 border-gray-500 px-2 font-mono outline-none text-sm" placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Message..."} value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(e)} disabled={cooldown > 0} maxLength={140} />
                <button onClick={handleSend} disabled={cooldown > 0 || !inputText.trim()} className="w-12 bg-[#c0c0c0] border-2 border-gray-400 border-l-white border-t-white flex items-center justify-center">
                    {cooldown > 0 ? <span className="text-red-600 font-bold">{cooldown}</span> : <Send size={16} className="text-blue-700"/>}
                </button>
            </div>
            <div className="bg-[#c0c0c0] px-2 py-0.5 text-[10px] flex justify-between text-gray-600 border-t border-gray-400">
                <span>USER: {username}</span>
                <button onClick={handleResetUser} className="hover:text-red-600">LOGOUT</button>
            </div>
        </>
      )}
    </div>
  );
};



const NotepadApp = () => {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("READY");
  
  
  useEffect(() => {
    const saved = localStorage.getItem('write_it_content');
    if (saved) setContent(saved);
  }, []);

  
  const handleChange = (e) => {
    const text = e.target.value;
    setContent(text);
    localStorage.setItem('write_it_content', text);
    setStatus("SAVING...");
    setTimeout(() => setStatus("SAVED"), 500);
  };

  const clearNote = () => {
    if (window.confirm("BURN MANIFESTO?")) {
      setContent("");
      localStorage.removeItem('write_it_content');
      setStatus("CLEARED");
    }
  };

  const publishIt = () => {
    if (!content.trim()) return;
    const text = encodeURIComponent(content.slice(0, 280)); 
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setStatus("PUBLISHED");
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "manifesto.txt";
    document.body.appendChild(element);
    element.click();
    setStatus("DOWNLOADED");
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-sm border-2 border-gray-600">
      {/* TOOLBAR */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 bg-[#d4d0c8]">
        <button onClick={downloadTxt} className="px-2 py-1 flex items-center gap-1 border border-transparent hover:border-gray-500 hover:bg-gray-200 active:border-black active:border-t-2 active:border-l-2 text-xs">
            <Save size={14} className="text-blue-800"/> SAVE
        </button>
        <button onClick={publishIt} className="px-2 py-1 flex items-center gap-1 border border-transparent hover:border-gray-500 hover:bg-gray-200 active:border-black active:border-t-2 active:border-l-2 text-xs">
            <Share size={14} className="text-[#1da1f2]"/> POST IT
        </button>
        <div className="w-px h-4 bg-gray-400 mx-1"></div>
        <button onClick={clearNote} className="px-2 py-1 flex items-center gap-1 border border-transparent hover:border-gray-500 hover:bg-gray-200 active:border-black active:border-t-2 active:border-l-2 text-xs text-red-700">
            <Trash2 size={14}/> BURN
        </button>
        
        <div className="flex-1"></div>
        <span className="text-[10px] text-gray-500 font-mono mr-1">{status}</span>
      </div>

      {/* EDITOR AREA */}
      <div className="flex-1 relative bg-white border-2 border-gray-600 border-r-white border-b-white m-1 overflow-hidden">
        <textarea 
            className="w-full h-full resize-none outline-none p-2 font-mono text-sm leading-relaxed text-black"
            value={content}
            onChange={handleChange}
            placeholder="Write your manifesto here..."
            spellCheck="false"
        />
      </div>

      {/* STATUS BAR */}
      <div className="h-6 bg-[#d4d0c8] border-t border-white flex items-center px-2 text-[10px] gap-4 font-mono text-gray-600">
         <span>CHARS: {content.length}</span>
         <span>WORDS: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
         <span className="flex-1 text-right">UTF-8</span>
      </div>
    </div>
  );
};



const MemeMindApp = () => {
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  
 const API_KEY = (() => {
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OR_PROVIDER_ID) 
        return import.meta.env.VITE_OR_PROVIDER_ID;
    } catch (e) {}

    try {
      if (typeof process !== 'undefined' && process.env?.VITE_OR_PROVIDER_ID) 
        return process.env.VITE_OR_PROVIDER_ID;
    } catch (e) {}

    try {
      if (typeof window !== 'undefined' && window.VITE_OR_PROVIDER_ID) 
        return window.VITE_OR_PROVIDER_ID;
    } catch (e) {}

    return "";
  })();

  console.log("MemeMind Handshake:", API_KEY ? "ESTABLISHED" : "OFFLINE");

  const generateIdea = async () => {
    setLoading(true);
    setError(null);

    const systemPrompt = `You are the $IT Meme Architect. 
    Your goal is to generate short, viral, and catchy meme ideas or tweet drafts for the $IT memecoin on Solana.
    RULES:
    1. Focus on the word "IT".
    2. Be funny, slightly toxic (degen-style), and high-energy.
    3. Keep ideas short (under 200 characters).
    4. Provide ONE idea per request.
    5. Don't use hashtags, just the text.
    6. never write "IT's", write "IT is".`;

    const userPrompt = "Generate a fresh, viral meme idea or tweet about $IT.";

    
    if (!API_KEY) {
      setError("NEURAL LINK OFFLINE.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        credentials: 'omit',
        headers: {
          "Authorization": `Bearer ${API_KEY.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "IT_OS_MemeMind"
        },
        body: JSON.stringify({
  model: "meta-llama/llama-3.3-70b-instruct", 
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    ...newHistory.slice(-6).map(m => ({ 
      role: m.role === 'shippy' ? 'assistant' : 'user', 
      content: m.text 
    }))
  ],
  max_tokens: 100,
  temperature: 1.2
})
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API REJECTED");

      const result = data.choices[0]?.message?.content || "SYSTEM ERROR: ALPHA NOT FOUND.";
      setIdea(result.replace(/"/g, '')); 
    } catch (e) {
      console.error("AI Error Details:", e);
      setError("SYSTEM OVERLOAD. TOO MANY DEGENS WANT IT. TRY AGAIN IN A MINUTE T.");
    } finally {
      setLoading(false);
    }
  };

  const shareToX = () => {
    if (!idea) return;
    const text = encodeURIComponent(`${idea}\n\n$IT #ITOS #SENDIT`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-[#00ff00] font-mono border-2 border-gray-600 overflow-hidden shadow-2xl">
      {/* HEADER */}
      <div className="bg-[#1a1a1a] p-2 border-b border-green-900 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
            <Lightbulb size={14} className="text-yellow-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-white">MEME_MIND_IT_V2.0</span>
        </div>
        <div className="bg-green-900/30 px-2 py-0.5 rounded text-[8px] text-green-400 border border-green-800">
            STATUS: ACTIVE
        </div>
      </div>

      {/* GENERATION AREA */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-6 relative bg-[radial-gradient(circle,_#0a2a0a_0%,_#000_100%)]">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden text-[8px] leading-none select-none">
            {Array(40).fill("IT ").join(" ")}
        </div>

        {!idea && !loading && !error && (
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center bg-green-950/20 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                    <Sparkles size={32} className="text-green-400" />
                </div>
                <p className="text-[10px] text-green-700 max-w-[200px] uppercase font-bold tracking-tighter">Click the button below to extract viral alpha from the neural network.</p>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center gap-2">
                <RefreshCw size={32} className="animate-spin text-green-400" />
                <p className="text-[10px] tracking-widest animate-pulse font-bold">DECRYPTING MEMETIC ASSETS...</p>
            </div>
        )}

        {error && (
            <div className="bg-red-900/20 border-2 border-red-500 p-4 rounded text-red-400 text-[10px] flex flex-col items-center gap-2">
                <X size={20} />
                <p className="font-bold">{error}</p>
            </div>
        )}

        {idea && !loading && (
            <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="bg-black/80 border-2 border-green-900 p-4 rounded shadow-[inset_0_0_20px_rgba(0,255,0,0.1)] relative">
                    <div className="absolute -top-2 left-4 bg-[#0c0c0c] px-2 text-[8px] text-green-600 font-bold">AI_LOG_OUTPUT</div>
                    <p className="text-sm md:text-base font-bold italic text-white leading-relaxed">
                        "{idea}"
                    </p>
                </div>
                
                <button 
                    onClick={shareToX}
                    className="w-full bg-[#1da1f2] hover:bg-[#1a91da] text-white py-2 border-2 border-white/20 rounded flex items-center justify-center gap-2 font-black text-[10px] transition-all active:scale-95 uppercase shadow-lg"
                >
                    <Share2 size={14} /> SHARE IT ON X
                </button>
            </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="p-4 bg-[#1a1a1a] border-t border-green-900 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
        <button 
          onClick={generateIdea}
          disabled={loading}
          className={`
            w-full py-4 border-2 font-black tracking-tighter transition-all flex items-center justify-center gap-2 uppercase
            ${loading 
              ? 'bg-black border-green-900 text-green-900 cursor-not-allowed' 
              : 'bg-green-600 border-green-400 text-black hover:bg-green-400 active:translate-y-1 shadow-[4px_4px_0px_#052c05]'}
          `}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {idea ? "GIVE ME ANOTHER ONE" : "GENERATE ALPHA"}
        </button>
      </div>

      <div className="bg-black p-1 text-[7px] text-green-900 text-center uppercase tracking-widest border-t border-green-950">
        IT_OS NEURAL LINK ESTABLISHED 
      </div>
    </div>
  );
};




const TILE_DATA = {
  2:    { label: 'PEANUTS', color: '#1a1a1a', text: '#555', scale: 'scale-90' },
  4:    { label: 'DUST', color: '#2a2a2a', text: '#888', scale: 'scale-95' },
  8:    { label: 'FISH', color: '#003311', text: '#00ff66', scale: 'scale-100' },
  16:   { label: 'DOLPHIN', color: '#001133', text: '#0066ff', scale: 'scale-100' },
  32:   { label: 'SHARK', color: '#330033', text: '#ff00ff', scale: 'scale-105' },
  64:   { label: 'WHALE', color: '#330000', text: '#ff4444', scale: 'scale-105' },
  128:  { label: 'KRAKEN', color: '#004444', text: '#00ffff', scale: 'scale-110' },
  256:  { label: 'PUMP', color: '#118811', text: '#fff', scale: 'scale-110' },
  512:  { label: 'MOON', color: '#888800', text: '#fff', scale: 'scale-110' },
  1024: { label: 'MARS', color: '#cc4400', text: '#fff', scale: 'scale-115' },
  2048: { label: 'GOD CANDLE', color: '#00ff00', text: '#000', special: true, scale: 'scale-125' },
  4096: { label: 'ASCENSION', color: '#ffffff', text: '#000', special: true, scale: 'scale-150' },
};

const MergeItApp = () => {
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [marketStatus, setMarketStatus] = useState("STABLE"); 
  
  const audioCtx = useRef(null);
  const touchStart = useRef(null);

  
  const playNote = (freq, type = 'sine', duration = 0.1) => {
    try {
        if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
        
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.start();
        osc.stop(audioCtx.current.currentTime + duration);
    } catch(e) {}
  };

  
  const initGame = useCallback(() => {
    let newGrid = Array(16).fill(null);
    newGrid = addRandomTile(addRandomTile(newGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setMarketStatus("STABLE");
  }, []);

  useEffect(() => {
    const savedBest = localStorage.getItem('mergeItBest');
    if (savedBest) setBest(parseInt(savedBest));
    initGame();
  }, [initGame]);

  const addRandomTile = (currentGrid) => {
    const emptyIndices = currentGrid.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (emptyIndices.length === 0) return currentGrid;
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newGrid = [...currentGrid];
    const threshold = marketStatus === "BULLISH_PUMP" ? 0.6 : 0.9;
    newGrid[randomIndex] = Math.random() < threshold ? 2 : 4;
    return newGrid;
  };

  const move = (direction) => {
    if (gameOver) return;
    let newGrid = [...grid];
    let moved = false;
    let currentScore = score;
    let mergedThisTurn = false;

    const getIndex = (row, col) => row * 4 + col;

    const processLine = (line) => {
      let filtered = line.filter(v => v !== null);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          currentScore += filtered[i];
          filtered.splice(i + 1, 1);
          moved = true;
          mergedThisTurn = true;
        }
      }
      while (filtered.length < 4) filtered.push(null);
      return filtered;
    };

    if (direction === 'UP' || direction === 'DOWN') {
      for (let col = 0; col < 4; col++) {
        let line = [0, 1, 2, 3].map(row => newGrid[getIndex(row, col)]);
        if (direction === 'DOWN') line.reverse();
        let processed = processLine(line);
        if (direction === 'DOWN') processed.reverse();
        processed.forEach((val, row) => {
          if (newGrid[getIndex(row, col)] !== val) moved = true;
          newGrid[getIndex(row, col)] = val;
        });
      }
    } else {
      for (let row = 0; row < 4; row++) {
        let line = [0, 1, 2, 3].map(col => newGrid[getIndex(row, col)]);
        if (direction === 'RIGHT') line.reverse();
        let processed = processLine(line);
        if (direction === 'RIGHT') processed.reverse();
        processed.forEach((val, col) => {
          if (newGrid[getIndex(row, col)] !== val) moved = true;
          newGrid[getIndex(row, col)] = val;
        });
      }
    }

    if (moved) {
      if (mergedThisTurn) playNote(440 + (currentScore % 500), 'square', 0.1);
      else playNote(150, 'sine', 0.05);

      const withRandom = addRandomTile(newGrid);
      setGrid(withRandom);
      setScore(currentScore);

      if (currentScore > best) {
        setBest(currentScore);
        localStorage.setItem('mergeItBest', currentScore);
      }

      
      if (currentScore > 0 && currentScore % 500 < 30 && marketStatus === "STABLE") {
          triggerVolatility(withRandom);
      } else if (currentScore % 500 > 150) {
          setMarketStatus("STABLE");
      }

      checkGameOver(withRandom);
    }
  };

  const triggerVolatility = (currentGrid) => {
      const isRug = Math.random() > 0.6; 
      setMarketStatus(isRug ? "BEARISH_RUG" : "BULLISH_PUMP");
      playNote(isRug ? 80 : 600, 'sawtooth', 0.4);
      
      const filled = currentGrid.map((v, i) => v !== null ? i : null).filter(v => v !== null);
      if (filled.length > 0) {
          const target = filled[Math.floor(Math.random() * filled.length)];
          const newGrid = [...currentGrid];
          if (isRug) newGrid[target] = null; 
          else newGrid[target] *= 2; 
          setGrid(newGrid);
      }
  };

  const checkGameOver = (currentGrid) => {
    if (currentGrid.includes(null)) return;
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4), col = i % 4;
      if (col < 3 && currentGrid[i] === currentGrid[i + 1]) return;
      if (row < 3 && currentGrid[i] === currentGrid[i + 4]) return;
    }
    setGameOver(true);
    playNote(60, 'sawtooth', 0.8);
  };

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          if (e.key === 'ArrowUp') move('UP');
          if (e.key === 'ArrowDown') move('DOWN');
          if (e.key === 'ArrowLeft') move('LEFT');
          if (e.key === 'ArrowRight') move('RIGHT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, marketStatus]);

  const handleTouchStart = (e) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
          if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'RIGHT' : 'LEFT');
          else move(dy > 0 ? 'DOWN' : 'UP');
      }
      touchStart.current = null;
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white font-mono select-none overflow-hidden touch-none"
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}>
      
      {/* 1. FIXED HEADER: VOLATILITY NOTIFICATION BAR */}
      <div className={`h-6 flex items-center justify-center transition-colors duration-500 text-[9px] font-black uppercase tracking-widest
        ${marketStatus === "STABLE" ? 'bg-black text-gray-700' : 
          marketStatus === "BEARISH_RUG" ? 'bg-red-900 text-white animate-pulse' : 'bg-green-800 text-white animate-bounce'}
      `}>
        {marketStatus === "STABLE" ? (
            <span className="flex items-center gap-1 opacity-50"><Info size={10}/> MARKET_STATUS: NOMINAL</span>
        ) : (
            <span className="flex items-center gap-2">
                <AlertTriangle size={12}/> 
                {marketStatus === "BEARISH_RUG" ? "CRITICAL: LIQUIDITY RUGGED!" : "ALERT: WHALE PUMP IN PROGRESS!"}
            </span>
        )}
      </div>

      {/* 2. SUB-HEADER: STATS */}
      <div className="bg-[#111] p-3 border-b border-gray-800 flex justify-between items-center shadow-xl">
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-green-500 tracking-tighter">MERGE_IT.SYS</span>
            <div className="flex gap-2 mt-1">
                <div className="bg-black border border-gray-800 px-2 py-1 rounded min-w-[70px]">
                    <p className="text-[7px] text-gray-500 font-bold leading-none mb-1 uppercase">Current IT</p>
                    <p className="text-sm font-black text-green-400">+{score}</p>
                </div>
                <div className="bg-black border border-gray-800 px-2 py-1 rounded min-w-[70px]">
                    <p className="text-[7px] text-gray-500 font-bold leading-none mb-1 uppercase">High IT</p>
                    <p className="text-sm font-black text-yellow-500">{best}</p>
                </div>
            </div>
        </div>
        <button onClick={initGame} className="w-10 h-10 bg-gray-900 rounded border border-gray-700 flex items-center justify-center hover:bg-green-900 transition-colors">
            <RefreshCw size={18} className="text-gray-400" />
        </button>
      </div>

      {/* 3. MAIN GAME GRID */}
      <div className="flex-1 flex items-center justify-center p-4 relative bg-[radial-gradient(circle,_#111_0%,_#000_100%)]">
        <div className="grid grid-cols-4 gap-2 bg-[#0a0a0a] p-3 rounded-xl border-2 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)] relative">
            {grid.map((val, i) => {
                const data = val ? TILE_DATA[val] || { label: val, color: '#333', text: '#fff', scale: '' } : null;
                return (
                    <div key={i} className={`
                        w-14 h-14 md:w-16 md:h-16 rounded flex flex-col items-center justify-center transition-all duration-200 relative
                        ${!val ? 'bg-[#080808] border border-[#111]' : 'shadow-lg'}
                        ${data?.scale || ''}
                        ${data?.special ? 'shadow-[0_0_20px_#00ff00] z-10' : ''}
                    `}
                    style={val ? { backgroundColor: data.color } : {}}
                    >
                        {val && (
                            <>
                                <span className={`text-[8px] font-black leading-none text-center px-1 uppercase tracking-tighter`} style={{ color: data.text }}>
                                    {data.label}
                                </span>
                                <span className="text-[10px] md:text-xs mt-1 font-bold" style={{ color: data.text }}>
                                    {val}
                                </span>
                                {data?.special && <Zap size={10} className="absolute top-1 right-1 text-white animate-pulse" />}
                            </>
                        )}
                    </div>
                )
            })}
        </div>

        {/* GAME OVER MODAL */}
        {gameOver && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in duration-700 p-8 text-center">
                <Skull size={48} className="text-red-600 mb-4 animate-bounce" />
                <p className="text-red-500 font-black text-2xl mb-1 tracking-tighter">POSITION CLOSED</p>
                <p className="text-gray-500 text-[10px] mb-8 uppercase tracking-widest">You were liquidated by the volatility.<br/>Final score: {score}</p>
                <button onClick={initGame} className="w-full bg-green-600 text-black font-black py-4 rounded border-b-4 border-green-900 active:border-0 hover:bg-green-400 transition-all text-sm uppercase">
                    Try Again
                </button>
            </div>
        )}
      </div>

      {/* 4. FOOTER: CONTROLS HINT */}
      <div className="p-3 bg-[#0a0a0a] border-t border-gray-900 flex justify-center items-center">
         <span className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">
             {window.innerWidth < 768 ? "Swipe IT to Merge IT" : "Use Arrows to Merge IT"}
         </span>
      </div>

      {/* FOOTER TICKER */}
      <div className="bg-black p-1.5 flex gap-4 overflow-hidden border-t border-green-950 whitespace-nowrap">
        <div className="flex gap-10 animate-marquee text-[8px] font-bold text-green-900 tracking-[0.3em] uppercase">
            <span>*** 1 IT = 1 IT ***</span>
            <span>MERGE THE VOID</span>
            <span>GOD CANDLE IMMINENT</span>
            <span>NO PAPER HANDS ALLOWED</span>
            <span>*** 1 IT = 1 IT ***</span>
            <span>MERGE THE VOID</span>
            <span>GOD CANDLE IMMINENT</span>
            <span>NO PAPER HANDS ALLOWED</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 15s linear infinite; }
      `}</style>
    </div>
  );
};






export default function UltimateOS() {
  const [windows, setWindows] = useState([]);
  const [maxZ, setMaxZ] = useState(10);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [booted, setBooted] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false); 
  const dexData = useDexData(CA_ADDRESS);
  const { wallet, connect, connecting } = useWallet();
  const [caCopied, setCaCopied] = useState(false);

  useEffect(() => { setTimeout(() => { setBooted(true); }, 2500); }, []);

  const openApp = (type) => {
    const id = generateId();
    
    const titles = { 
        paint: 'Paint IT', 
        terminal: 'Terminal IT', 
        tunes: 'Tune IT', 
        rugsweeper: 'Stack IT', 
        notepad: 'Write IT', 
        memes: 'Memes',
        trollbox: 'Trollbox IT',
        mememind: 'Meme Mind IT',
        mergeit: 'Merge IT'
    };
    
    
    const isMobile = window.innerWidth < 768;
    
    const isPhoneApp = type === 'rugsweeper' || type === 'trollbox' || type === 'mememind' || type === 'mergeit';
    const isWideApp = type === 'paint' || type === 'memes';
    
    const defaultW = isWideApp ? 640 : (isPhoneApp ? 340 : 500);
    const defaultH = isWideApp ? 480 : (isPhoneApp ? 580 : 400);

    const newWin = { 
      id, type, title: titles[type] || 'App', 
      x: isMobile ? 10 : 50 + (windows.length * 20), 
      y: isMobile ? 20 : 50 + (windows.length * 20), 
      w: isMobile ? window.innerWidth - 20 : defaultW, 
      h: isMobile ? window.innerHeight - 150 : defaultH, 
      z: maxZ+1, isMaximized: false, isMinimized: false 
    };
    
    setWindows([...windows, newWin]);
    setActiveWindowId(id);
    setMaxZ(prev => prev + 1);
  };

  const closeWindow = (id) => setWindows(windows.filter(w => w.id !== id));
  
  const focusWindow = (id) => { 
    setActiveWindowId(id); 
    setWindows(prev => prev.map(w => w.id === id ? { ...w, z: maxZ + 1 } : w)); 
    setMaxZ(prev => prev + 1); 
  };
  
  const toggleMax = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  
  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const restoreWindow = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
    focusWindow(id);
  };

  const moveWindow = (id, x, y) => {
      const safeX = Math.max(-100, Math.min(window.innerWidth - 50, x));
      const safeY = Math.max(0, Math.min(window.innerHeight - 50, y));
      setWindows(prev => prev.map(w => w.id === id ? { ...w, x: safeX, y: safeY } : w));
  };

  const handleTaskbarClick = (id) => {
    const win = windows.find(w => w.id === id);
    if (win.isMinimized) restoreWindow(id);
    else if (activeWindowId === id) minimizeWindow(id);
    else focusWindow(id);
  };
  
  const handleCopyCA = () => {
    copyToClipboard(CA_ADDRESS);
    setCaCopied(true);
    setTimeout(() => setCaCopied(false), 2000);
  };

  const isAnyWindowMaximized = windows.some(w => w.isMaximized && !w.isMinimized);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const startMenu = document.getElementById('start-menu-container');
      const startButton = document.getElementById('start-button');
      if (isStartOpen && startMenu && !startMenu.contains(e.target) && startButton && !startButton.contains(e.target)) {
        setIsStartOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); 
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isStartOpen]);

  if (!booted) return (
    <div className="w-full h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10"></div>
      <h1 className="text-4xl font-bold mb-4 animate-pulse">OS_IT</h1>
      <div className="w-64 h-4 border-2 border-green-500 p-1"><div className="h-full bg-green-500 animate-[width_2s_ease-out_forwards]" style={{width: '0%'}}></div></div>
      <div className="mt-4 text-xs">LOADING PROTOCOLS...</div>
    </div>
  );

  return (
    <div className="w-full h-screen relative overflow-hidden font-sans select-none text-black">
      {/* CRT & Wallpaper */}
      <div className="absolute inset-0 z-[9999] pointer-events-none mix-blend-overlay opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.wallpaper})` }}></div>

      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-4 z-0 flex flex-col gap-4 flex-wrap max-h-full">
        <DesktopIcon icon={Terminal} label="Terminal" onClick={() => openApp('terminal')} />
        <DesktopIcon icon={Lightbulb} label="Meme Mind" onClick={() => openApp('mememind')} />
        <DesktopIcon icon={Joystick} label="Merge IT" onClick={() => openApp('mergeit')} />
        <DesktopIcon icon={Paintbrush} label="Paint IT" onClick={() => openApp('paint')} />
        <DesktopIcon icon={Music} label="Tune IT" onClick={() => openApp('tunes')} />
        <DesktopIcon icon={Gamepad2} label="Stack IT" onClick={() => openApp('rugsweeper')} />
        <DesktopIcon icon={FileText} label="Write IT" onClick={() => openApp('notepad')} />
        <DesktopIcon icon={MessageSquare} label="Trollbox" onClick={() => openApp('trollbox')} />
        <DesktopIcon icon={Folder} label="Memes" onClick={() => openApp('memes')} />
      </div>

      <Shippy hidden={isAnyWindowMaximized} />

      {windows.map(win => (
        <DraggableWindow 
          key={win.id} 
          win={win} 
          isActive={win.id === activeWindowId} 
          onFocus={() => focusWindow(win.id)} 
          onClose={() => closeWindow(win.id)} 
          onMaximize={() => toggleMax(win.id)} 
          onMinimize={() => minimizeWindow(win.id)} 
          onMove={moveWindow}
        >
          {win.type === 'paint' && <PaintApp />}
          {win.type === 'terminal' && <TerminalApp dexData={dexData} />}
          {win.type === 'tunes' && <AmpTunesApp />}
          {win.type === 'rugsweeper' && <RugSweeperApp />}
          {win.type === 'notepad' && <NotepadApp />}
          {win.type === 'trollbox' && <ChatApp />}
          {win.type === 'memes' && <MemesApp />}
          {/* UPDATED: Added new App Renderers */}
          {win.type === 'mememind' && <MemeMindApp />}
          {win.type === 'mergeit' && <MergeItApp />}
        </DraggableWindow>
      ))}

      <div id="start-menu-container">
        <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} onOpenApp={openApp} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 z-[9998] shadow-2xl">
        <Button id="start-button" onClick={() => setIsStartOpen(!isStartOpen)} className="mr-2 font-black italic" active={isStartOpen}>
            <Globe size={16} /> <span className="hidden sm:inline">START</span>
        </Button>
        <div className="w-px h-6 bg-gray-500 mx-2"></div>
        <div className="flex-1 flex gap-1 overflow-x-auto no-scrollbar">
          {windows.map(win => (
            <Button key={win.id} active={win.id === activeWindowId && !win.isMinimized} onClick={() => handleTaskbarClick(win.id)} className={`min-w-[80px] max-w-[120px] truncate justify-start ${win.isMinimized ? 'opacity-70' : ''}`}>
              {win.title}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2 py-1 border-2 border-gray-600 bg-[#c0c0c0] border-b-white border-r-white">
          <Button className={`h-6 text-xs font-mono px-2 ${caCopied ? 'bg-green-200' : ''}`} onClick={handleCopyCA} title="Copy CA">
             {caCopied ? <Check size={12} className="text-green-700"/> : <Copy size={12}/>} <span className="hidden sm:inline ml-1">CA</span>
          </Button>
          <div className="text-xs font-mono mx-1 text-blue-800 hidden md:block">{dexData.price !== "LOADING..." ? `$${dexData.price.replace('$','')}` : "..."}</div>
          <Button onClick={connect} disabled={connecting} className="text-xs px-2 py-0 h-6"><Wallet size={12} /><span className="hidden sm:inline">{wallet ? `${wallet.slice(0,4)}..` : "Connect"}</span></Button>
          <Volume2 size={14} className="hidden sm:block"/><span className="text-xs font-mono hidden sm:inline">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
      </div>
    </div>
  );
}


const DesktopIcon = ({ icon: Icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1 w-20 cursor-pointer p-1 border border-transparent hover:border-white/20 hover:bg-white/10 rounded active:opacity-70 group active:bg-white/20">
    <Icon size={32} className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" strokeWidth={1.5} />
    <span className="text-white text-xs text-center font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] bg-[#035a23] px-1 rounded">{label}</span>
  </div>
);

const DraggableWindow = ({ win, isActive, children, onFocus, onClose, onMaximize, onMinimize, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (clientX, clientY) => {
    if (win.isMaximized) return;
    onFocus();
    
    const element = document.getElementById(`win-${win.id}`);
    if(!element) return;
    const rect = element.getBoundingClientRect();
    setIsDragging(true); 
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.overflow-auto') || e.target.closest('button') || e.target.closest('input')) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.overflow-auto') || e.target.closest('button') || e.target.closest('input')) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => { 
      if (!isDragging || win.isMaximized) return; 
      onMove(win.id, e.clientX - offset.x, e.clientY - offset.y); 
    };
    const handleTouchMove = (e) => {
      if (!isDragging || win.isMaximized) return;
      if (e.cancelable) e.preventDefault(); 
      onMove(win.id, e.touches[0].clientX - offset.x, e.touches[0].clientY - offset.y);
    };

    const stopDrag = () => setIsDragging(false);
    
    if (isDragging) { 
      window.addEventListener('mousemove', handleMouseMove); 
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', stopDrag);
    }
    return () => { 
      window.removeEventListener('mousemove', handleMouseMove); 
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [isDragging, win.isMaximized, offset]);

  return (
    <div 
      id={`win-${win.id}`}
      onMouseDown={handleMouseDown} 
      onTouchStart={handleTouchStart}
      className="absolute flex flex-col" 
      style={{ 
        zIndex: win.z, 
        display: win.isMinimized ? 'none' : 'flex',
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 0 : win.y,
        width: win.isMaximized ? '100%' : win.w,
        height: win.isMaximized ? 'calc(100% - 40px)' : win.h
      }}
    >
      <WindowFrame 
        {...win} 
        isActive={isActive} 
        onClose={onClose} 
        onMaximize={onMaximize} 
        onMinimize={onMinimize} 
        onFocus={onFocus}
      >
        {children}
      </WindowFrame>
    </div>
  );
};