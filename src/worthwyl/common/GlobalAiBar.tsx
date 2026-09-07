import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, Sparkles, ChevronUp, ChevronDown, 
  X, Volume2, VolumeX, Wand2, Brain, Bot, CornerDownLeft, 
  ArrowRight, RefreshCw, Radio
} from 'lucide-react';
import { Metrics, CognitiveAtom } from '../../types/creativeOs';
import { ActiveView } from '../../App';
import { EpisodicMemoryStore } from '../story/EpisodicMemoryStore';
import { ContinuityTracker } from '../story/ContinuityTracker';

interface Props {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  metrics: Metrics;
  onAtomInjected?: (atom: CognitiveAtom) => void;
  onTriggerWriteEpisode?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  action?: {
    type: 'NAVIGATE' | 'TRIGGER_EPISODE' | 'INJECT_ATOM';
    target?: string;
    label?: string;
  };
}

export default function GlobalAiBar({
  activeView,
  onNavigate,
  metrics,
  onAtomInjected,
  onTriggerWriteEpisode
}: Props) {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hey! I'm your Cranium Core AI co-pilot. You can talk to me with the mic or type anything below. Ask me to write the next episode, explain canon, or direct the scene.",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition not available:', e);
      setSpeechSupported(false);
    }
  }, []);

  // Auto-scroll chat messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice toggle (Microphone)
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert("Speech recognition isn't supported in this browser window. You can type directly in the bar!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition start failed:', e);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech (SpeechSynthesis)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    }

    setInput('');
    setIsOpen(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Collect runtime context
    const novels = EpisodicMemoryStore.getNovels();
    const currentNovel = novels[0];
    const snapshots = currentNovel ? EpisodicMemoryStore.getSnapshotsForNovel(currentNovel.id) : [];
    const continuity = ContinuityTracker.buildState(snapshots);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          context: {
            activeView,
            currentNovelTitle: currentNovel?.title,
            activeCharacters: Object.keys(continuity.characters),
            openThreads: continuity.openThreads,
            coherence: metrics.coherence,
            tension: metrics.tension
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: data.reply || "Understood! Cranium Core is synchronized.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: data.action
        };

        setMessages(prev => [...prev, assistantMessage]);

        // If TTS is enabled, read aloud
        if (ttsEnabled) {
          speakText(assistantMessage.text);
        }
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      const fallbackMessage: Message = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: `Got it! Cranium Core is holding coherence steady at ${(metrics.coherence * 100).toFixed(0)}%. What narrative beat or system component would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<Message['action']>) => {
    if (action.type === 'NAVIGATE' && action.target) {
      onNavigate(action.target as ActiveView);
    } else if (action.type === 'TRIGGER_EPISODE') {
      if (onTriggerWriteEpisode) {
        onTriggerWriteEpisode();
      } else {
        onNavigate('studio');
      }
    } else if (action.type === 'INJECT_ATOM') {
      if (onAtomInjected) {
        onAtomInjected({
          id: `atom-chat-${Date.now()}`,
          charge: 0.6,
          mass: 5.0,
          velocity: 0.5,
          tags: ['dialogue', 'chat-direction'],
          kind: 'theme',
          label: action.label || 'Spontaneous Chat Directive'
        });
      }
    }
  };

  const quickPrompts = [
    { label: "⚡ Write next episode", query: "Write the next episode of the serial right now under current canon." },
    { label: "🛡️ Audit canon continuity", query: "Audit our current novel's canon continuity and character arcs." },
    { label: "🔬 Show resonance field", query: "Take me to the resonance lab to inspect field tension and cognitive atoms." },
    { label: "🎬 Acquisition demo", query: "Show me the acquisition demo comparing Cranium Core to Naive RAG." }
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none p-3 md:p-4">
      <div className="max-w-4xl mx-auto pointer-events-auto space-y-2">
        
        {/* Expandable Conversation Drawer */}
        {isOpen && (
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[380px] md:h-[440px] animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Drawer Header */}
            <div className="px-4 py-3 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold tracking-tight text-white">CRANIUM CORE AI</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-neutral-400">ONLINE // GEMINI 2.5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                {/* TTS Toggle */}
                <button
                  onClick={() => {
                    const next = !ttsEnabled;
                    setTtsEnabled(next);
                    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  title={ttsEnabled ? "Disable Read Aloud" : "Enable Read Aloud"}
                  className={`p-1.5 rounded-lg transition ${
                    ttsEnabled ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close/Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                    <span>{m.role === 'user' ? 'YOU' : 'CRANIUM CORE'}</span>
                    <span>&bull;</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-sm ${
                      m.role === 'user'
                        ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-sm shadow-md'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-tl-sm shadow-inner'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Action pill if model suggested one */}
                    {m.action && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-amber-400">
                          Suggested Action:
                        </span>
                        <button
                          onClick={() => handleActionClick(m.action!)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1"
                        >
                          <span>{m.action.label || 'Execute'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Cranium Core is synthesizing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick action chips inside open drawer */}
            <div className="p-2 px-3 bg-neutral-950/60 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-[10px] font-mono text-neutral-500 shrink-0">QUICK:</span>
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp.query)}
                  className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition whitespace-nowrap shrink-0 border border-neutral-700/60"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating Capsule Bar (Always Visible at Bottom) */}
        <div className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 p-2 md:p-2.5 rounded-2xl shadow-2xl ring-1 ring-white/10 flex items-center gap-2">
          {/* AI Status / Expand Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-white transition text-xs font-semibold shrink-0"
            title={isOpen ? "Minimize AI Drawer" : "Expand Conversation"}
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="hidden sm:inline font-mono">CRANIUM AI</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isListening ? "Listening to your voice... speak now" : "Talk or type to Cranium Core (e.g. 'Write next scene', 'What is canon?')..."}
              className={`w-full bg-neutral-950 border ${
                isListening ? 'border-red-500/80 ring-2 ring-red-500/20' : 'border-neutral-800 focus:border-amber-500'
              } text-white placeholder:text-neutral-500 text-xs md:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none transition pr-8`}
            />

            {input && (
              <button
                onClick={() => setInput('')}
                className="absolute right-2.5 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Input Microphone Button */}
          <button
            onClick={toggleListening}
            title={isListening ? "Stop listening" : "Talk to Cranium Core"}
            className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30'
                : 'bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 text-neutral-300 hover:text-amber-400'
            }`}
          >
            {isListening ? (
              <Radio className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() && !isListening}
            className="p-2.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 font-bold transition flex items-center justify-center shrink-0 shadow-md shadow-amber-500/10"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
