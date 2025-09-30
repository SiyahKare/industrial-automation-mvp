import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Analytics',
};

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return children;
}


