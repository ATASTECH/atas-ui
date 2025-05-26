import { type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';
import { siteConfig } from '@/config/site';
import { Github } from 'lucide-react';

const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  links: [
      {
        text: "UI Components",
        url: "/docs/ui",
      },
      {
        text: "Hooks",
        url: "/docs/hooks",
      },
      {
        text: "Showcase",
        url: "/showcase",
      },
      {
        type: "icon",
        url: siteConfig.links.github,
        text: "Github",
        icon: <Github className="size-4" aria-hidden="true" />,
        external: true,
      },
    ],
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = source.getNodeMeta(node);
        if (!meta || !node.icon) return option;

        const color = `var(--${meta.file.dirname}-color, var(--color-fd-foreground))`;

        return {
          ...option,
          icon: (
            <div
              className="rounded-lg p-1.5 shadow-lg ring-2 m-px border [&_svg]:size-6.5 md:[&_svg]:size-5"
              style={
                {
                  color,
                  borderColor: `color-mix(in oklab, ${color} 50%, transparent)`,
                  '--tw-ring-color': `color-mix(in oklab, ${color} 20%, transparent)`,
                } as object
              }
            >
              {node.icon}
            </div>
          ),
        };
      },
    },
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout {...docsOptions}>{children}</DocsLayout>;
}