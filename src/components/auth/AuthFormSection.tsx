import type { ReactNode } from 'react';

type AuthFormSectionProps = {
  children: ReactNode;
  title: string;
};

export default function AuthFormSection({ children, title }: AuthFormSectionProps) {
  return (
    <section>
      <div className="mb-5 border-b border-app-borderSoft pb-3">
        <h2 className="font-bold text-app-textStrong">{title}</h2>
      </div>
      {children}
    </section>
  );
}
