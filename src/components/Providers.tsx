"use client";

import { ReactNode } from 'react';
import { RFQProvider } from '@/context/RFQContext';
import RFQBasket from './RFQBasket';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <RFQProvider>
      {children}
      <RFQBasket />
    </RFQProvider>
  );
}


