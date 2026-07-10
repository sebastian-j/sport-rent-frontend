import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ContentPanel from '../components/core/ContentPanel.tsx';

export default function DocumentLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <ContentPanel className="items-stretch rounded-lg p-6 shadow-sm sm:p-10 lg:p-14 [&_article]:w-full [&_article]:text-base [&_article]:leading-7 [&_article>header]:mb-10 [&_article>header]:border-b-2 [&_article>header]:pb-6 [&_article>header>h1]:text-3xl [&_article>header>h1]:font-bold sm:[&_article>header>h1]:text-4xl [&_article>header>p:first-child]:mb-2 [&_article>header>p:first-child]:text-sm [&_article>header>p:first-child]:font-semibold [&_article>header>p:first-child]:uppercase [&_article>header>p:last-child]:mt-3 [&_article>header>p:last-child]:text-sm [&_article>section]:space-y-4 [&_article>section]:border-t [&_article>section]:pt-8 [&_article>section+section]:mt-8 [&_article_a]:break-all [&_article_a]:font-medium [&_article_a]:underline [&_article_a]:underline-offset-4 [&_article_h2]:text-xl [&_article_h2]:font-semibold sm:[&_article_h2]:text-2xl [&_article_li]:pl-2 [&_article_ol]:ml-6 [&_article_ol]:list-decimal [&_article_ol]:space-y-3 [&_article_p]:max-w-none [&_article_ul]:ml-6 [&_article_ul]:list-disc [&_article_ul]:space-y-3">
          <Outlet />
        </ContentPanel>
      </main>
    </div>
  );
}
