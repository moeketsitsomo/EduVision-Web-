'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components, ExtraProps } from 'react-markdown';

type ElementProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] & ExtraProps;

const H1 = ({ children, ...props }: ElementProps<'h1'>) => (
  <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>
);

const H2 = ({ children, ...props }: ElementProps<'h2'>) => (
  <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>{children}</h2>
);

const H3 = ({ children, ...props }: ElementProps<'h3'>) => (
  <h3 className="text-xl font-semibold mt-4 mb-2" {...props}>{children}</h3>
);

const P = ({ children, ...props }: ElementProps<'p'>) => (
  <p className="mb-4 leading-relaxed" {...props}>{children}</p>
);

const Ul = ({ children, ...props }: ElementProps<'ul'>) => (
  <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>
);

const Ol = ({ children, ...props }: ElementProps<'ol'>) => (
  <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>
);

const Li = ({ children, ...props }: ElementProps<'li'>) => (
  <li className="mb-1" {...props}>{children}</li>
);

const A = ({ children, ...props }: ElementProps<'a'>) => (
  <a className="text-primary underline" {...props}>{children}</a>
);

const Img = ({ src, alt, ...props }: ElementProps<'img'>) => (
  <img src={src || ''} alt={alt || ''} loading="lazy" className="rounded-lg max-w-full my-4" {...props} />
);

const components: Components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  a: A,
  img: Img,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
