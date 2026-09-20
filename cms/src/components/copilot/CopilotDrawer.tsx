'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCopilot } from '../../context/CopilotContext';
import { ActionProposalCard } from './ActionProposalCard';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Shield,
  CornerDownLeft,
  Lightbulb,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function CopilotDrawer() {
  const { isOpen, closeDrawer, messages, isStreaming, sendMessage } = useCopilot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isStreaming]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#A3040F]/20 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="h-16 px-4 bg-[#A3040F] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFFDF8] text-[#A3040F] flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-[#A3040F]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-sans tracking-wide">
                  GEC Gemini Copilot
                </h3>
                <p className="text-[10px] font-mono text-[#FBCA05]">
                  GOVERNANCE-GATED ASSISTANT
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Governance Notice */}
          <div className="bg-[#F4E2CA]/60 px-4 py-2 border-b border-[#A3040F]/15 flex items-center gap-2 text-[11px] text-[#6E655F]">
            <Shield className="w-3.5 h-3.5 text-[#A3040F] shrink-0" />
            <span>Staff approval required for all mutations. Actions expire in 1 hr.</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    isUser ? 'items-end' : 'items-start'
                  )}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-[#6E655F]">
                    {isUser ? (
                      <>
                        <span>You</span>
                        <User className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <Bot className="w-3 h-3 text-[#A3040F]" />
                        <span>Copilot</span>
                      </>
                    )}
                  </div>

                  <div
                    className={cn(
                      'p-3 rounded-xl text-xs max-w-[90%] shadow-xs leading-relaxed',
                      isUser
                        ? 'bg-[#A3040F] text-white rounded-br-none'
                        : 'bg-[#FCF8ED] text-[#222222] border border-[#A3040F]/15 rounded-bl-none'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Render action proposal card if attached */}
                    {msg.proposal && (
                      <ActionProposalCard proposal={msg.proposal} />
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && (
              <div className="flex items-center gap-2 text-xs text-[#6E655F] italic p-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#A3040F] animate-ping" />
                Gemini is synthesizing proposal...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="px-3 py-2 border-t border-[#E2E8F0] bg-[#FCF8ED]/70">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-[#6E655F] mb-1.5">
              <Lightbulb className="w-3 h-3 text-[#FBCA05]" /> Quick Actions:
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickPrompt('Update Hero Spotlight headline to 48-hour deadline urgency')}
                className="px-2 py-1 rounded-md bg-white border border-[#CBD5E1] hover:border-[#A3040F] text-[#222222] truncate max-w-full cursor-pointer"
              >
                Hero Spotlight Urgency
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Generate Google Form plan for Ideathon 2026 pre-registration')}
                className="px-2 py-1 rounded-md bg-white border border-[#CBD5E1] hover:border-[#A3040F] text-[#222222] truncate max-w-full cursor-pointer"
              >
                Create Google Form Plan
              </button>
            </div>
          </div>

          {/* Message Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#E2E8F0] bg-white shrink-0">
            <div className="relative rounded-lg shadow-xs">
              <textarea
                rows={2}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Gemini to draft content, create forms, or propose updates..."
                className="w-full resize-none p-2.5 pr-10 text-xs border border-[#CBD5E1] rounded-lg focus:ring-1 focus:ring-[#A3040F] focus:border-[#A3040F] text-[#222222]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 bottom-2.5 p-1.5 rounded-md bg-[#A3040F] hover:bg-[#C62F29] text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#6E655F]">
              <span>Press Enter to send</span>
              <span>Gemini 1.5 Flash</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
