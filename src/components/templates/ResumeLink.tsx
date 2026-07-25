import React from 'react';

const toHref = (value: string) => {
  if (value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('http://') || value.startsWith('https://')) return value;
  return value.includes('@') ? `mailto:${value}` : `https://${value}`;
};

interface ResumeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

// Chromium retains real anchors as clickable destinations in generated PDFs.
export const ResumeLink: React.FC<ResumeLinkProps> = ({ href, children, ...props }) => (
  <a href={toHref(href)} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
);
