"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface RFQItem {
  id: string;
  material: string;
  form: string;
  specification: string;
  quantity: string;
  notes?: string;
  addedAt: Date;
}

export interface RFQSession {
  id: string;
  items: RFQItem[];
  status: 'draft' | 'submitted' | 'quoted' | 'ordered';
  contactEmail?: string;
  designFiles?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RFQContextType {
  session: RFQSession;
  addItem: (item: Omit<RFQItem, 'id' | 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<RFQItem>) => void;
  clearBasket: () => void;
  submitRFQ: (email: string) => Promise<boolean>;
  itemCount: number;
  isBasketOpen: boolean;
  setBasketOpen: (open: boolean) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createNewSession = (): RFQSession => ({
  id: generateId(),
  items: [],
  status: 'draft',
  createdAt: new Date(),
  updatedAt: new Date(),
});

const RFQContext = createContext<RFQContextType | undefined>(undefined);

export const RFQProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<RFQSession>(createNewSession());
  const [isBasketOpen, setBasketOpen] = useState(false);

  const addItem = useCallback((item: Omit<RFQItem, 'id' | 'addedAt'>) => {
    const newItem: RFQItem = {
      ...item,
      id: generateId(),
      addedAt: new Date(),
    };
    setSession(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      updatedAt: new Date(),
    }));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setSession(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      updatedAt: new Date(),
    }));
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<RFQItem>) => {
    setSession(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const clearBasket = useCallback(() => {
    setSession(createNewSession());
  }, []);

  const submitRFQ = useCallback(async (email: string): Promise<boolean> => {
    try {
      // This will be connected to the backend
      const response = await fetch('/api/rfq/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          contactEmail: email,
        }),
      });

      if (response.ok) {
        setSession(prev => ({
          ...prev,
          status: 'submitted',
          contactEmail: email,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to submit RFQ:', error);
      return false;
    }
  }, [session]);

  return (
    <RFQContext.Provider value={{
      session,
      addItem,
      removeItem,
      updateItem,
      clearBasket,
      submitRFQ,
      itemCount: session.items.length,
      isBasketOpen,
      setBasketOpen,
    }}>
      {children}
    </RFQContext.Provider>
  );
};

export const useRFQ = () => {
  const context = useContext(RFQContext);
  if (context === undefined) {
    throw new Error('useRFQ must be used within a RFQProvider');
  }
  return context;
};


