import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Github } from "lucide-react";
import { source } from "@/lib/source";
import { siteConfig } from "./site";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width={42} height={42}>
          <path
            d="M 527 243 L 405 244 L 172 748 L 259 748 L 514 577 L 485 518 L 353 592 L 465 352 L 556 543 L 641 487 Z"
            fill="currentColor"
          />
          <path
            d="M 797 521 L 666 521 L 405 689 L 538 689 L 603 647 L 651 748 L 764 748 L 691 590 Z"
            fill="currentColor"
          />
        </svg>
        <span className="font-medium [.uwu_&]:hidden [header_&]:text-[15px]">
          {siteConfig.name}
        </span>
      </>
    ),
  },
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
};

export const docsOptions: DocsLayoutProps = {
  ...baseOptions,
  tree: source.pageTree,
  sidebar: {
    tabs: false,
    className: "[&_[data-radix-scroll-area-viewport]]:pt-[33px]"
  },
};
