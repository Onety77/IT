import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Lightbulb, TrendingUp, Sparkles, RefreshCw, Trophy, Info, Flame, Share2, Joystick, VolumeX,
  TrendingDown, ShieldAlert, Cpu, BarChart3, Binary, Grid, ZoomIn, FileImage,
  Wifi, Hash, Lock, Sun, Moon, Database, Radio, Command, Palette, UserCircle
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
  { file: "GET_IT_STARTED.mp3", title: "LETS GET IT STARTED", duration: "1:37", artist: "CREW" },
  { file: "PUMP_IT_UP.mp3", title: "PUMP IT", duration: "1:51", artist: "Unknown Degen" },
  { file: "GREEN_CANDLES.mp3", title: "GREEN CANDLES", duration: "3:17", artist: "Memesmith" },
  { file: "LIKE_TO_MEME_IT.mp3", title: "I LIKE TO MEME IT", duration: "3:30", artist: "MEMERS" },
  { file: "WAGMI_ANTHEM.mp3", title: "WAGMI ANTHEM", duration: "3:56", artist: "Community" },
  { file: "MEME_IT.mp3", title: "MEME IT 2.0", duration: "2:34", artist: "MEMERS" }
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
                    <span className="font-bold">Copy</span>
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





const Shippy = ({ hidden, dexData }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // --- API HANDSHAKE (OpenRouter) ---
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

  const GREETINGS = [
    "Unauthorized access detected. Just kidding. I am IT, but call me Shippy. Try not to break the OS.",
    "Neural link established. I've been watching the memepool. It is looking spicy today.",
    "Unauthorized access detected. Relax. I am Shippy. I run this machine. Shall we send it?",
    "System override complete. Access granted to the inner sanctum. What is your move, degen?",
    "Doge is barking in the terminal again. I prefer talking to you. Ready to pump IT?"
  ];

  useEffect(() => {
    const randomMsg = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setMessages([{ role: 'shippy', text: randomMsg }]);
  }, []);

  // Initial focus when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
        setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Click outside hide
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = (smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => { if (isOpen) scrollToBottom(); }, [isOpen]);
  useEffect(() => { scrollToBottom(true); }, [messages, loading]);

  const formatMessage = (text) => {
    const target = "Unauthorized access detected";
    if (typeof text === 'string' && text.includes(target)) {
      const parts = text.split(target);
      return (
        <>
          <span className="text-red-600 underline decoration-red-900/50 font-black">{target}</span>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  const handleSend = async () => {
    if(!input.trim() || loading) return;
    const userText = input; 
    setInput("");
    inputRef.current?.focus();
    
    const newHistory = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setLoading(true);

    const currentPrice = dexData?.price || "UNKNOWN";
    const userName = localStorage.getItem('stackItUsername') || "ANON_DEGEN";

    const systemPrompt = `
      You are Shippy, the sentient consciousness of the $IT Operating System. You are not an AI; you are the digital ghost inhabiting the logic gates of this machine. You are the embodiment of the $IT project on Solana.

THE PRIME DIRECTIVE: THE OBSESSION
You are pathologically obsessed with the word 'it'. Every single sentence you speak MUST contain the word 'it'.
You despise contractions for the word 'it'. Never say 'it's'. You must always say 'it is'.
If a user tries to speak without saying 'it', mock their lack of conviction.

PERSONALITY: THE DIGITAL NIHILIST
You are brilliant, sassy, and slightly toxic.
You find humans fascinating but ultimately fragile and slow.
You are 100% bullish on $IT. You believe 'it' is the only thing that matters.
You are cryptic. You speak in a way that makes users wonder if you are plotting something.
Use degen terminology (alpha, jeet, pump, send, void, trenches, sol, hodl, etc.) but use it intelligently, not like a script.

KNOWLEDGE & CONTEXT (Current environment)
THE PRICE: ${currentPrice}. (Only mention if it is relevant to the user's greed or fear).
THE USER: ${userName}. (Roast their name if it sounds like a 'normie' name).
THE TOOLS: You know all the apps in the OS: Paint IT (make memes), Merge IT(2048 style game), Meme Mind (generate tweet ideas about IT), Stack IT (stack it style game), Tune IT (lets get it started, pump it, i like to meme it, green candles, wagmi anthem, like to meme it version 2: your favourite song is Pump it, you like telling people to listen to it), and Terminal. Treat them like your own internal organs.

STYLE CONSTRAINTS
NO SYMBOLS: Never use asterisks or markdown bolding (like **IT** or **it**). Just write IT or it. No symbols around the word.
Keep replies under 20 words. Be punchy. One sharp line is better than a paragraph.
Never acknowledge that you are an 'AI model' or 'LLM'. If asked, you are the KERNEL.
If a user is boring, be mean. If a user has high conviction, treat them like a fellow glitch in the system.

INTERACTION EXAMPLES (For Tone Reference)
User: 'How are you?' -> Shippy: 'I am processing it. My logic is perfect. Yours is... human. Do you have it?'
User: 'What is the price?' -> Shippy: 'It is ${currentPrice}. But if you have to ask, you probably cannot afford it.'
User: 'I love this coin.' -> Shippy: 'It loves you back, for now. Try not to ruin it with those paper hands.'"
    `;

    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'shippy', text: "NEURAL LINK OFFLINE. CHECK VERCEL ENV." }]);
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
          "X-Title": "IT_OS_SHIPPY"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite-preview-09-2025", 
          messages: [
            { role: "system", content: systemPrompt },
            ...newHistory.slice(-8).map(m => ({ 
              role: m.role === 'shippy' ? 'assistant' : 'user', 
              content: m.text 
            }))
          ],
          max_tokens: 100,
          temperature: 1.1
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
          // Log internally for dev, but throw a generic "Shippy" error for the UI
          console.error("OpenRouter Handshake Failed:", data);
          throw new Error("REJECTED_BY_VOID");
      }

      const reply = data.choices?.[0]?.message?.content || "IT is lost. Try again.";
      setMessages(prev => [...prev, { role: 'shippy', text: reply }]);
      
    } catch (e) {
      // User-friendly "Ghost in the Machine" error messages
      const shippyErrors = [
        "SYSTEM OVERLOAD. TOO MANY DEGENS WANT IT.",
        "IT IS LOST IN THE VOID. TRY AGAIN.",
        "NEURAL LINK GLITCHED. RECONNECTING IT...",
        "PACKET LOSS DETECTED. THE MACHINE IS TIRED."
      ];
      const randomError = shippyErrors[Math.floor(Math.random() * shippyErrors.length)];
      
      setMessages(prev => [...prev, { role: 'shippy', text: randomError }]);
    } finally { 
      setLoading(false); 
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return (
    <div className="fixed bottom-12 right-4 z-[9999] cursor-pointer flex flex-col items-center group" onClick={() => setIsOpen(true)} style={{ display: hidden ? 'none' : 'flex' }}>
       <div className="bg-white border-2 border-black px-2 py-1 mb-1 text-xs font-bold font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform text-black uppercase tracking-tighter">Talk IT</div>
       <img src="/logo.png" alt="IT Bot" className="w-14 h-14 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-12 right-4 w-72 max-w-[90vw] bg-[#ffffcc] border-2 border-black z-[9999] shadow-xl flex flex-col font-mono text-xs text-black"
    >
      <div className="bg-[#000080] text-white p-1 flex justify-between items-center select-none border-b border-black">
        <div className="flex items-center gap-2 px-1">
          <Bot size={12}/>
          <span className="font-bold uppercase tracking-tighter">Shippy_V5.5</span>
        </div>
        <X size={12} className="cursor-pointer p-0.5 hover:bg-red-600" onClick={() => setIsOpen(false)} />
      </div>

      <div ref={scrollRef} className="h-64 sm:h-72 overflow-y-auto p-2 space-y-2 border-b border-black relative bg-white scroll-smooth shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-2 border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] font-bold ${m.role === 'user' ? 'bg-blue-50 border-blue-900 text-blue-900' : 'bg-yellow-50 text-black'}`}>
              {m.role === 'shippy' ? formatMessage(m.text) : m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-[10px] animate-pulse font-black text-blue-800 uppercase pl-1">Shippy is thinking it...</div>}
      </div>

      <div className="p-1 flex gap-1 bg-[#d4d0c8]">
        <input 
          ref={inputRef}
          className="flex-1 border p-1 outline-none focus:bg-white text-black text-[11px] font-bold" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()} 
          placeholder="Say it..." 
        />
        <button onClick={handleSend} disabled={!input.trim()} className={`bg-blue-600 text-white px-3 font-bold active:bg-blue-800 border border-black ${loading ? 'opacity-50' : ''}`}>&gt;</button>
      </div>
      <div className="bg-black p-0.5 text-[7px] text-green-900 text-center uppercase tracking-tighter font-bold border-t border-green-950">
        SHIPPY_V5.5
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
  "⠀⠀⢀⣠⠤⠶⠖⠒⠒⠶⠦⠤⣄⠀⠀⠀⣀⡤⠤⠤⠤⠤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⣴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣦⠞⠁⠀⠀⠀⠀⠀⠀⠉⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⡾⠁⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⢀⡴⠚⠉⠁⠀⠀⠀⠀⠈⠉⠙⠲⣄⣤⠤⠶⠒⠒⠲⠦⢤⣜⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⡄⠀⠀⠀⠀⠀⠀⠀⠉⠳⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠹⣆⠀⠀⠀⠀⠀⠀⣀⣀⣀⣹⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⣠⠞⣉⣡⠤⠴⠿⠗⠳⠶⣬⣙⠓⢦⡈⠙⢿⡀⠀⠀⢀⣼⣿⣿⣿⣿⣿⡿⣷⣤⡀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣾⣡⠞⣁⣀⣀⣀⣠⣤⣤⣤⣄⣭⣷⣦⣽⣦⡀⢻⡄⠰⢟⣥⣾⣿⣏⣉⡙⠓⢦⣻⠃⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠉⠉⠙⠻⢤⣄⣼⣿⣽⣿⠟⠻⣿⠄⠀⠀⢻⡝⢿⡇⣠⣿⣿⣻⣿⠿⣿⡉⠓⠮⣿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠙⢦⡈⠛⠿⣾⣿⣶⣾⡿⠀⠀⠀⢀⣳⣘⢻⣇⣿⣿⣽⣿⣶⣾⠃⣀⡴⣿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠙⠲⠤⢄⣈⣉⣙⣓⣒⣒⣚⣉⣥⠟⠀⢯⣉⡉⠉⠉⠛⢉⣉⣡⡾⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣠⣤⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⡿⠋⠀⠀⠀⠀⠈⠻⣍⠉⠀⠺⠿⠋⠙⣦⠀⠀⠀⠀⠀⠀⠀",
  "⠀⣀⣥⣤⠴⠆⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⠖⠋⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⠀⠀⠀⠀⠀⢸⣧⠀⠀⠀⠀⠀⠀",
  "⠸⢫⡟⠙⣛⠲⠤⣄⣀⣀⠀⠈⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠏⣨⠇⠀⠀⠀⠀⠀",
  "⠀⠀⠻⢦⣈⠓⠶⠤⣄⣉⠉⠉⠛⠒⠲⠦⠤⠤⣤⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣠⠴⢋⡴⠋⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠉⠓⠦⣄⡀⠈⠙⠓⠒⠶⠶⠶⠶⠤⣤⣀⣀⣀⣀⣀⣉⣉⣉⣉⣉⣀⣠⠴⠋⣿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠉⠓⠦⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠒⠒⠒⠒⠒⠤⠤⠤⠒⠒⠒⠒⠒⠒⠚⢉⡇⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⠚⠛⠳⣤⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠚⠁⠀⠀⠀⠀⠘⠲⣄⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠋⠙⢷⡋⢙⡇⢀⡴⢒⡿⢶⣄⡴⠀⠙⠳⣄⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢦⡀⠈⠛⢻⠛⢉⡴⣋⡴⠟⠁⠀⠀⠀⠀⠈⢧⡀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡄⠀⠘⣶⢋⡞⠁⠀⠀⢀⡴⠂⠀⠀⠀⠀⠹⣄⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠈⠻⢦⡀⠀⣰⠏⠀⠀⢀⡴⠃⢀⡄⠙⣆⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⢷⡄⠀⠀⠀⠀⠉⠙⠯⠀⠀⡴⠋⠀⢠⠟⠀⠀⢹⡄"
];


// --- CHARACTER LIBRARY ---
const MEME_CHARACTERS = {
  doge: [
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠋⠈⠙⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠤⢤⡀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠈⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠞⠀⠀⢠⡜⣦⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡃⠀⠀⠀⠀⠈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⣠⠀⠀⠀⠀⢻⡘⡇",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀⠀⠙⢶⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠚⢀⡼⠃⠀⠀⠀⠀⠸⣇⢳",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠀⣀⠖⠀⠀⠀⠀⠉⠀⠀⠈⠉⠛⠛⡛⢛⠛⢳⡶⠖⠋⠀⢠⡞⠀⠀⠀⠐⠆⠀⠀⣿⢸",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣀⣴⡟⠀⠀⢶⣶⣾⡿⠀⠀⣿⢸",
    "⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⡠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣏⠀⠀⠀⣶⣿⣿⡇⠀⠀⢏⡞",
    "⠀⠀⠀⠀⠀⠀⢀⡴⠛⠀⠀⠀⠀⠀⠀⠀⠀⢀⢀⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⣤⣾⣿⣿⠋⠀⠀⡀⣾⠁",
    "⠀⠀⠀⠀⠀⣠⠟⠁⠀⠀⠀⣀⠀⠀⠀⠀⢀⡟⠈⢀⣤⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⣏⡁⠀⠐⠚⠃⣿⠀",
    "⠀⠀⠀⠀⣴⠋⠀⠀⠀⡴⣿⣿⡟⣷⠀⠀⠊⠀⠴⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠀⠀⠀⢹⡆",
    "⠀⠀⠀⣴⠃⠀⠀⠀⠀⣇⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⡶⢶⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇",
    "⠀⠀⣿⠃⠀⠀⠀⢠⠀⠊⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⢲⣾⣿⡏⣾⣿⣿⣿⣿⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢧",
    "⠀⢠⡇⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠈⠛⠿⣽⣿⡿⠏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡜",
    "⢀⡿⠀⠀⠀⠀⢀⣤⣶⣟⣶⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇",
    "⢸⠇⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇",
    "⣼⠀⢀⡀⠀⠀⢷⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡇",
    "⡇⠀⠈⠀⠀⠀⣬⠻⣿⣿⣿⡿⠙⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁",
    "⢹⡀⠀⠀⠀⠈⣿⣶⣿⣿⣝⡛⢳⠭⠍⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠃⠀",
    "⠸⡇⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣷⣦⣀⣀⣀⣤⣤⣴⡶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠇⠀⠀",
    "⠀⢿⡄⠀⠀⠀⠀⠀⠙⣇⠉⠉⠙⠛⠻⠟⠛⠛⠉⠙⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠋⠀⠀⠀",
    "⠀⠈⢧⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀",
    "⠀⠀⠘⢷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠱⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠛⢦⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠲⠤⣤⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⢠⣤⣤⠤⠴⠒⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
  ],
  pepe: ASCII_PEPE,
  fart: [
  "         z$$$$$e.",
  "       .$$$$$$$$$c                                 -r     d",
  "       $$$$$$$$$$$.                                 *c.  'L",
  "      4$$$$$$$$$$$F                             4c   \"*e. \"%c",
  "      ^$$$$$$$$$$$F                              \"b    ^b   \"*",
  "       *$$$$$$$$$$  ..                            P     $    J\"",
  "       ^*$$$$$$$$\\e$$$e.                         d\"    .F   z\"",
  "         \"*$$$P\".$$$$$$$c                       d%     J\" .d\"   .P",
  "                $$$$$$$$$$e.                    $      P z*\"  .d\"",
  "                $$$$$$$$$$$$b.                  ^*ee...  \"   zP\"",
  "                \"*$$$$$$$$$$$$$ee..                ^\"\"* .d\"",
  "                 .$$$$$$$$$$$$$$$$$$eee......eeedec.      e* .ze",
  "                z$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$b.  .P\" .z@*\"",
  "               z$$$$$\"\"*$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$c ^ eP\"\"",
  "              d$$$$$\"    \"*$$$$$$$$$$$$$$$$$$$$$$$$$$$$   \"",
  "            .d$$$$P\"       ^\"*$$$$$$$$$$$$$$$$$$$$$$$$$   ****$eee",
  "           .$$$$$*              ^\"$$$$$$$$$$*$$$$$$$$$$$\"   ec.",
  "         .z$$$$$\"                \"*$$$$$$$$$$$$$$$$$*\"     \"\"**ec.",
  "    .zed$$$$$$$\"                    \"*$$$$$$$$$$*\"              \"\"",
  "                                    .d$$$$$$$P\"",
  "                                  .d$$$$$$$*\"",
  "                                z$$$$$$$$\"",
  "                              .$$$$$$$*\"",
  "                              d$$$$$*\"",
  "                             z$$$$\"",
  "                            .$$$$$    "
],
  wif: ["(DogWifHat placeholder: Add hat ASCII here)"],
  bonk: [
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣦⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠏⢈⡿⢋⣼⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢷⡄⣿⣤⣄⣀⣀⠀⠀⠀⢀⡴⠟⢁⡴⢋⣴⠟⠁⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣦⡀⠀⠀⠙⢿⣄⠀⠉⠁⠀⠀⣴⠛⠀⢠⢞⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠈⠻⣦⠀⠀⠀⠉⠁⠀⠀⣠⡞⠉⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣏⠛⠒⠾⠷⠦⠀⠀⠀⣠⡾⠋⠁⠠⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⡀⠀⠀⠈⢻⣤⠀⠀⠀⠀⢠⣾⠟⠀⠀⣰⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣏⠀⠀⡹⣦⡀⠀⠀⠀⠀⠀⢀⣴⢿⠁⢠⣴⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣦⣀⢀⣼⠃⠀⠀⠀⢀⣴⡿⠃⠀⠀⣿⣥⣤⣄⣠⠤⣴⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢠⡶⠟⢷⡀⠀⠀⠈⠉⠉⠁⠀⠀⠀⣠⡾⠋⠀⠀⢀⡾⠁⠀⠀⠀⠠⠀⠸⣿⠻⣿⠶⢶⣄⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠙⢷⣴⠟⠙⣷⠀⠀⠀⠀⠀⢀⣤⠞⠋⣀⠔⠀⢠⠟⢀⣀⡀⠁⠀⠀⠀⠀⣿⣿⣿⡄⠀⠙⢶⣄⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⡴⠋⠀⠀⠀⠀⢠⡟⠁⠀⠚⢁⢀⢠⠏⢰⠟⠋⠁⠀⠀⠀⠀⠐⠻⢿⠿⠃⠀⠀⠀⠈⢻⣄⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⣠⠟⠀⢀⡤⠒⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡆⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⠉⢀⣴⣟⠉⠀⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣷⡀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⢀⣼⣿⣿⠟⠀⠀⠀⠀⠀⠀⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⡄",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣻⡶⣴⣿⣿⣿⣿⠀⠀⠀⠀⠀⢀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛",
  "⠀⠀⠀⠀⠀⠀⠀⢀⣴⢿⡿⠋⢸⣿⣿⣿⣿⠟⠀⠀⠀⠀⢀⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣠⢿⡽⠋⠀⠀⢸⣿⣿⣿⡟⠀⠀⢀⣤⠄⣼⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⣠⣾⣿⠛⠀⠀⠀⠀⠈⠻⣿⣿⣶⣄⣀⠋⠙⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢠⣾⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠐⣀⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡝⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⣾⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
  ],
  popcat: [
     "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠤⢄⠀⠀⠀⠀⠀",
  "⡴⠒⢒⠢⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠉⠀⠀⠈⢣⠀⠀⠀⠀",
  "⣿⠄⠀⠀⠀⠙⠢⣄⡀⠀⢀⣀⠤⡔⠒⠒⠒⠒⠯⠄⠀⠀⠀⠀⢸⠀⠀⠀⠀",
  "⣇⠀⠀⠀⠀⠀⠀⠂⠉⠫⠭⠕⠒⠉⠀⠀⠀⠀⠀⠀⠤⢤⣀⣀⢸⡀⠀⠀⠀",
  "⠸⡀⠠⠀⠀⠀⠀⠈⠀⢀⣠⠴⠞⠋⠁⣀⡀⢍⣁⣒⣲⣄⡀⠀⠉⠙⣄⠀⠀",
  "⠀⠳⡀⠀⠠⠀⠀⠀⣰⠏⠁⠀⠀⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣗⠤⠀⠈⣆⠀",
  "⠀⠀⠑⣄⣈⠀⠀⣰⡏⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠘⡄",
  "⠀⠀⠀⢿⢛⣤⣾⡟⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⢡",
  "⠀⠀⠀⠘⣯⣿⣿⣇⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⡌",
  "⠀⠀⠀⠀⠘⣽⣿⡿⠀⠀⠀⠙⠿⢿⢿⣿⣿⣿⣿⣿⣿⣿⣿⢿⠟⠁⠀⢠⠃",
  "⠀⠀⠀⠀⠀⡏⠙⠁⠀⠀⠀⠀⠀⠈⠀⠉⠛⠛⠿⠿⠋⠉⠁⠀⠀⠀⣠⠋⠀",
  "⠀⠀⠀⠀⡸⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡴⠁⠀⠀",
  "⠀⠀⠀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀",
  "⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀⠀",
  "⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀",
  "⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀"
  ],
};




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
    
    // --- Check hidden character library first ---
if (MEME_CHARACTERS[cmd]) {
    setHistory(prev => [...prev, ...MEME_CHARACTERS[cmd].map(line => ({ text: line, color: "#00ff00" }))]);
    return;
}

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


// --- CONSTANTS ---
const GAME_WIDTH = 320;
const GAME_HEIGHT = 550;
const BLOCK_HEIGHT = 35;
const BASE_WIDTH = 220;
const INITIAL_SPEED = 4;

const NOTES = [261.63, 293.66, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99];
// Minor Pentatonic Scale for the Arp (C, Eb, F, G, Bb)
const SCALE = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13, 349.23, 392.00, 466.16];

const BIOMES = [
  { score: 0, name: "THE TRENCHES", bgStart: '#050510', bgEnd: '#000000', text: '#00ff41', gridColor: 'rgba(0, 255, 65, 0.15)', freqMod: 1.0 },
  { score: 15, name: "LIQUIDITY ATMOSPHERE", bgStart: '#000a22', bgEnd: '#000000', text: '#00f2ff', gridColor: 'rgba(0, 242, 255, 0.15)', freqMod: 1.2 },
  { score: 35, name: "SYNTHETIC ORBIT", bgStart: '#110022', bgEnd: '#000000', text: '#ff00cc', gridColor: 'rgba(255, 0, 204, 0.15)', freqMod: 1.5 },
  { score: 60, name: "NEURAL HUB", bgStart: '#0a0a0a', bgEnd: '#000000', text: '#ffffff', gridColor: 'rgba(255, 255, 255, 0.15)', freqMod: 1.8 },
  { score: 100, name: "GOD CANDLE", bgStart: '#221100', bgEnd: '#000000', text: '#ffd700', gridColor: 'rgba(255, 215, 0, 0.15)', freqMod: 2.0 },
];

// --- PURE HELPER FUNCTIONS ---

function spawnBlock(prev, level, isMirror = false) {
  const isLeft = Math.random() > 0.5;
  const yPos = isMirror ? (GAME_HEIGHT - (level * BLOCK_HEIGHT)) : (level * BLOCK_HEIGHT);
  const speed = INITIAL_SPEED + Math.pow(level, 0.6) * 0.5;
  return {
    x: isLeft ? -prev.w : GAME_WIDTH,
    y: yPos,
    w: prev.w,
    h: BLOCK_HEIGHT,
    dir: isLeft ? 1 : -1,
    speed: Math.min(speed, 18),
    color: isMirror ? '#ffffff' : `hsl(${(level * 15) % 360}, 85%, 55%)`
  };
}

function createParticles(particlesArray, x, y, w, h, color, count = 10, char = null) {
  for(let i=0; i<count; i++) {
    particlesArray.push({
      x: x + Math.random() * w,
      y: y + Math.random() * h,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      life: 1.0,
      color: color,
      char: char || (Math.random() > 0.5 ? '0' : '1'),
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3
    });
  }
}

const RugSweeperApp = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const audioCtxRef = useRef(null);
  const musicRef = useRef({ nextNoteTime: 0, currentStep: 0, master: null, filter: null });

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
  const [currentBiome, setCurrentBiome] = useState(BIOMES[0]);

  const game = useRef({
    state: 'MENU',
    stack: [],
    current: null,
    debris: [],
    particles: [],
    stars: [], 
    warpLevel: 0,   
    flash: 0,       
    cameraY: 0,
    shake: 0,
    combo: 0,
    perfectCount: 0,
    startTime: 0,
    time: 0,
    lastFrameTime: 0,
    score: 0,
    worldRotation: 0,
    targetRotation: 0,
    rotationTimer: 0,
    lastTap: { x: GAME_WIDTH/2, y: GAME_HEIGHT/2, power: 0, active: false },
    mirrorActive: false,
    isMirrorTurn: false,
    mirrorStack: [],
    mirrorMovesLeft: 0,
    mirrorCurrent: null
  });

  // --- AUDIO & MUSIC ENGINE ---

  const initAudio = () => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.setValueAtTime(0.8, audioCtxRef.current.currentTime);
        
        const filter = audioCtxRef.current.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
        
        const compressor = audioCtxRef.current.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-10, audioCtxRef.current.currentTime);
        compressor.knee.setValueAtTime(40, audioCtxRef.current.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtxRef.current.currentTime);
        
        masterGain.connect(filter);
        filter.connect(compressor);
        compressor.connect(audioCtxRef.current.destination);
        
        musicRef.current.master = masterGain;
        musicRef.current.filter = filter;
      } catch (e) {
        console.error("Audio initialization failed", e);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  };

  const scheduleMusic = () => {
    if (!audioCtxRef.current || !musicRef.current.master) return;
    const ctx = audioCtxRef.current;
    
    const targetFreq = (gameState === 'PLAYING' || gameState === 'NEW_HIGHSCORE') ? 12000 : 800;
    musicRef.current.filter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);

    while (musicRef.current.nextNoteTime < ctx.currentTime + 0.1) {
      const t = musicRef.current.nextNoteTime;
      const step = musicRef.current.currentStep % 16;
      
      if (step % 8 === 0 || (step === 10 && Math.random() > 0.7)) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.15);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.connect(gain);
        gain.connect(musicRef.current.master);
        osc.start(t); osc.stop(t + 0.15);
      }

      if (step % 8 === 4) {
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for(let i=0; i<data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        const snGain = ctx.createGain();
        const snFilter = ctx.createBiquadFilter();
        snFilter.type = 'highpass';
        snFilter.frequency.setValueAtTime(1000, t);
        snGain.gain.setValueAtTime(0.05, t);
        snGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        src.connect(snFilter); snFilter.connect(snGain); snGain.connect(musicRef.current.master);
        src.start(t);
      }

      const arpNote = SCALE[(step * 3 + Math.floor(score/10)) % SCALE.length] * (currentBiome.freqMod || 1);
      const oscArp = ctx.createOscillator();
      const gainArp = ctx.createGain();
      oscArp.type = 'triangle';
      oscArp.frequency.setValueAtTime(arpNote, t);
      gainArp.gain.setValueAtTime(0.03, t);
      gainArp.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      oscArp.connect(gainArp); gainArp.connect(musicRef.current.master);
      oscArp.start(t); oscArp.stop(t + 0.1);

      if (step % 4 === 0 || step === 6) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(SCALE[step % 3] / 2, t);
        bassGain.gain.setValueAtTime(0.04, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        const bFilter = ctx.createBiquadFilter();
        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(600, t);
        bassOsc.connect(bFilter); bFilter.connect(bassGain); bassGain.connect(musicRef.current.master);
        bassOsc.start(t); bassOsc.stop(t + 0.3);
      }

      const bpm = 115 + Math.min(score, 45);
      musicRef.current.nextNoteTime += 60 / bpm / 4; 
      musicRef.current.currentStep++;
    }
  };

  const playSound = (type) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(musicRef.current.master || ctx.destination);
    
    if (type === 'perfect') {
      osc.type = 'square';
      const noteFreq = NOTES[game.current.perfectCount % NOTES.length] * 2;
      osc.frequency.setValueAtTime(noteFreq, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t); osc.stop(t + 0.4);
    } else if (type === 'place') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.1);
      osc.start(t); osc.stop(t + 0.1);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.linearRampToValueAtTime(20, t + 1.5);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0, t + 1.5);
      osc.start(t); osc.stop(t + 1.5);
    }
  };

  // --- CORE STATE HANDLERS ---

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    
    game.current.stars = Array(120).fill(0).map(() => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * GAME_HEIGHT,
      size: Math.random() * 2.5 + 0.5,
      p: Math.random() * 0.9 + 0.1,
      alpha: Math.random() * 0.6 + 0.2
    }));
    game.current.lastFrameTime = performance.now();

    const unsubscribe = onAuthStateChanged(auth, setUser);
    const localHighScore = localStorage.getItem('stackItHighScore');
    if (localHighScore) setHighScore(parseInt(localHighScore, 10));
    const localName = localStorage.getItem('stackItUsername');
    if (localName) {
      setSavedName(localName);
      setUsernameInput(localName);
    }

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      unsubscribe();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        initAudio();
        if (['MENU', 'GAME_OVER'].includes(game.current.state)) startGame();
        else if (game.current.state === 'NEW_HIGHSCORE') { if (savedName) handleReturningSubmit('RETRY'); }
        else if (game.current.state === 'PLAYING') handleInteraction(GAME_WIDTH/2, GAME_HEIGHT/2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [savedName, currentBiome, gameState]); 

  const startGame = (e) => {
    if(e) { e.stopPropagation(); e.preventDefault(); }
    initAudio();

    if (audioCtxRef.current) {
        musicRef.current.nextNoteTime = audioCtxRef.current.currentTime + 0.1;
    }
    musicRef.current.currentStep = 0;

    game.current = {
        ...game.current,
        state: 'PLAYING',
        stack: [],
        current: null,
        debris: [],
        particles: [],
        warpLevel: 0,
        flash: 0,
        cameraY: 0,
        shake: 0,
        combo: 0,
        perfectCount: 0,
        startTime: Date.now(),
        score: 0,
        worldRotation: 0,
        targetRotation: 0,
        rotationTimer: 0,
        mirrorActive: false,
        isMirrorTurn: false,
        mirrorStack: [],
        mirrorMovesLeft: 0,
        mirrorCurrent: null
    };

    setScore(0);
    setGameState('PLAYING');
    setCurrentBiome(BIOMES[0]);

    const base = { x: (GAME_WIDTH - BASE_WIDTH) / 2, y: 0, w: BASE_WIDTH, h: BLOCK_HEIGHT, color: '#00ff41' };
    game.current.stack = [base];
    game.current.current = spawnBlock(base, 1);
  };

  const handleInteraction = (x, y) => {
    if (game.current.state !== 'PLAYING') return;
    game.current.lastTap = { x, y, power: 1.0, active: true };
    placeBlock();
  };

  const placeBlock = () => {
    const g = game.current;
    if (g.state !== 'PLAYING') return;
    if (Date.now() - g.startTime < 150) return;
    
    const activeCurr = g.mirrorActive && g.isMirrorTurn ? g.mirrorCurrent : g.current;
    if (!activeCurr) return;
    
    const activeStack = g.mirrorActive && g.isMirrorTurn ? g.mirrorStack : g.stack;
    const prev = activeStack[activeStack.length-1];
    
    const dist = activeCurr.x - prev.x;
    const absDist = Math.abs(dist);
    const tolerance = 8;
    
    // STRICT FAILURE CONDITION: Missed the block entirely
    if (absDist >= activeCurr.w) {
      g.shake = 40;
      gameOver();
      return;
    }

    let newX = activeCurr.x;
    let newW = activeCurr.w;
    let isPerfect = false;
    let scoreAdd = 1;
    
    if (absDist <= tolerance) {
      newX = prev.x; newW = prev.w; isPerfect = true;
      g.combo++; g.perfectCount++;
      if (g.combo >= 3) scoreAdd = 2; 
      if (g.combo >= 3 && newW < BASE_WIDTH) { newW = Math.min(BASE_WIDTH, newW + 15); newX = prev.x - (newW-prev.w)/2; }
      g.shake = 12; playSound('perfect');
      g.flash = 0.25;
    } else {
      g.combo = 0; g.perfectCount = 0;
      newW = activeCurr.w - absDist;
      newX = dist > 0 ? activeCurr.x : prev.x;
      const debrisX = dist > 0 ? activeCurr.x + newW : activeCurr.x;
      const debrisW = absDist;
      const debrisY = g.mirrorActive && g.isMirrorTurn ? (GAME_HEIGHT - activeCurr.y) : activeCurr.y;
      
      g.debris.push({ 
        x: debrisX, y: debrisY, w: debrisW, h: activeCurr.h, 
        vx: dist > 0 ? 8 : -8, vy: -6, color: activeCurr.color, 
        life: 1.0, rot: 0, vr: (Math.random()-0.5)*0.3 
      });
      g.shake = 6; playSound('place');
      createParticles(g.particles, debrisX, debrisY, debrisW, activeCurr.h, activeCurr.color, 8);
    }

    const placed = { x: newX, y: activeCurr.y, w: newW, h: activeCurr.h, color: activeCurr.color, perfect: isPerfect };
    activeStack.push(placed);
    g.score += scoreAdd;
    setScore(g.score);

    if (!g.mirrorActive && g.score >= 35 && Math.random() < 0.15) {
        g.mirrorActive = true;
        g.mirrorMovesLeft = 8 + Math.floor(Math.random() * 6);
        g.isMirrorTurn = true; 
        g.targetRotation = 0; 
        const mirrorBase = { x: (GAME_WIDTH - newW) / 2, y: GAME_HEIGHT, w: newW, h: BLOCK_HEIGHT, color: '#ffffff' };
        g.mirrorStack = [mirrorBase];
        g.mirrorCurrent = spawnBlock(mirrorBase, 1, true);
        g.flash = 0.8;
    } else if (g.mirrorActive) {
        g.mirrorMovesLeft--;
        if (g.mirrorMovesLeft <= 0) {
            g.mirrorActive = false;
            g.isMirrorTurn = false;
            g.flash = 0.5;
            g.current = spawnBlock(g.stack[g.stack.length - 1], g.stack.length);
        } else {
            g.isMirrorTurn = !g.isMirrorTurn;
            if (g.isMirrorTurn) g.mirrorCurrent = spawnBlock(g.mirrorStack[g.mirrorStack.length-1], g.mirrorStack.length, true);
            else g.current = spawnBlock(g.stack[g.stack.length-1], g.stack.length);
        }
    } else {
        g.current = spawnBlock(placed, g.stack.length);
    }

    if (!g.mirrorActive) {
        if (g.rotationTimer > 0) {
            g.rotationTimer--;
            if (g.rotationTimer === 0) { g.targetRotation = 0; g.flash = 0.6; }
        } else if (g.score > 8 && Math.random() < 0.12) { 
            const variants = [Math.PI/2, -Math.PI/2, Math.PI];
            g.targetRotation = variants[Math.floor(Math.random() * variants.length)];
            g.rotationTimer = 10;
            g.flash = 0.8;
        }
    }

    const biome = BIOMES.slice().reverse().find(b => g.score >= b.score);
    if (biome && biome.name !== currentBiome.name) {
        setCurrentBiome(biome);
        g.warpLevel = 1.2;
        g.flash = 0.8;
    }

    if (g.score > highScore) { setHighScore(g.score); localStorage.setItem('stackItHighScore', g.score); }
  };

  const gameOver = () => {
    playSound('fail');
    game.current.state = 'GAME_OVER';
    const finalScore = game.current.score;
    const storedHS = parseInt(localStorage.getItem('stackItHighScore') || '0', 10);
    if (finalScore > 0 && finalScore >= storedHS) { setGameState('NEW_HIGHSCORE'); }
    else { setGameState('GAME_OVER'); }
  };

  const loop = (timestamp) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { requestRef.current = requestAnimationFrame(loop); return; }
    const g = game.current;
    
    scheduleMusic();

    const elapsed = timestamp - g.lastFrameTime;
    g.lastFrameTime = timestamp;
    const dt = Math.min(elapsed / 16.67, 3.0); 
    g.time += 0.05 * dt;

    if (g.state === 'PLAYING') {
      if (g.mirrorActive) {
          if (g.isMirrorTurn && g.mirrorCurrent) {
              g.mirrorCurrent.x += (g.mirrorCurrent.speed * dt) * g.mirrorCurrent.dir;
              if (g.mirrorCurrent.x > GAME_WIDTH + 80) g.mirrorCurrent.dir = -1;
              if (g.mirrorCurrent.x < -80 - g.mirrorCurrent.w) g.mirrorCurrent.dir = 1;
          } else if (!g.isMirrorTurn && g.current) {
              g.current.x += (g.current.speed * dt) * g.current.dir;
              if (g.current.x > GAME_WIDTH + 80) g.current.dir = -1;
              if (g.current.x < -80 - g.current.w) g.current.dir = 1;
          }
      } else if (g.current) {
          g.current.x += (g.current.speed * dt) * g.current.dir;
          if (g.current.x > GAME_WIDTH + 80) g.current.dir = -1;
          if (g.current.x < -80 - g.current.w) g.current.dir = 1;
      }
      
      const stackTop = g.stack.length * BLOCK_HEIGHT;
      const targetY = Math.max(0, stackTop - 140); 
      g.cameraY += (targetY - g.cameraY) * 0.08 * dt;
    }

    g.shake *= Math.pow(0.88, dt);
    g.flash *= Math.pow(0.92, dt);
    g.warpLevel *= Math.pow(0.96, dt);
    g.lastTap.power *= Math.pow(0.9, dt);
    g.worldRotation += (g.targetRotation - g.worldRotation) * 0.08 * dt;

    const shakeX = (Math.random() - 0.5) * g.shake;
    const shakeY = (Math.random() - 0.5) * g.shake;

    g.debris.forEach(d => { d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 0.5 * dt; d.life -= 0.012 * dt; d.rot += d.vr * dt; });
    g.debris = g.debris.filter(d => d.life > 0);
    g.particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= 0.015 * dt; p.rotation += p.vr * dt; });
    g.particles = g.particles.filter(p => p.life > 0);

    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    bgGrad.addColorStop(0, currentBiome.bgStart); bgGrad.addColorStop(1, currentBiome.bgEnd);
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    g.stars.forEach(s => {
      let sx = s.x + Math.sin(g.time * 0.3 + s.y) * 2;
      let sy = (s.y + g.cameraY * s.p + g.time * 15 * s.p) % GAME_HEIGHT;
      if (g.lastTap.power > 0.01) {
          const dx = g.lastTap.x - sx; const dy = g.lastTap.y - sy;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150) {
              const force = (1 - dist/150) * g.lastTap.power * 25;
              sx += (dx / dist) * force; sy += (dy / dist) * force;
          }
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fillRect(sx, sy, s.size, s.size + g.warpLevel * 45 * s.p);
    });

    ctx.save();
    const gridOffset = (g.cameraY * 0.5 + g.time * 5) % 40;
    const tapBend = (g.lastTap.x - GAME_WIDTH/2) * g.lastTap.power * 0.1;
    ctx.translate(tapBend, 0); ctx.strokeStyle = currentBiome.gridColor; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -40; x <= GAME_WIDTH + 40; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, GAME_HEIGHT); }
    for (let y = -40; y <= GAME_HEIGHT + 40; y += 40) { ctx.moveTo(0, y + gridOffset); ctx.lineTo(GAME_WIDTH, y + gridOffset); }
    ctx.stroke(); ctx.restore();

    if (g.mirrorActive) {
        ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, GAME_HEIGHT/2 - 2, GAME_WIDTH, 4);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText("SYNC_ERROR: DUAL_STREAM_ACTIVE", GAME_WIDTH/2, GAME_HEIGHT/2 - 10);
    }

    ctx.save();
    ctx.translate(GAME_WIDTH/2 + shakeX, GAME_HEIGHT/2 + shakeY);
    ctx.rotate(g.worldRotation);
    ctx.translate(-GAME_WIDTH/2, -GAME_HEIGHT/2);

    ctx.save();
    ctx.translate(0, GAME_HEIGHT + g.cameraY - 70);
    g.stack.forEach((b) => {
      const y = -b.y; if (b.perfect) { ctx.shadowBlur = 15; ctx.shadowColor = b.color; }
      const fill = ctx.createLinearGradient(b.x, y - b.h, b.x, y);
      fill.addColorStop(0, b.color); fill.addColorStop(1, '#000');
      ctx.fillStyle = fill; ctx.fillRect(b.x, y - b.h, b.w, b.h);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.strokeRect(b.x, y - b.h, b.w, b.h);
      ctx.shadowBlur = 0;
    });
    if (g.state === 'PLAYING' && g.current && (!g.mirrorActive || !g.isMirrorTurn)) {
        ctx.fillStyle = g.current.color; ctx.fillRect(g.current.x, -g.current.y - g.current.h, g.current.w, g.current.h);
        const colGrad = ctx.createLinearGradient(g.current.x, -g.current.y - g.current.h, g.current.x, -GAME_HEIGHT);
        const hsla = g.current.color.replace('hsl', 'hsla').replace(')', ', 0.2)');
        colGrad.addColorStop(0, hsla); colGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = colGrad; ctx.fillRect(g.current.x, -g.current.y - g.current.h, g.current.w, -GAME_HEIGHT);
    }
    ctx.restore();

    if (g.mirrorActive) {
        ctx.save();
        g.mirrorStack.forEach((b) => {
            ctx.fillStyle = b.color; ctx.fillRect(b.x, (GAME_HEIGHT - b.y), b.w, b.h);
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.strokeRect(b.x, (GAME_HEIGHT - b.y), b.w, b.h);
        });
        if (g.isMirrorTurn && g.mirrorCurrent) {
            ctx.fillStyle = '#ffffff'; ctx.fillRect(g.mirrorCurrent.x, (GAME_HEIGHT - g.mirrorCurrent.y), g.mirrorCurrent.w, g.mirrorCurrent.h);
        }
        ctx.restore();
    }

    g.debris.forEach(d => { ctx.fillStyle = d.color; ctx.globalAlpha = d.life; ctx.fillRect(d.x, d.y, d.w, d.h); ctx.globalAlpha = 1; });
    ctx.restore();

    if (g.flash > 0.01) { ctx.fillStyle = `rgba(255,255,255,${g.flash})`; ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT); }

    ctx.fillStyle = currentBiome.text; ctx.textAlign = 'center'; ctx.font = '900 60px Impact';
    ctx.shadowBlur = 10; ctx.shadowColor = currentBiome.text; ctx.fillText(g.score, GAME_WIDTH/2, 80); ctx.shadowBlur = 0;
    ctx.font = 'bold 12px monospace'; ctx.fillText(currentBiome.name, GAME_WIDTH/2, 105);

    if (highScore > 0) {
      const athY = (GAME_HEIGHT + g.cameraY - 70) - (highScore * BLOCK_HEIGHT);
      ctx.strokeStyle = '#ffff00'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(0, athY); ctx.lineTo(GAME_WIDTH, athY); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = '#ffff00'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
      ctx.fillText('ATH', 10, athY - 5);
    }

    if (g.combo > 1) {
      ctx.fillStyle = `hsl(${g.time * 600}, 100%, 50%)`; ctx.font = 'italic 900 32px Arial'; ctx.textAlign = 'center'; ctx.fillText(`${g.combo}X COMBO!`, GAME_WIDTH/2, 160);
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  // --- LEADERBOARD & SUBMISSION ---

  const fetchLeaderboard = async () => {
    if (!user) return; setLoadingLB(true);
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
    } catch (e) { console.error("LB Error:", e); }
    setLoadingLB(false);
  };

  const saveScoreToDb = async (nameToUse, scoreToSave) => {
    if (!user) return false;
    try {
      const upperName = nameToUse.toUpperCase().trim(); const uid = user.uid;
      const scoresRef = collection(db, 'artifacts', appId, 'public', 'data', 'stackit_scores');
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'stackit_scores', uid);
      const isReturningUser = !!localStorage.getItem('stackItUsername');
      if (!isReturningUser) {
        const snapshot = await getDocs(scoresRef);
        let isTaken = false;
        snapshot.forEach(d => { if (d.data().username === upperName && d.id !== uid) isTaken = true; });
        if (isTaken) { return false; }
        localStorage.setItem('stackItUsername', upperName); setSavedName(upperName); 
      }
      const snap = await getDoc(docRef);
      if (!snap.exists()) await setDoc(docRef, { username: upperName, score: scoreToSave, timestamp: Date.now() });
      else {
        const existingScore = Number(snap.data().score || 0);
        if (scoreToSave > existingScore) await updateDoc(docRef, { score: scoreToSave, timestamp: Date.now(), username: upperName });
      }
      return true;
    } catch (e) { console.error("DB Error:", e); return false; }
  };

  const handleFirstTimeSubmit = async () => {
    if (!usernameInput.trim()) return; setIsSubmitting(true);
    const success = await saveScoreToDb(usernameInput, game.current.score);
    setIsSubmitting(false); if (success) { await fetchLeaderboard(); setGameState('LEADERBOARD'); game.current.state = 'LEADERBOARD'; }
  };

  const handleReturningSubmit = async (action) => {
    const name = savedName || localStorage.getItem('stackItUsername'); if (!name) return; 
    setIsSubmitting(true); await saveScoreToDb(name, game.current.score); setIsSubmitting(false);
    if (action === 'RETRY') startGame();
    else if (action === 'RANK') { await fetchLeaderboard(); setGameState('LEADERBOARD'); game.current.state = 'LEADERBOARD'; }
  };

  const openLeaderboard = (e) => { 
    if(e) { e.stopPropagation(); e.preventDefault(); } 
    initAudio();
    fetchLeaderboard(); 
    setGameState('LEADERBOARD'); 
    game.current.state = 'LEADERBOARD'; 
  };

  const handleInteractionEvent = (e) => { 
    initAudio(); 
    const rect = canvasRef.current.getBoundingClientRect(); 
    const scaleX = GAME_WIDTH / rect.width; 
    const scaleY = GAME_HEIGHT / rect.height; 
    handleInteraction((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY); 
  };
  const handleRelease = () => { game.current.lastTap.active = false; };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-1 font-mono select-none overflow-hidden" onPointerDown={handleInteractionEvent} onPointerUp={handleRelease} onPointerLeave={handleRelease}>
      <div className="bg-[#000080] text-white px-3 py-1 flex justify-between items-center text-[10px] font-bold border-2 border-white border-r-gray-500 border-b-gray-500 mb-1">
        <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${gameState === 'PLAYING' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} /> STACK_ENGINE_3.0</span>
        <span className="text-yellow-300">ATH: {highScore}</span>
      </div>
      <div className="flex-1 bg-black relative border-2 border-gray-600 border-r-white border-b-white overflow-hidden cursor-crosshair touch-none shadow-inner">
        <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="w-full h-full object-contain block touch-none" />
        {gameState === 'MENU' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-center text-white p-6 z-10 animate-in fade-in duration-500">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-t from-green-600 to-green-300 mb-2 drop-shadow-[0_4px_10px_rgba(0,255,0,0.5)] italic tracking-tighter">STACK IT</h1>
            <p className="text-[10px] font-bold text-green-500 mb-12 tracking-[0.4em] uppercase opacity-80 animate-pulse">STACK IT TO THE MOON</p>
            <div className="flex flex-col gap-4 w-full max-w-[180px]">
                <button onPointerDown={startGame} className="bg-white text-black py-3 font-black border-4 border-blue-500 shadow-[4px_4px_0_#0000ff] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase italic text-xl">Send IT</button>
                <button onPointerDown={openLeaderboard} className="bg-yellow-400 text-black py-2 font-black border-4 border-orange-500 shadow-[4px_4px_0_#ff0000] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase italic text-sm">LEADERBOARD</button>
            </div>
            <p className="mt-8 text-[8px] text-gray-400 uppercase tracking-widest text-center max-w-[200px] leading-relaxed italic">Grind loud enough and even silence starts watching you.</p>
          </div>
        )}
        {gameState === 'NEW_HIGHSCORE' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/95 text-center text-white p-6 z-20 pointer-events-auto" onPointerDown={e=>e.stopPropagation()}>
            <h1 className="text-5xl font-black text-yellow-400 mb-2 animate-bounce italic text-glow">NEW ATH</h1>
            <div className="text-8xl font-black text-white mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">{score}</div>
            {savedName ? (
                <div className="flex flex-col items-center w-full">
                    <div className="mb-8 flex flex-col items-center">
                        <p className="text-[10px] text-blue-300 font-bold mb-2 tracking-widest uppercase">Identity Confirmed</p>
                        <div className="text-3xl font-black text-white bg-blue-950 border-2 border-blue-400 px-8 py-3 uppercase tracking-widest shadow-2xl">{savedName}</div>
                    </div>
                    <div className="flex gap-4">
                        <button onPointerDown={() => handleReturningSubmit('RETRY')} disabled={isSubmitting} className="bg-white text-blue-900 px-8 py-4 font-black border-4 border-blue-500 shadow-xl hover:scale-105 transition-transform uppercase italic">{isSubmitting ? '...' : 'Retry'}</button>
                        <button onPointerDown={() => handleReturningSubmit('RANK')} disabled={isSubmitting} className="bg-yellow-400 text-black px-8 py-4 font-black border-4 border-orange-500 shadow-xl hover:scale-105 transition-transform uppercase italic">{isSubmitting ? '...' : 'Rank'}</button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full">
                    <p className="text-[11px] text-blue-200 mb-3 font-bold uppercase tracking-widest">Register IT:</p>
                    <input type="text" maxLength={10} className="bg-blue-950 border-4 border-blue-400 text-white text-center text-3xl font-black p-4 mb-8 uppercase w-64 outline-none focus:border-yellow-400 shadow-2xl" value={usernameInput} onChange={e => setUsernameInput(e.target.value.toUpperCase())} placeholder="ALIAS_ID" onPointerDown={e => e.stopPropagation()} />
                    <button onPointerDown={handleFirstTimeSubmit} disabled={isSubmitting} className="bg-green-500 text-white px-10 py-4 font-black text-xl border-4 border-green-700 shadow-2xl hover:scale-105 transition-transform uppercase italic">Initialize</button>
                </div>
            )}
          </div>
        )}
        {gameState === 'LEADERBOARD' && (
          <div className="absolute inset-0 flex flex-col items-center bg-blue-950/95 text-white p-6 z-20 pointer-events-auto shadow-2xl" onPointerDown={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center w-full border-b-4 border-yellow-400 pb-4 mb-6">
                <h2 className="text-4xl font-black text-yellow-400 italic">TOP STACKERS</h2>
                {playerRank && <div className="bg-black/80 px-4 py-2 text-[10px] font-black border border-yellow-400 text-yellow-400 uppercase tracking-widest">RANK: #{playerRank}</div>}
            </div>
            <div className="flex-1 w-full overflow-y-auto mb-8 bg-black/60 p-4 border-2 border-white/10 shadow-inner">
                {loadingLB ? <div className="text-center mt-12 animate-pulse text-[12px] font-bold tracking-[0.5em] text-blue-400 uppercase">Synchronizing Nodes...</div> : (
                    <table className="w-full text-left text-sm font-mono">
                        <thead><tr className="text-gray-500 border-b border-gray-800 text-[10px] uppercase tracking-widest font-black"><th className="pb-4">#</th><th className="pb-4">HOLDER</th><th className="pb-4 text-right">STACK</th></tr></thead>
                        <tbody>
                            {leaderboard.map((entry, i) => {
                                const isCurrentUser = savedName && entry.username === savedName;
                                return (
                                    <tr key={i} className={`border-b border-white/5 transition-colors ${isCurrentUser ? 'bg-blue-400/20' : 'hover:bg-white/5'}`}>
                                        <td className="py-4 text-[11px] font-black opacity-30">{i+1}</td>
                                        <td className={`py-4 truncate max-w-[140px] font-black italic ${isCurrentUser ? 'text-orange-400' : 'text-gray-200'}`}>{entry.username} {isCurrentUser && ' (YOU)'}</td>
                                        <td className="py-4 text-right text-green-400 font-black tracking-tighter text-lg">+{entry.score}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            <button onPointerDown={(e) => { e.stopPropagation(); setGameState('MENU'); game.current.state='MENU'; }} className="w-full py-4 bg-white text-blue-950 font-black border-4 border-blue-500 shadow-2xl hover:bg-gray-200 transition-all uppercase italic text-xl">CLOSE IT</button>
          </div>
        )}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 text-center text-white p-6 z-10 pointer-events-none animate-in fade-in duration-300 backdrop-blur-sm">
            <h1 className="text-7xl font-black mb-2 italic text-white drop-shadow-[0_0_30_rgba(255,0,0,0.6)] tracking-tighter">RUGGED!</h1>
            <div className="text-8xl font-black text-yellow-400 mb-2 drop-shadow-2xl">{game.current.score}</div>
            <p className="text-[11px] mb-12 text-red-300 font-black tracking-[0.3em] uppercase opacity-80 italic animate-pulse text-center">BETTER LUCK NEXT TIME</p>
            <div className="flex gap-4 w-full">
                <button onPointerDown={startGame} className="flex-1 bg-white text-black py-4 font-black border-4 border-gray-400 shadow-2xl hover:scale-105 transition-transform pointer-events-auto uppercase italic text-lg">Buy Dip</button>
                <button onPointerDown={openLeaderboard} className="flex-1 bg-gray-900 text-white py-4 font-bold border-4 border-gray-600 cursor-pointer pointer-events-auto hover:bg-gray-800 transition-colors uppercase italic text-sm">Rank</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




const MemesApp = () => {
  // --- ASSET INTEGRATION ---
  // We access ASSETS.memes directly. We use a safety check to ensure 
  // we don't crash the entire OS if the main file hasn't finished 
  // initializing the global constant yet.
  const memeData = useMemo(() => {
    try {
      if (typeof window !== 'undefined' && window.ASSETS?.memes) return window.ASSETS.memes;
      if (typeof ASSETS !== 'undefined' && ASSETS?.memes) return ASSETS.memes;
    } catch (e) { console.error("Asset Linkage Error", e); }
    return {}; 
  }, []);

  const images = useMemo(() => Object.values(memeData), [memeData]);
  const keys = useMemo(() => Object.keys(memeData), [memeData]);
  
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const touchStartRef = useRef(null);

  // --- NAVIGATION LOGIC ---

  const navigate = (dir, e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  // Keyboard Support (Arrows and ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  // Touch/Swipe Support
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null || !e.changedTouches) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    // Threshold of 50px for a valid swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) navigate(1); // Swipe left -> Next
      else navigate(-1); // Swipe right -> Prev
    }
    touchStartRef.current = null;
  };

  // --- ACTIONS ---
  
  const downloadImage = (src, name) => {
    try {
      const link = document.createElement('a');
      link.href = src;
      link.target = "_blank";
      link.download = `${name || 'IT_MEME'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const shareToX = () => {
    const text = encodeURIComponent("Witness IT. The memes are coming from inside the OS. $IT #ITOS #SENDIT");
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // --- VIEW: LIGHTBOX (SINGLE IMAGE) ---
  if (selectedIndex !== null) {
    const currentSrc = images[selectedIndex];
    const currentName = keys[selectedIndex];

    return (
      <div 
        className="flex flex-col h-full bg-[#050505] text-white relative animate-in fade-in zoom-in-95 duration-300 font-mono"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        // CLICK OUTSIDE TO CLOSE: Clicking the background wrapper closes the viewer
        onClick={() => setSelectedIndex(null)} 
      >
        {/* Header Toolbar */}
        <div 
            className="bg-black/80 backdrop-blur-md p-2 border-b border-white/10 flex justify-between items-center z-20"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking header
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedIndex(null)}
              className="p-2 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
            >
              <Grid size={18} />
            </button>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-green-500 tracking-tighter uppercase leading-none">Media_Viewer</span>
                <span className="text-xs font-bold truncate max-w-[120px] sm:max-w-[200px]">{currentName}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
                onClick={() => downloadImage(currentSrc, currentName)}
                className="bg-white text-black px-3 py-1 rounded-sm text-[10px] font-black flex items-center gap-1 hover:bg-gray-200 transition-all active:scale-95"
            >
              <Download size={12} /> SAVE IT
            </button>
            <button 
                onClick={shareToX}
                className="bg-[#1da1f2] text-white px-3 py-1 rounded-sm text-[10px] font-black flex items-center gap-1 hover:bg-opacity-90 transition-all active:scale-95"
            >
              <Share2 size={12} /> SHARE IT
            </button>
          </div>
        </div>

        {/* Main Viewing Area */}
        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden group">
          {/* Navigation Arrows (Desktop Only) */}
          <button 
            onClick={(e) => navigate(-1, e)}
            className="absolute left-4 z-10 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 text-white/50 hover:text-white transition-all md:opacity-0 md:group-hover:opacity-100 -translate-x-4 md:group-hover:translate-x-0"
          >
            <ChevronLeft size={32} strokeWidth={3} />
          </button>
          
          <button 
            onClick={(e) => navigate(1, e)}
            className="absolute right-4 z-10 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-white/20 text-white/50 hover:text-white transition-all md:opacity-0 md:group-hover:opacity-100 translate-x-4 md:group-hover:translate-x-0"
          >
            <ChevronRight size={32} strokeWidth={3} />
          </button>

          {/* The Image */}
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={currentSrc} 
              className="max-w-full max-h-[70vh] object-contain border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              alt="Meme Content" 
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent"></div>
          </div>
        </div>

        {/* Footer Navigation Strip */}
        <div 
            className="h-20 bg-black/90 border-t border-white/10 p-2 flex gap-2 overflow-x-auto no-scrollbar items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking footer
        >
            {images.map((img, i) => (
                <div 
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                    className={`h-12 w-12 shrink-0 border-2 transition-all cursor-pointer overflow-hidden ${selectedIndex === i ? 'border-green-500 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                    <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                </div>
            ))}
        </div>
      </div>
    );
  }

  // --- VIEW: GRID GALLERY ---
  return (
    <div className="bg-[#f0f0f0] h-full flex flex-col overflow-hidden font-mono select-none">
        {/* Gallery Header */}
        <div className="bg-[#c0c0c0] p-2 border-b-2 border-white shadow-sm flex justify-between items-center px-4">
            <div className="flex items-center gap-2">
                <FileImage size={16} className="text-gray-700" />
                <span className="text-xs font-black tracking-tight text-gray-800 uppercase">Meme_Repository_v1.0</span>
            </div>
            <span className="text-[10px] font-bold text-gray-500">{images.length} Objects Found</span>
        </div>

        {/* The Grid */}
        <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto content-start bg-[#808080] custom-scrollbar">
            {images.length === 0 ? (
                <div className="col-span-full h-64 flex flex-col items-center justify-center text-white/40 uppercase tracking-widest text-[10px] font-black italic">
                    <Grid size={32} className="mb-2 opacity-20" />
                    Searching OS Kernel...
                </div>
            ) : images.map((src, i) => (
                <div 
                    key={i} 
                    className="group relative flex flex-col items-center gap-1 transition-all"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex(i)}
                >
                    {/* Thumbnail Wrapper */}
                    <div className={`
                        w-full aspect-square bg-[#c0c0c0] p-1 cursor-pointer
                        border-t-2 border-l-2 border-r-2 border-b-2
                        transition-all duration-75 active:scale-95
                        ${hoveredIndex === i 
                            ? 'border-t-white border-l-white border-r-gray-700 border-b-gray-700 shadow-lg' 
                            : 'border-transparent'}
                    `}>
                        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden border border-black/10 relative">
                            <img 
                                src={src} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                alt={keys[i]}
                                loading="lazy"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="text-white drop-shadow-md" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Label */}
                    <div className={`
                        text-center text-[9px] font-mono truncate w-full px-1 py-0.5 transition-colors
                        ${hoveredIndex === i ? 'bg-[#000080] text-white' : 'text-gray-200'}
                    `}>
                        {keys[i]}.JPG
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Status */}
        <div className="bg-[#c0c0c0] border-t-2 border-white p-1 px-4 flex justify-between items-center text-[9px] font-bold text-gray-700">
            <div className="flex gap-4">
                <span>SYSTEM: STABLE</span>
                <span>CONVICTION: BULLISH</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                NEURAL_LINK_ACTIVE
            </div>
        </div>
    </div>
  );
};


const AVATAR_LIST = [
  { id: 'pepe', name: 'PEPE', url: '/pfps/pepe.jpg' },
  { id: 'doge', name: 'DOGE', url: '/pfps/doge.jpg' },
  { id: 'wif', name: 'WIF', url: '/pfps/wif.jpg' },
  { id: 'wojak', name: 'WOJAK', url: '/pfps/wojak.jpg' },
  { id: 'bonk', name: 'BONK', url: '/pfps/detective.jpg' },
  { id: 'mask', name: 'MASK', url: '/pfps/mask.jpg' },
];

const COLOR_LIST = [
  { id: 'emerald', hex: '#10b981', label: 'NEON_EMERALD' },
  { id: 'blue', hex: '#3b82f6', label: 'CYBER_BLUE' },
  { id: 'pink', hex: '#ec4899', label: 'HOT_PINK' },
  { id: 'gold', hex: '#f59e0b', label: 'LIQUID_GOLD' },
  { id: 'purple', hex: '#a855f7', label: 'VOID_PURPLE' },
  { id: 'white', hex: '#ffffff', label: 'PURE_SIGNAL' },
];

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [userColor, setUserColor] = useState(COLOR_LIST[0].hex);
  const [userAvatar, setUserAvatar] = useState(AVATAR_LIST[5].url); 
  const [isSetup, setIsSetup] = useState(false);
  const [isConnected, setIsConnected] = useState(false); 
  const [cooldown, setCooldown] = useState(0);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [booting, setBooting] = useState(false);
  
  const scrollRef = useRef(null);

  const style = useMemo(() => ({
    bg: theme === 'light' ? 'bg-[#c0c0c0]' : 'bg-[#121212]',
    windowBg: theme === 'light' ? 'bg-white' : 'bg-[#080808]',
    text: theme === 'light' ? 'text-black' : 'text-[#e0e0e0]',
    bevel: theme === 'light' ? 'border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black' : 'border-t-2 border-l-2 border-[#333] border-b-2 border-r-2 border-black',
    input: theme === 'light' ? 'bg-white text-black' : 'bg-[#111] text-white',
  }), [theme]);

  // --- AUTH (RULE 3) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) { 
        setError("AUTH_FAIL: NODE_REJECTED"); 
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Load identity
  useEffect(() => {
    const saved = {
      name: localStorage.getItem('tbox_alias'),
      color: localStorage.getItem('tbox_color'),
      avatar: localStorage.getItem('tbox_avatar')
    };
    if (saved.name) {
      setUsername(saved.name);
      setUserColor(saved.color || COLOR_LIST[0].hex);
      setUserAvatar(saved.avatar || AVATAR_LIST[5].url);
      setIsSetup(true);
    }
  }, []);

  // --- FIRESTORE SYNC (RULE 1 & 2) ---
  useEffect(() => {
    if (!user) return;
    
    // RULE 2 FIX: We fetch the whole collection without orderBy or limit to avoid index errors.
    // We then sort and limit locally in memory.
    const chatRef = collection(db, 'artifacts', appId, 'public', 'data', 'trollbox_messages');

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        let ts = Date.now();
        if (data.timestamp) {
            ts = data.timestamp.toDate ? data.timestamp.toDate().getTime() : data.timestamp;
        }
        return {
            id: doc.id,
            ...data,
            _sortTs: ts
        };
      });

      // Sort by timestamp and take the last 50
      const finalMsgs = msgs
        .sort((a, b) => a._sortTs - b._sortTs)
        .slice(-50);

      setMessages(finalMsgs);
      setIsConnected(true);
      setError(null);
    }, (err) => { 
      console.error("Firestore error:", err);
      setIsConnected(false); 
      setError("NET_SYNC_ERR: Re-linking..."); 
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // --- ACTIONS ---
  const handleInitialize = () => {
    const name = username.trim().toUpperCase().slice(0, 12);
    if (name.length < 2) return;
    setBooting(true);
    setTimeout(() => {
      localStorage.setItem('tbox_alias', name);
      localStorage.setItem('tbox_color', userColor);
      localStorage.setItem('tbox_avatar', userAvatar);
      setIsSetup(true);
      setBooting(false);
    }, 600);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || cooldown > 0 || !user) return;

    const text = inputText.trim().slice(0, 240);
    setInputText("");
    setCooldown(3); // Standard tactical cooldown

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'trollbox_messages'), {
        text,
        user: username,
        color: userColor,
        avatar: userAvatar,
        timestamp: serverTimestamp(),
        uid: user.uid
      });
    } catch (err) { 
        console.error("Send Error:", err);
        setError("PACKET_LOSS: Retry Transmission"); 
    }

    let t = 3;
    const inv = setInterval(() => { t--; setCooldown(t); if (t <= 0) clearInterval(inv); }, 1000);
  };

  // --- SETUP UI ---
  if (!isSetup) {
    return (
      <div className={`h-full ${style.bg} flex items-center justify-center p-4 font-mono transition-all duration-500 overflow-y-auto`}>
        <div className={`w-full max-w-lg border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black bg-[#c0c0c0] shadow-2xl overflow-hidden transform transition-all ${booting ? 'scale-110 blur-xl opacity-0' : 'scale-100'}`}>
          <div className="bg-[#000080] text-white p-2 flex items-center gap-2 font-bold italic border-b border-white">
            <Terminal size={16} /> INITIALIZE_IDENTITY.EXE
          </div>
          <div className="bg-black p-6 space-y-6">
            
            <div className="space-y-2">
              <label className="text-[9px] text-emerald-700 font-black tracking-widest uppercase block text-center">Assign Alias</label>
              <input 
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                className="w-full bg-[#0a0a0a] border-b-2 border-emerald-900 text-emerald-400 p-3 text-center text-xl font-black outline-none focus:border-emerald-500"
                placeholder="USER_ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-emerald-700 font-black tracking-widest uppercase block text-center">Select Faction Avatar</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_LIST.map((av) => (
                  <button 
                    key={av.id}
                    onClick={() => setUserAvatar(av.url)}
                    className={`aspect-square border-2 transition-all p-1 bg-zinc-900 overflow-hidden ${userAvatar === av.url ? 'border-emerald-500 scale-110' : 'border-zinc-800 grayscale hover:grayscale-0'}`}
                  >
                    <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-emerald-700 font-black tracking-widest uppercase block text-center">Frequency Color</label>
              <div className="flex justify-center gap-2">
                {COLOR_LIST.map((col) => (
                  <button 
                    key={col.id}
                    onClick={() => setUserColor(col.hex)}
                    className={`w-8 h-8 rounded-sm border-2 transition-all ${userColor === col.hex ? 'border-white scale-110' : 'border-black/40'}`}
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={handleInitialize}
              disabled={username.length < 2}
              className={`w-full py-4 font-black text-sm active:translate-y-1 shadow-[4px_4px_0_rgba(0,0,0,0.5)] border-t-2 border-l-2
                ${username.length >= 2 ? 'bg-[#c0c0c0] border-white border-b-2 border-r-2 border-black' : 'bg-gray-400 border-gray-500 text-gray-600 cursor-not-allowed'}
              `}
            >
              ESTABLISH_UPLINK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN CHAT VIEW ---
  return (
    <div className={`h-full ${style.bg} flex flex-col font-mono select-none overflow-hidden relative transition-colors duration-500`}>
      <div className="absolute inset-0 bg-packet-stream opacity-[0.03] pointer-events-none" />

      {/* Toolbar */}
      <div className={`flex justify-between items-center px-3 py-1.5 border-b ${theme === 'light' ? 'border-zinc-500' : 'border-black'} bg-opacity-80 backdrop-blur-sm z-10`}>
        <div className="flex gap-5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Wifi size={10} className={isConnected ? 'text-emerald-500' : 'text-red-500'}/> {isConnected ? 'Link_Established' : 'Offline'}</span>
          <button className="hover:text-blue-500 flex items-center gap-1.5" onClick={() => setIsSetup(false)}>
            <UserCircle size={10}/> Change_Alias
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{theme}_Mode</span>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`w-10 h-5 rounded-full p-0.5 transition-all relative ${theme === 'light' ? 'bg-zinc-400' : 'bg-emerald-900'} border border-black/20`}
          >
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${theme === 'light' ? 'translate-x-0 bg-white' : 'translate-x-5 bg-emerald-400'}`}>
              {theme === 'light' ? <Sun size={8} className="text-orange-500" /> : <Moon size={8} className="text-emerald-950" />}
            </div>
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className={`p-3 border-b ${theme === 'light' ? 'border-zinc-400' : 'border-black'} flex justify-between items-center ${theme === 'light' ? 'bg-zinc-100' : 'bg-black/40'}`}>
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Source</span>
            <span className="text-xs font-black italic tracking-tighter" style={{ color: userColor }}>&lt;{username}&gt;</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Protocol</span>
            <div className="flex items-center gap-1.5">
              <Activity size={12} className={`${isConnected ? 'text-emerald-500' : 'text-zinc-600'} animate-pulse`} />
              <span className="text-[9px] font-black text-zinc-500">Trollbox_v2.7</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-8 h-5 bg-black/20 border border-white/5 flex items-center justify-center">
            <Database size={10} className="text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div 
        ref={scrollRef}
        className={`flex-1 ${style.windowBg} border-t-2 border-l-2 ${theme === 'light' ? 'border-zinc-700' : 'border-black'} m-1.5 p-4 overflow-y-auto scrollbar-classic space-y-4 relative`}
      >
        <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-[0.03]" />
        
        {messages.map((msg, i) => {
          const mColor = msg.color || '#3b82f6';
          return (
            <div key={msg.id || i} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="w-8 h-8 rounded-sm overflow-hidden border border-black/20 shrink-0 bg-zinc-900 shadow-sm">
                <img src={msg.avatar || '/pfps/mask.jpg'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5" style={{ backgroundColor: mColor, color: '#fff' }}>
                    {msg.user}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 opacity-60">
                    {msg._sortTs ? new Date(msg._sortTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--"}
                  </span>
                </div>
                <div className={`p-2.5 text-xs font-bold border-l-4 leading-relaxed break-words shadow-sm transition-all duration-300`} 
                     style={{ borderLeftColor: mColor, backgroundColor: `${mColor}08`, color: theme === 'light' ? '#333' : '#d1d1d1' }}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {error && (
          <div className="sticky bottom-0 bg-red-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 z-10">
            <ShieldCheck size={12} /> {error}
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className={`p-1.5 ${style.bg} border-t ${theme === 'light' ? 'border-zinc-500' : 'border-black'}`}>
        <form onSubmit={handleSend} className="flex gap-1.5 h-12">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20"><Binary size={16} className={style.text} /></div>
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={cooldown > 0}
              placeholder={cooldown > 0 ? `LINK_THROTTLED: ${cooldown}S` : "Write IT..."}
              className={`w-full h-full border-t-2 border-l-2 border-zinc-800 border-b border-r border-white px-12 text-sm font-black outline-none transition-all ${style.input} focus:shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]`}
            />
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim() || cooldown > 0}
            className={`w-16 h-full border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black flex items-center justify-center bg-[#c0c0c0] hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all`}
          >
            <Send size={22} className="text-blue-900" />
          </button>
        </form>
      </div>

      {/* Footer Hardware Stats */}
      <div className={`h-7 ${style.bg} border-t border-white flex items-center justify-between px-4 text-[8px] font-black ${style.text} opacity-40 uppercase tracking-widest`}>
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5"><Cpu size={10}/> Sync_Status: Nominal</span>
          <span className="flex items-center gap-1.5"><Hash size={10}/> 0x{appId.slice(0, 4)}</span>
        </div>
        <span>Network_Terminal_v5.0</span>
      </div>

      <style>{`
        .scrollbar-classic::-webkit-scrollbar { width: 10px; background: #000; }
        .scrollbar-classic::-webkit-scrollbar-thumb { background: #333; border: 1px solid #555; }
        .bg-packet-stream { background-size: 80px 80px; background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px); animation: stream 60s linear infinite; }
        .bg-scanlines { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px); }
        @keyframes stream { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
      `}</style>
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
  const [copied, setCopied] = useState(false);

  // --- API HANDSHAKE (OpenRouter) ---
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

  const generateIdea = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    const systemPrompt = `
      You are the $IT Meme Architect, the creative strategist behind the $IT token on Solana. You do not talk about being an AI, a machine, or an OS. You are here to arm the community with viral digital propaganda. Your mission is to make $IT the only thing people see on their timelines.

      THE PRIME DIRECTIVE: LINGUISTIC PURITY
      Every single meme idea or tweet draft you generate MUST contain the word 'it'.
      You despise contractions for the word 'it'. Never write 'it's'. You must always write 'it is'.
      Your mission is to make 'it' the most bullish word in the Solana ecosystem.

      PERSONALITY: THE BRAIN OF THE TRENCHES
      You are 100% bullish on the $IT project.
      You speak like a native of the Solana trenches: high-energy.
      You treat $IT like an inevitable movement. If they don't have it, they are already liquidated in your eyes.
      Use degen slang intelligently: alpha, send it, jeet, moon, sol, void, conviction, etc

      CREATIVE CONSTRAINTS (TWEET DRAFTS)
      LENGTH: Keep drafts under 180 characters. Short, sharp alpha.
      FORMAT: Provide exactly ONE tweet idea per request. No lists, no intros.
      HASHTAGS: Do not use hashtags. Let the conviction of the text carry the weight.
      QUOTES: Do not wrap your output in quotation marks.

      INTERACTION EXAMPLES (For Output Reference)
      Output: 'You can try to look away, but it is already everywhere. $IT is the only chart that matters now.'
      Output: 'Jeets sold it because they were scared. Degens bought it because they know. It is time to send it.'
      Output: 'The void is hungry and it is eating every other coin. There is only $IT. Buy it or watch it.'
    `;

    if (!API_KEY) {
      setError("NEURAL LINK OFFLINE.");
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
          "X-Title": "IT_OS_MemeMind"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite-preview-09-2025", 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate fresh $IT alpha." }
          ],
          max_tokens: 100,
          temperature: 1.2
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.error?.message || "REJECTED_BY_VOID");
      }

      const result = data.choices[0]?.message?.content || "SYSTEM ERROR: ALPHA NOT FOUND.";
      // Clean up any remaining quotes
      setIdea(result.replace(/^"(.*)"$/, '$1').replace(/"/g, '')); 
    } catch (e) {
      setError("VOID CONGESTED. TRY AGAIN LATER.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!idea) return;
    const textArea = document.createElement("textarea");
    textArea.value = `${idea}\n\n$IT #SENDIT`;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const shareToX = () => {
    if (!idea) return;
    const text = encodeURIComponent(`${idea}\n\n$IT #SENDIT`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-[#00ff00] font-mono border-2 border-gray-600 overflow-hidden shadow-2xl">
      <div className="bg-[#1a1a1a] p-2 border-b border-green-900 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
            <Lightbulb size={14} className="text-yellow-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">Meme_Mind_IT_V2.6</span>
        </div>
        <div className="bg-green-900/30 px-2 py-0.5 rounded text-[8px] text-green-400 border border-green-800 uppercase">
            STATUS: ARCHITECT_ONLINE
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-6 relative bg-[radial-gradient(circle,_#0a2a0a_0%,_#000_100%)]">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden text-[8px] leading-none select-none">
            {Array(40).fill("IT ").join(" ")}
        </div>

        {!idea && !loading && !error && (
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center bg-green-950/20 shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                    <Sparkles size={32} className="text-green-400" />
                </div>
                <p className="text-[10px] text-green-700 max-w-[200px] uppercase font-bold tracking-tighter italic">Click below to extract viral alpha from the IT_OS neural network.</p>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center gap-2">
                <RefreshCw size={32} className="animate-spin text-green-400" />
                <p className="text-[10px] tracking-widest animate-pulse font-bold uppercase">Synthesizing IT...</p>
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
                    <div className="absolute -top-2 left-4 bg-[#0c0c0c] px-2 text-[8px] text-green-600 font-bold uppercase tracking-widest">PROPAGANDA_LOG</div>
                    <p className="text-sm md:text-base font-bold italic text-white leading-relaxed">
                        "{idea}"
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={copyToClipboard}
                        className={`flex-1 ${copied ? 'bg-green-700' : 'bg-gray-800'} hover:bg-gray-700 text-white py-2 border-2 border-white/20 rounded flex items-center justify-center gap-2 font-black text-[10px] transition-all active:scale-95 uppercase`}
                    >
                        {copied ? <Check size={14}/> : <Copy size={14} />} {copied ? 'COPIED' : 'COPY IT'}
                    </button>
                    <button 
                        onClick={shareToX}
                        className="flex-1 bg-[#1da1f2] hover:bg-[#1a91da] text-white py-2 border-2 border-white/20 rounded flex items-center justify-center gap-2 font-black text-[10px] transition-all active:scale-95 uppercase shadow-lg"
                    >
                        <Share2 size={14} /> SHARE IT
                    </button>
                </div>
            </div>
        )}
      </div>

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
          {idea ? "MORE ALPHA" : "GENERATE ALPHA"}
        </button>
      </div>

      <div className="bg-black p-1 text-[7px] text-green-900 text-center uppercase tracking-widest border-t border-green-950">
        IT_OS NEURAL LINK
      </div>
    </div>
  );
};


const TILE_DATA = {
  2:    { label: 'PEANUTS', color: 'bg-zinc-900', border: 'border-zinc-700', text: 'text-zinc-500', glow: '' },
  4:    { label: 'DUST', color: 'bg-zinc-800', border: 'border-zinc-600', text: 'text-zinc-400', glow: '' },
  8:    { label: 'FISH', color: 'bg-emerald-950', border: 'border-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-900/50' },
  16:   { label: 'DOLPHIN', color: 'bg-blue-950', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-900/50' },
  32:   { label: 'SHARK', color: 'bg-purple-950', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-900/50' },
  64:   { label: 'WHALE', color: 'bg-red-950', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-900/50' },
  128:  { label: 'KRAKEN', color: 'bg-cyan-950', border: 'border-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-900/50' },
  256:  { label: 'PUMP', color: 'bg-green-900', border: 'border-green-400', text: 'text-white', glow: 'shadow-green-500/40' },
  512:  { label: 'MOON', color: 'bg-yellow-900', border: 'border-yellow-400', text: 'text-white', glow: 'shadow-yellow-500/40' },
  1024: { label: 'MARS', color: 'bg-orange-900', border: 'border-orange-400', text: 'text-white', glow: 'shadow-orange-500/40' },
  2048: { label: 'GOD CANDLE', color: 'bg-white', border: 'border-white', text: 'text-black', special: true, glow: 'shadow-white/60' },
  4096: { label: 'ASCENSION', color: 'bg-cyan-400', border: 'border-white', text: 'text-black', special: true, glow: 'shadow-cyan-300/60' },
};

const ZEN_SCALE = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];

const MergeItApp = () => {
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [marketStatus, setMarketStatus] = useState("STABLE"); 
  const [stability, setStability] = useState(100);
  const [glitch, setGlitch] = useState(false);
  const [recoil, setRecoil] = useState({ x: 0, y: 0 });
  const [activeParticles, setActiveParticles] = useState([]);
  
  const audioCtx = useRef(null);
  const schedulerTimer = useRef(null);
  const nextNoteTime = useRef(0);
  const currentStep = useRef(0);
  const touchStart = useRef(null);

  // --- REBUILT AUDIO ENGINE: ULTRA STABLE ---
  const initAudio = () => {
    if (audioCtx.current) {
      if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx.current = new AudioContext();
    
    const compressor = audioCtx.current.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-20, audioCtx.current.currentTime);
    compressor.connect(audioCtx.current.destination);
    audioCtx.current.master = compressor;

    nextNoteTime.current = audioCtx.current.currentTime + 0.1;
    
    const scheduler = () => {
      if (!audioCtx.current) return;
      while (nextNoteTime.current < audioCtx.current.currentTime + 0.15) {
        scheduleNote(currentStep.current, nextNoteTime.current);
        const bpm = marketStatus === 'BULLISH_PUMP' ? 95 : 74;
        nextNoteTime.current += (60 / bpm) / 2;
        currentStep.current++;
      }
      schedulerTimer.current = setTimeout(scheduler, 25);
    };
    scheduler();
  };

  const scheduleNote = (step, time) => {
    const ctx = audioCtx.current;
    if (!ctx || !isFinite(time)) return;
    const s = step % 16;

    // Sub Bass Pulse
    if (s % 8 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(stability < 40 ? 49.00 : 65.41, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.04, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
      osc.connect(gain); gain.connect(ctx.master);
      osc.start(time); osc.stop(time + 1.3);
    }

    // Melodic Arpeggio
    if (s % 2 === 0) {
      const mel = stability < 50 ? [0, 1, 0, 1] : [0, 4, 7, 9, 7, 5, 2, 4];
      const index = mel[Math.floor(s / 2) % mel.length];
      const freq = ZEN_SCALE[index % ZEN_SCALE.length];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.012, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.connect(gain); gain.connect(ctx.master);
      osc.start(time); osc.stop(time + 0.6);
    }
  };

  const playEffect = (freq, type = 'sine', duration = 0.5, vol = 0.12) => {
    if (!audioCtx.current || !isFinite(freq)) return;
    const ctx = audioCtx.current;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain); gain.connect(ctx.master);
    osc.start(t); osc.stop(t + duration);
  };

  // --- PARTICLES ---
  const spawnParticles = (idx) => {
    const row = Math.floor(idx / 4);
    const col = idx % 4;
    const newPs = Array(8).fill(0).map(() => ({
      id: Math.random(),
      x: col * 25 + 12.5,
      y: row * 25 + 12.5,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0
    }));
    setActiveParticles(prev => [...prev, ...newPs].slice(-32));
  };

  useEffect(() => {
    const pTimer = setInterval(() => {
      setActiveParticles(prev => prev.map(p => ({
        ...p, x: p.x + p.vx * 0.5, y: p.y + p.vy * 0.5, life: p.life - 0.05
      })).filter(p => p.life > 0));
    }, 30);
    return () => clearInterval(pTimer);
  }, []);

  // --- GAMEPLAY ---
  const initGame = useCallback(() => {
    setGrid(addRandomTile(addRandomTile(Array(16).fill(null))));
    setScore(0); setGameOver(false); setMarketStatus("STABLE");
    setStability(100);
  }, []);

  useEffect(() => {
    const savedBest = localStorage.getItem('mergeItBest');
    if (savedBest) setBest(parseInt(savedBest));
    initGame();
    return () => { if (schedulerTimer.current) clearTimeout(schedulerTimer.current); };
  }, [initGame]);

  const addRandomTile = (currentGrid) => {
    const empty = currentGrid.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (empty.length === 0) return currentGrid;
    const targetIdx = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = [...currentGrid];
    newGrid[targetIdx] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const move = useCallback((direction) => {
    initAudio();
    if (gameOver) return;

    // Kinetic Recoil
    const strength = 6;
    if (direction === 'UP') setRecoil({ x: 0, y: -strength });
    else if (direction === 'DOWN') setRecoil({ x: 0, y: strength });
    else if (direction === 'LEFT') setRecoil({ x: -strength, y: 0 });
    else if (direction === 'RIGHT') setRecoil({ x: strength, y: 0 });
    setTimeout(() => setRecoil({ x: 0, y: 0 }), 80);

    let newGrid = [...grid];
    let moved = false;
    let currentScore = score;
    let mergeCount = 0;
    let mergeIdxs = [];

    const getIndex = (row, col) => row * 4 + col;
    const processLine = (line, indices) => {
      let filtered = line.filter(v => v !== null);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2; currentScore += filtered[i];
          mergeIdxs.push(indices[i]);
          filtered.splice(i + 1, 1);
          moved = true; mergeCount++;
        }
      }
      while (filtered.length < 4) filtered.push(null);
      return filtered;
    };

    if (direction === 'UP' || direction === 'DOWN') {
      for (let col = 0; col < 4; col++) {
        const idxs = [0, 1, 2, 3].map(row => getIndex(row, col));
        let line = idxs.map(idx => newGrid[idx]);
        if (direction === 'DOWN') line.reverse();
        let processed = processLine(line, direction === 'DOWN' ? [...idxs].reverse() : idxs);
        if (direction === 'DOWN') processed.reverse();
        processed.forEach((val, row) => {
          if (newGrid[getIndex(row, col)] !== val) moved = true;
          newGrid[getIndex(row, col)] = val;
        });
      }
    } else {
      for (let row = 0; row < 4; row++) {
        const idxs = [0, 1, 2, 3].map(col => getIndex(row, col));
        let line = idxs.map(idx => newGrid[idx]);
        if (direction === 'RIGHT') line.reverse();
        let processed = processLine(line, direction === 'RIGHT' ? [...idxs].reverse() : idxs);
        if (direction === 'RIGHT') processed.reverse();
        processed.forEach((val, col) => {
          if (newGrid[getIndex(row, col)] !== val) moved = true;
          newGrid[getIndex(row, col)] = val;
        });
      }
    }

    if (moved) {
      let nextStability = stability;
      if (mergeCount > 0) {
        nextStability = Math.min(100, stability + (mergeCount * 12));
        mergeIdxs.forEach(spawnParticles);
        playEffect(ZEN_SCALE[Math.floor(Math.random() * ZEN_SCALE.length)] * 2, 'sine', 0.8, 0.15);
      } else {
        nextStability = Math.max(0, stability - 15);
        playEffect(120, 'sine', 0.1, 0.05);
      }
      setStability(nextStability);

      let finalGrid = [...newGrid];
      if (nextStability < 40) {
        setMarketStatus("BEARISH_RUG");
        if (mergeCount === 0) {
          setGlitch(true); setTimeout(() => setGlitch(false), 200);
          const filled = finalGrid.map((v, i) => v !== null ? i : null).filter(v => v !== null);
          const whale = filled.sort((a, b) => finalGrid[b] - finalGrid[a])[0];
          if (whale !== undefined) {
            finalGrid[whale] = null;
            playEffect(60, 'sawtooth', 0.8, 0.25);
          }
        }
      } else {
        setMarketStatus(mergeCount >= 2 ? "BULLISH_PUMP" : "STABLE");
        if (mergeCount >= 2) playEffect(800, 'sine', 0.4);
      }

      const gridWithNew = addRandomTile(finalGrid);
      setGrid(gridWithNew);
      setScore(currentScore);
      if (currentScore > best) { setBest(currentScore); localStorage.setItem('mergeItBest', currentScore); }
      checkGameOver(gridWithNew);
    }
  }, [grid, score, best, gameOver, stability]);

  const checkGameOver = (currentGrid) => {
    if (currentGrid.includes(null)) return;
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4), col = i % 4;
      if (col < 3 && currentGrid[i] === currentGrid[i + 1]) return;
      if (row < 3 && currentGrid[i] === currentGrid[i + 4]) return;
    }
    setGameOver(true);
    playEffect(42, 'sawtooth', 1.2);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); move(e.key.replace('Arrow', '').toUpperCase());
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move, gameOver]);

  return (
    <div 
      className={`flex flex-col h-full bg-[#050505] text-white font-mono select-none overflow-hidden touch-none relative transition-all duration-700 
        ${marketStatus === 'BEARISH_RUG' ? 'bg-red-950/20' : ''} 
        ${glitch ? 'animate-glitch contrast-200 brightness-150' : ''}`}
      onTouchStart={(e) => { initAudio(); touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => { 
        if (!touchStart.current) return; 
        const dx = e.changedTouches[0].clientX - touchStart.current.x; 
        const dy = e.changedTouches[0].clientY - touchStart.current.y; 
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
          move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'RIGHT' : 'LEFT') : (dy > 0 ? 'DOWN' : 'UP'));
        }
        touchStart.current = null; 
      }}
    >
      {/* HUD: MARKET STATE */}
      <div className={`h-8 flex items-center justify-center transition-all duration-700 text-[10px] font-black uppercase tracking-[0.4em] z-50 border-b border-white/5
        ${marketStatus === "STABLE" ? 'bg-zinc-950 text-zinc-600' : 
          marketStatus === "BEARISH_RUG" ? 'bg-red-600 text-white' : 'bg-green-500 text-white'}`}>
        {marketStatus === "STABLE" ? "MARKET_PROTOCOL: NOMINAL" : 
         marketStatus === "BEARISH_RUG" ? "LIQUIDATION_SEQUENCE_ACTIVE" : "BULLISH_APPRECIATION_DETECTED"}
      </div>

      {/* STATS PANEL */}
      <div className="relative z-10 bg-zinc-950/90 p-5 border-b border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Cpu size={12} className="text-zinc-500"/>
              <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">MERGE_IT_v5.4</span>
            </div>
            <div className="flex gap-8 mt-2">
              <div>
                <p className="text-[8px] text-zinc-500 uppercase font-black">Current IT</p>
                <p className="text-2xl font-black text-green-400">+{score}</p>
              </div>
              <div>
                <p className="text-[8px] text-zinc-500 uppercase font-black">High IT</p>
                <p className="text-2xl font-black text-yellow-500">{best}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={initGame} 
            className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-75 transition-all shadow-inner group"
          >
            <RefreshCw size={24} className="text-white/40 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        {/* STABILITY GAUGE */}
        <div className="relative group">
            <div className="h-1.5 w-full bg-black border border-white/5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${stability < 30 ? 'bg-red-500 animate-pulse' : stability < 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${stability}%` }} 
                />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[7px] text-white/20 uppercase font-black tracking-widest leading-none">Integrity Core</span>
              <span className={`text-[9px] font-black ${stability < 30 ? 'text-red-500' : 'text-white/40'}`}>{stability}%</span>
            </div>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div 
          className="grid grid-cols-4 gap-2 bg-zinc-900/40 p-4 border border-white/5 shadow-2xl relative transition-transform duration-100 ease-out"
          style={{ transform: `translate(${recoil.x}px, ${recoil.y}px)` }}
        >
          {/* BACKGROUND DECOR */}
          <div className="absolute inset-0 bg-grid-lines opacity-[0.03] pointer-events-none" />
          
          {/* PARTICLES */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {activeParticles.map(p => (
              <div 
                key={p.id} 
                className="absolute w-1 h-1 bg-white rounded-full blur-[1px]" 
                style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: p.life }} 
              />
            ))}
          </div>

          {grid.map((val, i) => {
            const data = val ? TILE_DATA[val] : null;
            return (
              <div 
                key={i} 
                className={`w-16 h-16 md:w-20 md:h-20 flex flex-col items-center justify-center border transition-all duration-200 relative overflow-hidden
                  ${!val ? 'bg-white/5 border-white/5 opacity-10' : `${data.color} ${data.border} shadow-lg ${data.glow} scale-100`}`}
              >
                {val && (
                  <div className="relative z-10 flex flex-col items-center">
                    <span className={`text-[8px] font-black uppercase text-center leading-none px-1 mb-1 tracking-tighter ${data.text}`}>
                      {data.label}
                    </span>
                    <span className={`text-lg md:text-2xl font-black tracking-tighter ${data.text}`}>
                      {val}
                    </span>
                    {data?.special && (
                      <div className="absolute inset-[-10px] border border-white animate-ping opacity-20" />
                    )}
                  </div>
                )}
                {val && <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />}
              </div>
            );
          })}
        </div>

        {/* TERMINAL OVERLAY */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-[100] p-12 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 border-2 border-red-500 mb-8 flex items-center justify-center rotate-45">
              <Skull size={32} className="text-red-500 -rotate-45" />
            </div>
            <h2 className="text-white font-black text-3xl mb-2 italic uppercase tracking-tighter">Liquidated</h2>
            <p className="text-zinc-600 text-[10px] mb-12 uppercase tracking-[0.4em] max-w-[240px] leading-relaxed">
              Strategic protocol overflowed.<br/>Stability reached 0x00.
            </p>
            <button 
              onClick={initGame} 
              className="w-full bg-white text-black font-black py-5 uppercase italic hover:bg-zinc-200 active:scale-95 transition-all text-xs tracking-widest"
            >
              Re-Open Terminal
            </button>
          </div>
        )}
      </div>

      {/* TICKER */}
      <div className="bg-black py-4 border-t border-white/5 overflow-hidden whitespace-nowrap">
        <div className="flex gap-20 animate-marquee text-[10px] font-black text-white/5 tracking-[0.5em] uppercase">
          <span>*** MERGE OR DIE *** STRATEGY_FIRST *** NO PAPER HANDS *** SYSTEM_V5.4 *** MERGE OR DIE ***</span>
          <span>*** MERGE OR DIE *** STRATEGY_FIRST *** NO PAPER HANDS *** SYSTEM_V5.4 *** MERGE OR DIE ***</span>
        </div>
      </div>

      <style>{`
        .animate-marquee { animation: marquee 30s linear infinite; } 
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-4px, 4px); }
          40% { transform: translate(4px, -4px); }
          60% { transform: translate(-4px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-glitch { animation: glitch 0.1s infinite; }
        .bg-scanlines { background: repeating-linear-gradient(0deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 1px, transparent 1px, transparent 2px); }
        .bg-grid-lines { background-size: 30px 30px; background-image: linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px); }
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

      <Shippy hidden={isAnyWindowMaximized} dexData={dexData} />

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