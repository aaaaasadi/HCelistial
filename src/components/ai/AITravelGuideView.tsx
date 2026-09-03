import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  User,
  Activity,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { MockAIService } from '../../services/mockAIService';
import { StatusBadge } from '../common/StatusBadge';
import { AIAction, ChatMessageData } from '../../types';

export const AITravelGuideView: React.FC = () => {
  const {
    currentTrip,
    journeyHealth,
    journeyStatus,
    aiContext,
    recoveryPlans,
    executeAIAction,
    setCurrentTab
  } = useDemo();

  const isDisrupted = journeyStatus === 'DISRUPTED';
  const isRecovered = journeyStatus === 'RECOVERED';
  const isAtRisk = journeyStatus === 'AT_RISK';

  const [messages, setMessages] = useState<ChatMessageData[]>(() =>
    MockAIService.getInitialMessages(aiContext)
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-sync initial AI message whenever the journey status changes
  useEffect(() => {
    setMessages(MockAIService.getInitialMessages(aiContext));
  }, [journeyStatus, aiContext.trip.id, aiContext.trip.status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Contextual quick questions tailored to the active journey state
  const contextualQuestions = useMemo(() => {
    if (journeyStatus === 'ON_TRACK') {
      return [
        'Is my journey on track?',
        "What's my next connection?",
        'Are there any risks?'
      ];
    } else if (journeyStatus === 'AT_RISK') {
      return [
        'Will I make my connection?',
        'How risky is my journey?',
        'What should I do?'
      ];
    } else if (journeyStatus === 'DISRUPTED') {
      return [
        'What happened?',
        'What are my recovery options?',
        'Which option is best?',
        'Can I avoid flights?',
        'How much extra will I pay?'
      ];
    } else if (journeyStatus === 'RECOVERED') {
      return [
        'Is my new journey safe?',
        "What's my next segment?",
        'Is my hotel still preserved?'
      ];
    }
    return [
      'What happened?',
      "What's my best option?",
      "What's the cheapest option?",
      'Can I avoid flights?'
    ];
  }, [journeyStatus]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setErrorNotice(null);
    const userMsg: ChatMessageData = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await MockAIService.answerQuestion(query, aiContext);
      setMessages((prev) => [...prev, response]);

      // If response includes an automatic preference update action, execute it in background
      const prefAction = response.actions?.find((a) => a.type === 'UPDATE_PREFERENCE');
      if (prefAction) {
        executeAIAction(prefAction);
      }
    } catch (err) {
      console.error('AI Service Error:', err);
      setErrorNotice('Travel Guide is temporarily unavailable.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: AIAction) => {
    executeAIAction(action);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-glow-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-text-primary">
                AI TRAVEL GUIDE
              </h1>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-primary/20 text-primary-light border border-primary/30">
                JOURNEY-AWARE
              </span>
            </div>
            <p className="text-xs text-text-muted font-mono mt-0.5">
              "Your journey-aware travel assistant" • Deterministic Multi-Engine Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-surface-lowest border border-border text-emerald-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI ENGINE ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Real-time Journey Context Banner */}
      <div className="p-4 rounded-xl bg-surface-container border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-text-muted uppercase">Active Route:</span>
          <span className="font-bold text-text-primary">
            {currentTrip.origin} → {currentTrip.destination}
          </span>
          <span className="text-text-muted">({currentTrip.title})</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Health:</span>
            <span
              className={`font-bold ${
                journeyHealth >= 90
                  ? 'text-emerald-400'
                  : journeyHealth >= 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {journeyHealth}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Status:</span>
            <StatusBadge
              status={
                isRecovered
                  ? 'RECOVERED'
                  : isDisrupted
                  ? 'DELAYED'
                  : isAtRisk
                  ? 'AT_RISK'
                  : 'ON_TIME'
              }
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Error Fallback Banner if any */}
      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-xs font-mono text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('journey')}
              className="px-2.5 py-1 rounded bg-surface-lowest text-[11px] hover:bg-surface-high border border-border"
            >
              View Journey
            </button>
            <button
              onClick={() => setCurrentTab('recovery')}
              className="px-2.5 py-1 rounded bg-surface-lowest text-[11px] hover:bg-surface-high border border-border"
            >
              View Recovery Options
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="h-[490px] flex flex-col rounded-2xl bg-surface-container/70 border border-border overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-surface-high border border-primary/40 text-primary'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none font-medium'
                    : 'bg-surface-lowest border border-border-strong text-text-primary rounded-tl-none font-sans'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Structured Breakdown if present */}
                {msg.structuredBreakdown && (
                  <div className="p-3 rounded-xl bg-surface-high/40 border border-border/40 font-mono text-xs space-y-1.5">
                    {msg.structuredBreakdown.answer && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-primary font-bold uppercase text-[10px] w-20 flex-shrink-0">
                          ANSWER:
                        </span>
                        <span className="text-text-primary font-medium">{msg.structuredBreakdown.answer}</span>
                      </div>
                    )}
                    {msg.structuredBreakdown.why && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-text-muted uppercase text-[10px] w-20 flex-shrink-0">
                          WHY:
                        </span>
                        <span className="text-text-secondary">{msg.structuredBreakdown.why}</span>
                      </div>
                    )}
                    {msg.structuredBreakdown.options && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-text-muted uppercase text-[10px] w-20 flex-shrink-0">
                          OPTIONS:
                        </span>
                        <span className="text-text-secondary">{msg.structuredBreakdown.options}</span>
                      </div>
                    )}
                    {msg.structuredBreakdown.recommendation && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold uppercase text-[10px] w-20 flex-shrink-0">
                          RECOMMENDED:
                        </span>
                        <span className="text-emerald-300 font-bold">{msg.structuredBreakdown.recommendation}</span>
                      </div>
                    )}
                    {msg.structuredBreakdown.tradeoffs && (
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-400 uppercase text-[10px] w-20 flex-shrink-0">
                          TRADEOFF:
                        </span>
                        <span className="text-amber-300/90">{msg.structuredBreakdown.tradeoffs}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="pt-2 border-t border-border/50 flex flex-wrap gap-2">
                    {msg.actions.map((action: AIAction, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(action)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary-light font-mono text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>{action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer: Verified Source & Timestamp */}
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-text-muted">
                  <div className="flex items-center gap-1.5">
                    {msg.sender === 'ai' && (
                      <span className="flex items-center gap-1 text-emerald-400/80">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Grounded in Verified Facts</span>
                      </span>
                    )}
                  </div>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-surface-high border border-primary/40 flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-lowest border border-border text-text-muted text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>Analyzing your journey...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Contextual Quick Questions Chips */}
        <div className="p-3 border-t border-border/60 bg-surface-high/30">
          <div className="text-[10px] font-mono text-text-muted uppercase mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Contextual Questions ({journeyStatus}):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contextualQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-lg bg-surface-lowest hover:bg-surface-high border border-border text-[11px] text-text-secondary hover:text-text-primary font-mono transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-border bg-surface-high/60 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about connections, alternatives, flight rules, or budget..."
            className="flex-1 bg-surface-lowest border border-border-strong rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted font-sans focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-bold font-display flex items-center gap-1.5 transition-all shadow-glow-primary"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
