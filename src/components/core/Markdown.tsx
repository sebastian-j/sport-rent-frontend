import ReactMarkdown, { type Components, type Options } from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MARKDOWN_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="mb-4 mt-8 text-4xl font-bold first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 mt-6 text-3xl font-semibold first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-5 text-2xl font-semibold first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-4 text-xl font-semibold first:mt-0">{children}</h4>,
  h5: ({ children }) => <h5 className="mb-2 mt-4 text-lg font-semibold first:mt-0">{children}</h5>,
  h6: ({ children }) => (
    <h6 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h6>
  ),
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  u: ({ children }) => <u>{children}</u>,
};

type MarkdownProps = Options;

export default function Markdown({ components, rehypePlugins = [], ...props }: MarkdownProps) {
  return (
    <ReactMarkdown
      {...props}
      components={{ ...MARKDOWN_COMPONENTS, ...components }}
      rehypePlugins={[rehypeRaw, ...(rehypePlugins ?? [])]}
    />
  );
}
