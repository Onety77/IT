import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, X, Minus, Square, Play, Pause, SkipForward, SkipBack,
  Disc, Activity, MessageSquare, Image as ImageIcon,
  Gamepad2, Save, Trash2, Globe, Zap, Skull,
  FileText, Music, MousePointer, Volume2,
  Paintbrush, Eraser, Download, Settings, Wallet, Bot,
  Search, Layout, Type, Folder, Twitter, Users, Copy, Check,
  Menu, LogOut, ChevronRight,
  Move, RotateCcw, RotateCw, Upload,
  Maximize2, LayoutTemplate, Monitor, Share, Sliders, ChevronLeft
} from 'lucide-react';

// --- ASSET CONFIGURATION ---
const ASSETS = {
  wallpaper: "wall.jpg", 
  logo: "logo.png",
  
  // STICKERS: Used ONLY in "Paint IT" (Stamps)
  stickers: {
    main: "main.jpg",
    pumpit: "pumpit.jpg",
    sendit: "sendit.jpg",
    moonit: "moonit.jpg",
    hodlit: "hodlit.jpg",
  },

  // MEMES: Used ONLY in "Memes" Folder (Gallery)
  memes: {
    main: "main.jpg",
    pumpit: "pumpit.jpg",
    sendit: "sendit.jpg",
    moonit: "moonit.jpg",
    hodlit: "hodlit.jpg",
  }
};

// --- SOCIAL LINKS & CA ---
const SOCIALS = {
  twitter: "https://twitter.com/your_project",
  community: "https://t.me/your_community",
};

// --- MUSIC CONFIGURATION ---
const TUNES_PLAYLIST = [
  { file: "PUMP_IT_UP.mp3", title: "PUMP IT UP", duration: "3:45", artist: "Unknown Degen" },
  { file: "GREEN_CANDLES.wav", title: "GREEN CANDLES", duration: "4:20", artist: "Satoshi" },
  { file: "LIQUIDATION_CASCADE.mp3", title: "LIQUIDATION", duration: "2:10", artist: "The Bears" },
  { file: "WAGMI_ANTHEM.mp3", title: "WAGMI ANTHEM", duration: "5:55", artist: "Community" }
];

const CA_ADDRESS = "So11111111111111111111111111111111111111112"; 

// --- UTILITIES ---
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

// --- HOOKS ---

// 1. Live Price Data
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

// 2. Wallet Connection
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
        // No more simulation. Direct user guidance.
        alert("Please open IT on PC to Connect IT, or install the Phantom Wallet extension!");
      }
    } catch (err) { alert("Connection Failed"); } finally { setConnecting(false); }
  };
  return { wallet, connect, connecting };
};

// --- UI COMPONENTS ---

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

// --- START MENU COMPONENT ---
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
               { id: 'terminal', icon: Terminal, label: 'Terminal IT' },
               { id: 'paint', icon: Paintbrush, label: 'Paint IT' },
               { id: 'memes', icon: Folder, label: 'Memes' },
               { id: 'tunes', icon: Music, label: 'Tune IT' },
               { id: 'rugsweeper', icon: Gamepad2, label: 'Play IT' },
               { id: 'notepad', icon: FileText, label: 'Write IT' },
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

// --- APPS (Same content, optimized containers) ---

const Shippy = ({ hidden }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [messages, setMessages] = useState([{ role: 'shippy', text: "I see you're online. Would you like to PUMP IT?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = "sk-YOUR_OPENAI_API_KEY_HERE"; 
  
  const SYSTEM_PROMPT = `You are Shippy, the chaotic AI assistant for the $IT memecoin. Rules: 1. Bullish. 2. Hate FUD. 3. End sentences with 'T'. 4. Short & funny. 5. 1 IT = 1 IT.`;

  const handleSend = async () => {
    if(!input.trim()) return;
    const userText = input; setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    if (!API_KEY || API_KEY.includes("YOUR_OPENAI_API_KEY")) {
      setTimeout(() => {
        const replies = ["I NEED A BRAIN (API KEY) TO THINK T.", "SYSTEM ERROR: NO GAS T."];
        setMessages(prev => [...prev, { role: 'shippy', text: replies[Math.floor(Math.random() * replies.length)] }]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-4).map(m => ({ role: m.role === 'shippy' ? 'assistant' : 'user', content: m.text })), { role: "user", content: userText }],
          max_tokens: 60, temperature: 0.9
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      setMessages(prev => [...prev, { role: 'shippy', text: data.choices[0].message.content }]);
    } catch (e) {
      const errorReplies = ["MY BRAIN IS BUFFERING T.", "TOO MUCH PUMP TO PROCESS T.", "CONNECTION RUGGED T."];
      setMessages(prev => [...prev, { role: 'shippy', text: errorReplies[Math.floor(Math.random() * errorReplies.length)] }]);
    } finally { setLoading(false); }
  };

  if (!isOpen) return (
    <div className="fixed bottom-12 right-4 z-[9999] cursor-pointer flex flex-col items-center group" onClick={() => setIsOpen(true)} style={{ display: hidden ? 'none' : 'flex' }}>
       <div className="bg-white border-2 border-black px-2 py-1 mb-1 relative text-xs font-bold font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform">Talk IT</div>
       <img src={ASSETS.logo} alt="IT Bot" className="w-14 h-14 object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
    </div>
  );

  return (
    <div className="fixed bottom-12 right-4 w-72 max-w-[90vw] bg-[#ffffcc] border-2 border-black z-[9999] shadow-xl flex flex-col font-mono text-xs" style={{ display: hidden ? 'none' : 'flex' }}>
      <div className="bg-blue-800 text-white p-1 flex justify-between items-center"><span className="font-bold">Talk IT (AI)</span><X size={12} className="cursor-pointer p-1 -mr-1" onClick={() => setIsOpen(false)} /></div>
      <div className="h-56 overflow-y-auto p-2 space-y-2 border-b border-black relative" style={{ backgroundImage: `url(${ASSETS.stickers.sendit})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-white/50 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">{messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-1 border border-black shadow-md font-bold ${m.role === 'user' ? 'bg-blue-100' : 'bg-yellow-100'}`}>{m.text}</div></div>))}</div>
      </div>
      <div className="p-1 flex gap-1 bg-[#d4d0c8]">
        <input className="flex-1 border p-1" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Say something..." disabled={loading}/>
        <button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white px-2 font-bold">&gt;</button>
      </div>
    </div>
  );
};

const TerminalApp = ({ dexData }) => {
  const [history, setHistory] = useState(["OS_IT v3.0", "Connected...", "Type 'help'."]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      const newLines = [`C:\\ADMIN> ${input}`];
      if (cmd === 'help') newLines.push("COMMANDS: PRICE, CA, SEND IT, CLEAR");
      else if (cmd === 'price') newLines.push(`PRICE: ${dexData.price}`, `MCAP: ${dexData.mcap}`);
      else if (cmd === 'ca') newLines.push(`CA: ${CA_ADDRESS}`);
      else if (cmd === 'send it') newLines.push("INITIATING LAUNCH...", "SENT.");
      else if (cmd === 'clear') { setHistory([]); setInput(""); return; }
      else newLines.push("Bad command");
      setHistory(prev => [...prev, ...newLines]);
      setInput("");
    }
  };
  return (
    <div className="bg-black text-green-500 font-mono text-sm h-full p-2 overflow-y-auto" onClick={() => document.getElementById('term')?.focus()}>
      {history.map((l, i) => <div key={i}>{l}</div>)}
      <div className="flex"><span>&gt;</span><input id="term" className="bg-transparent border-none outline-none text-green-500 flex-1 ml-2" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} autoFocus /></div>
      <div ref={bottomRef} />
    </div>
  );
};

// --- PAINT APP HELPERS ---
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

// 3. PAINT IT (ULTIMATE RESPONSIVE)
const PaintApp = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- CORE STATE ---
  const [elements, setElements] = useState([]); 
  const [history, setHistory] = useState([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [canvasSize, setCanvasSize] = useState(CANVAS_PRESETS[0]);
  
  // --- VIEWPORT STATE (ZOOM/PAN) ---
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  
  // --- UI STATE ---
  // On mobile, we might hide the sticker list or properties to save space
  const [showStickers, setShowStickers] = useState(true);
  const [showProps, setShowProps] = useState(false); // Hidden by default on mobile, toggled

  // --- TOOLS STATE ---
  const [tool, setTool] = useState('move'); 
  const [selectedId, setSelectedId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // --- STYLE STATE ---
  const [toolColor, setToolColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  // --- EFFECTS STATE ---
  const [globalEffect, setGlobalEffect] = useState('none');

  // --- INTERACTION REFS ---
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const currentPathRef = useRef([]);
  const gestureRef = useRef({ startDist: 0, startScale: 1, startX: 0, startY: 0, startViewX: 0, startViewY: 0 });

  // Auto-hide panels on mount if screen is small
  useEffect(() => {
      if (window.innerWidth < 600) {
          setShowStickers(false);
          setShowProps(false);
      }
  }, []);

  // --- KEYBOARD SHORTCUTS ---
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

  // --- RENDER ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear & Fill
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
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = el.size / 15; 
        ctx.lineJoin = 'round';
        ctx.strokeText(el.text, el.x, el.y);
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
          ctx.fillRect(bx + bw, by + bh, 15, 15); // Big handle for touch
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

  // --- LOGIC ---
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
          const t1 = textTop || { id: generateId(), type: 'text', text: 'TOP IT', color: '#ffffff', font: FONTS[0].val, size: 60 };
          newElements.push({ ...t1, x: 20, y: 20 });
          const t2 = textBot || { id: generateId(), type: 'text', text: 'BOTTOM IT', color: '#ffffff', font: FONTS[0].val, size: 60 };
          newElements.push({ ...t2, x: 20, y: canvasSize.h - 80 });
          elements.forEach(e => { if (e !== mainImg && e !== textTop && e !== textBot) newElements.push(e); });
      } else if (type === 'modern') {
          if (mainImg) newElements.push({ ...mainImg, x: 0, y: 0, width: canvasSize.w, height: canvasSize.h });
          const t1 = textTop || { id: generateId(), type: 'text', text: 'I AM BUYING IT', color: '#ffffff', font: FONTS[0].val, size: 50 };
          newElements.push({ ...t1, x: 20, y: canvasSize.h - 100 });
      }
      saveHistory(newElements);
  };

  // --- TOUCH / MOUSE HANDLING ---
  const getCanvasCoords = (clientX, clientY) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      return { 
          x: (clientX - rect.left) * scaleX, 
          y: (clientY - rect.top) * scaleY 
      };
  };

  const handlePointerDown = (e) => {
      // MULTI-TOUCH ZOOM/PAN
      if (e.touches && e.touches.length === 2) {
          e.preventDefault();
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          gestureRef.current = { startDist: dist, startScale: view.scale, startX: cx, startY: cy, startViewX: view.x, startViewY: view.y };
          return;
      }

      // SINGLE TOUCH
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
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
              setShowProps(true); // Auto-open props when selecting
          } else {
              setSelectedId(null);
          }
      } else if (tool === 'brush') {
          currentPathRef.current = [pos];
          setIsDragging(true);
          setSelectedId(null);
      }
  };

  const handlePointerMove = (e) => {
      // MULTI-TOUCH
      if (e.touches && e.touches.length === 2) {
          e.preventDefault();
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const scale = Math.max(0.5, Math.min(3, gestureRef.current.startScale * (dist / gestureRef.current.startDist)));
          const dx = cx - gestureRef.current.startX;
          const dy = cy - gestureRef.current.startY;
          setView({ scale, x: gestureRef.current.startViewX + dx, y: gestureRef.current.startViewY + dy });
          return;
      }

      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
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

  const handlePointerUp = (e) => {
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

  // --- ASSET HELPERS ---
  const addText = () => {
      const newEl = { id: generateId(), type: 'text', x: 50, y: 50, text: 'EDIT IT', color: toolColor, size: 50, font: FONTS[0].val };
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
          if (window.innerWidth < 600) setShowStickers(false); // Auto-close drawer on mobile
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
            {/* Props Toggle (Mobile) */}
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
            <Button onClick={postIt} className="text-white bg-[#1da1f2] border-blue-800"><Share size={14}/> POST IT</Button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            
            {/* --- LEFT SIDEBAR (TOOLS) --- */}
            {/* Always visible slim bar */}
            <div className="w-20 bg-[#c0c0c0] border-r-2 border-white flex flex-col items-center py-2 gap-2 shadow-xl z-30 shrink-0">
                <Button onClick={addText} className="w-16 h-12 flex-col gap-1"><Type size={16}/> <span className="text-[9px]">TEXT IT</span></Button>
                <Button onClick={()=>fileInputRef.current.click()} className="w-16 h-12 flex-col gap-1"><Upload size={16}/> <span className="text-[9px]">ADD IT</span><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} /></Button>
                <Button active={tool==='brush'} onClick={()=>setTool(t => t==='brush'?'move':'brush')} className="w-16 h-12 flex-col gap-1"><Paintbrush size={16}/> <span className="text-[9px]">DRAW IT</span></Button>
                
                <div className="w-10 h-px bg-gray-500 border-b border-white my-1"></div>
                
                {/* Stickers Toggle (Mobile) or List (Desktop) */}
                <div className="flex-1 w-full flex flex-col items-center overflow-hidden">
                    <div className="md:hidden w-full px-1">
                        <Button onClick={() => setShowStickers(!showStickers)} active={showStickers} className="w-full h-8 mb-2"><ImageIcon size={14}/> STICKERS</Button>
                    </div>
                    
                    {/* Sticker List */}
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
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    />
                </div>
            </div>

            {/* --- RIGHT PROPERTIES (CONTEXTUAL) --- */}
            {/* Sliding Panel on Mobile / Fixed on Desktop */}
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
                                        <label className="text-[9px] font-bold">FONT</label>
                                        <div className="grid grid-cols-2 gap-1">{FONTS.map(f => (<Button key={f.name} active={el.font === f.val} onClick={() => updateElement(el.id, ()=>({font: f.val}))} className="truncate text-[9px]">{f.name}</Button>))}</div>
                                    </div>
                                </>
                            )}
                            {(el.type === 'text' || el.type === 'path') && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-[9px] font-bold">COLOR</label>
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
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => { audioRef.current = new Audio(); return () => { if(audioRef.current) audioRef.current.pause(); }; }, []);
  useEffect(() => { if (!audioRef.current) return; audioRef.current.src = TUNES_PLAYLIST[track].file; audioRef.current.load(); if (playing) audioRef.current.play().catch(()=>{}); }, [track]);
  useEffect(() => { if (!audioRef.current) return; playing ? audioRef.current.play().catch(()=>{}) : audioRef.current.pause(); }, [playing]);
  useEffect(() => { if (audioRef.current) audioRef.current.onended = () => setPlaying(false); }, []);

  return (
    <div className="bg-[#29293d] h-full text-[#00ff00] font-mono p-2 flex flex-col">
      <div className="h-24 bg-black border-2 border-gray-600 mb-2 flex items-center justify-center">
         <div className="flex items-end gap-1 h-16">{new Array(10).fill(0).map((_,i) => <div key={i} className={`w-3 bg-green-500 ${playing ? 'animate-pulse' : ''}`} style={{height: `${Math.random()*100}%`}}></div>)}</div>
      </div>
      <div className="bg-black border border-gray-600 p-2 mb-2 text-xs text-yellow-400 font-bold truncate">{TUNES_PLAYLIST[track].title}</div>
      <div className="flex justify-between items-center mb-4 px-4">
        <button onClick={() => setTrack(Math.max(0, track-1))}><SkipBack size={32} className="text-white active:scale-90"/></button>
        <button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={48} className="text-white active:scale-90"/> : <Play size={48} className="text-white active:scale-90"/>}</button>
        <button onClick={() => setTrack(Math.min(TUNES_PLAYLIST.length-1, track+1))}><SkipForward size={32} className="text-white active:scale-90"/></button>
      </div>
      <div className="flex-1 bg-white text-black overflow-y-auto border border-gray-600 font-sans text-xs">
        {TUNES_PLAYLIST.map((t, i) => (
          <div key={i} className={`px-2 py-2 cursor-pointer border-b flex justify-between ${track === i ? 'bg-blue-800 text-white' : ''}`} onClick={() => { setTrack(i); setPlaying(true); }}>
            <span>{i+1}. {t.title}</span><span>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RugSweeperApp = () => {
  const [grid, setGrid] = useState(Array(81).fill(0));
  const [revealed, setRevealed] = useState(Array(81).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const init = () => {
    const g = Array(81).fill(0);
    for(let i=0; i<10; i++) { let idx; do { idx = Math.floor(Math.random() * 81); } while(g[idx]===1); g[idx] = 1; }
    setGrid(g); setRevealed(Array(81).fill(false)); setGameOver(false);
  };
  useEffect(init, []);
  const click = (i) => {
    if(gameOver || revealed[i]) return;
    const r = [...revealed]; r[i] = true; setRevealed(r);
    if(grid[i]===1) { setGameOver(true); setRevealed(Array(81).fill(true)); }
  };
  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2 items-center">
      <div className="bg-black text-red-500 font-mono text-xl p-2 mb-2 border-4 border-gray-400 w-full text-center">{gameOver ? "RUGGED!" : "FIND GEMS"}</div>
      <div className="grid grid-cols-9 gap-[1px] bg-gray-500 border-4 border-gray-400">
        {grid.map((c, i) => (
          <div key={i} onClick={() => click(i)} className={`w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer border-2 ${revealed[i] ? 'bg-[#c0c0c0] border-gray-400' : 'bg-[#d4d0c8] border-t-white border-l-white border-b-gray-600 border-r-gray-600'}`}>
            {revealed[i] ? (c === 1 ? <Skull size={16} className="text-black"/> : <span className="text-blue-700">1</span>) : ""}
          </div>
        ))}
      </div>
      <Button className="mt-4 w-full h-12" onClick={init}>RESTART</Button>
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

// --- MAIN OS MANAGER ---
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
    const titles = { paint: 'Paint IT', terminal: 'Terminal IT', tunes: 'Tune IT', rugsweeper: 'Play IT', notepad: 'Write IT', memes: 'Memes' };
    
    // RESPONSIVE SIZING FOR MOBILE
    const isMobile = window.innerWidth < 768;
    const defaultW = type==='paint' || type==='memes' ? 640 : 400;
    const defaultH = type==='paint' || type==='memes' ? 480 : 400;

    const newWin = { 
      id, type, title: titles[type] || 'App', 
      // Center on mobile or cascade on desktop
      x: isMobile ? 10 : 50 + (windows.length * 20), 
      y: isMobile ? 20 : 50 + (windows.length * 20), 
      // Fit to screen on mobile
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
      // Prevent dragging off screen totally
      const safeX = Math.max(-100, Math.min(window.innerWidth - 50, x));
      const safeY = Math.max(0, Math.min(window.innerHeight - 50, y));
      setWindows(prev => prev.map(w => w.id === id ? { ...w, x: safeX, y: safeY } : w));
  };

  const handleTaskbarClick = (id) => {
    const win = windows.find(w => w.id === id);
    if (win.isMinimized) {
      restoreWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
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
    document.addEventListener('touchstart', handleClickOutside); // Added touch listener
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

      {/* Desktop Icons - SWITCHED TO onClick for Single Tap (Mobile/Desktop friendly) */}
      <div className="absolute top-0 left-0 p-4 z-0 flex flex-col gap-4 flex-wrap max-h-full">
        <DesktopIcon icon={Terminal} label="Terminal IT" onClick={() => openApp('terminal')} />
        <DesktopIcon icon={Paintbrush} label="Paint IT" onClick={() => openApp('paint')} />
        <DesktopIcon icon={Music} label="Tune IT" onClick={() => openApp('tunes')} />
        <DesktopIcon icon={Gamepad2} label="Play IT" onClick={() => openApp('rugsweeper')} />
        <DesktopIcon icon={FileText} label="Write IT" onClick={() => openApp('notepad')} />
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
          {win.type === 'notepad' && <div className="h-full flex flex-col"><textarea className="flex-1 resize-none p-2 font-mono text-sm outline-none" placeholder="Write manifesto..." /></div>}
          {win.type === 'memes' && <MemesApp />}
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

// Helpers
const DesktopIcon = ({ icon: Icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-1 w-20 cursor-pointer p-1 border border-transparent hover:border-white/20 hover:bg-white/10 rounded active:opacity-70 group active:bg-white/20">
    <Icon size={32} className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" strokeWidth={1.5} />
    <span className="text-white text-xs text-center font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] bg-teal-800/80 px-1 rounded">{label}</span>
  </div>
);

const DraggableWindow = ({ win, isActive, children, onFocus, onClose, onMaximize, onMinimize, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDrag = (clientX, clientY) => {
    if (win.isMaximized) return;
    onFocus();
    // Locate the container (parent of the header)
    const element = document.getElementById(`win-${win.id}`);
    if(!element) return;
    const rect = element.getBoundingClientRect();
    setIsDragging(true); 
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.overflow-auto') || e.target.closest('button')) return;
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.overflow-auto') || e.target.closest('button')) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => { 
      if (!isDragging || win.isMaximized) return; 
      onMove(win.id, e.clientX - offset.x, e.clientY - offset.y); 
    };
    const handleTouchMove = (e) => {
      if (!isDragging || win.isMaximized) return;
      // Prevent scrolling body while dragging window
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