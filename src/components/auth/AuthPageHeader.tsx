type AuthPageHeaderProps = {
  title: string;
};

export default function AuthPageHeader({ title }: AuthPageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-app-textStrong sm:text-4xl">{title}</h1>
    </header>
  );
}
