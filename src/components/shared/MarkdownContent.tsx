
import React from 'react';
import { marked } from 'marked';

interface MarkdownContentProps {
  content: string;
  styling?: {
    h1Color?: string;
    h2Color?: string;
  };
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, styling }) => {
  // Convertir le Markdown en HTML
  const getHtmlContent = () => {
    return { __html: marked.parse(content) };
  };

  return (
    <div 
      className="markdown-content prose max-w-none prose-headings:font-playfair"
      style={{
        '--h1-color': styling?.h1Color || 'inherit',
        '--h2-color': styling?.h2Color || 'inherit',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={getHtmlContent()} 
    />
  );
};

export default MarkdownContent;
