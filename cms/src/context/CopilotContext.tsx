'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CopilotMessage, CopilotActionProposal } from '../lib/types';
import { apiClient } from '../lib/api-client';

interface CopilotContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  messages: CopilotMessage[];
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  confirmProposal: (proposalId: string) => Promise<boolean>;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Preload initial copilot conversation
    setMessages([
      {
        id: 'msg-init',
        conversationId: 'conv-001',
        role: 'assistant',
        content: 'Hello! I am your GEC CMS Copilot powered by Gemini. You can ask me to draft editorial announcements, create validated Google Form plans, update hero spotlight campaigns, or formulate submission filters.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg-sample-prop',
        conversationId: 'conv-001',
        role: 'assistant',
        content: 'Here is a pending action proposal for the Hero Spotlight urgency transition:',
        timestamp: new Date().toISOString(),
        proposal: {
          id: 'prop-001',
          conversationId: 'conv-001',
          actionType: 'update_draft',
          targetId: 'hero-camp-001',
          targetVersion: 'v1.2',
          preview: {
            summary: 'Update Hero Spotlight status to Urgency and add 48-hour deadline badge',
            details: { target: 'Hero Spotlight Campaign #001', urgencyLevel: 'High' },
            diff: [
              { field: 'Status', before: 'Applications Open', after: 'Urgency / Deadline' },
              { field: 'Eyebrow / Badge', before: 'APPLICATIONS OPEN · COHORT 04', after: '48 HOURS LEFT · FINAL APPLICATION WINDOW' },
              { field: 'Supporting Text', before: 'Have a validated problem or prototype? Join northern India’s premier university incubation funnel with seed grants up to ₹5 Lakhs.', after: 'Final 48 hours to apply for Cohort 04. Applications close promptly at midnight.' },
            ],
          },
          status: 'proposed',
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          idempotencyKey: 'idem-hero-urgency-001',
        },
      }
    ]);
  }, []);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen(prev => !prev);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const tempUserMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      conversationId: 'conv-001',
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setIsStreaming(true);

    try {
      const reply = await apiClient.sendCopilotMessage(content);
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      console.error('Failed to send copilot message:', err);
    } finally {
      setIsStreaming(false);
    }
  };

  const confirmProposal = async (proposalId: string): Promise<boolean> => {
    try {
      const res = await apiClient.confirmCopilotProposal(proposalId);
      if (res.success) {
        setMessages(prev =>
          prev.map(msg => {
            if (msg.proposal && msg.proposal.id === proposalId) {
              return {
                ...msg,
                proposal: {
                  ...msg.proposal,
                  status: 'succeeded',
                },
              };
            }
            return msg;
          })
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Proposal confirmation failed:', err);
      return false;
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        messages,
        isStreaming,
        sendMessage,
        confirmProposal,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const ctx = useContext(CopilotContext);
  if (!ctx) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return ctx;
}
