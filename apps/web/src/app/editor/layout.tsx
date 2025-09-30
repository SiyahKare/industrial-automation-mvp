import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pipeline Editor',
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}


