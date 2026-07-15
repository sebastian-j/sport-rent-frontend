import type { ReactNode } from 'react';
import ContentPanel from './ContentPanel.tsx';

type InfoPanelProps = {
  children?: ReactNode;
};

export default function InfoPanel({ children }: InfoPanelProps) {
  return (
    <ContentPanel className="mx-auto w-full max-w-7xl items-stretch rounded-2xl border-app-borderSoft bg-app-surface p-6 shadow-sm sm:p-8 lg:p-10 [&_article]:w-full [&_article]:text-base [&_article]:leading-7 [&_article>header]:mb-10 [&_article>header]:max-w-4xl [&_article>header>h1]:text-3xl [&_article>header>h1]:font-bold [&_article>header>h1]:tracking-tight sm:[&_article>header>h1]:text-4xl lg:[&_article>header>h1]:text-5xl [&_article>header>p]:mt-3 [&_article>header>p]:text-lg [&_article>header>p]:text-app-textMuted [&_article>section]:space-y-4 [&_article>section+section]:mt-10 [&_article_a]:font-medium [&_article_a]:underline [&_article_a]:underline-offset-4 [&_article_h2]:text-2xl [&_article_h2]:font-semibold [&_article_h2]:tracking-tight sm:[&_article_h2]:text-3xl [&_article_h3]:text-xl [&_article_h3]:font-semibold [&_article_li]:pl-1 [&_article_ol]:ml-6 [&_article_ol]:list-decimal [&_article_ol]:space-y-2 [&_article_p]:max-w-4xl [&_article_ul]:ml-6 [&_article_ul]:list-disc [&_article_ul]:space-y-2">
      {children}
    </ContentPanel>
  );
}
