import { createElement } from "react";
import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { icons } from "lucide-react";
import { ImFire } from "react-icons/im";
import { Badge } from "@/components/ui/badge";

export const source = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
  icon(icon) {
    if (!icon) {
      // You may set a default icon
      return;
    }

    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
  pageTree: {
    attachFile(node, file) {
      const flags = file?.data.data as { new?: boolean; hot?: boolean };
      let badgeLabel: string | null = null;
      if (flags?.new) badgeLabel = "New";
      else if (flags?.hot) badgeLabel = "Hot";

      const additionalElement = badgeLabel
        ? createElement(
            Badge,
            {
              className: `ml-auto font-base text-xs ${
                badgeLabel === "Hot"
                  ? "text-red-500 flex items-center justify-center"
                  : badgeLabel === "New"
                  ? "bg-[#adfa1d] text-zinc-900"
                  : ""
              }`,
              variant: "default",
            },
            badgeLabel === "Hot" ? createElement(ImFire, { size: 18 }) : badgeLabel
          )
        : null;

      node.name = createElement(
        "span",
        { className: "flex w-full gap-2" },
        createElement("span", null, node.name),
        additionalElement
      );
      return node;
    },
  },
});
