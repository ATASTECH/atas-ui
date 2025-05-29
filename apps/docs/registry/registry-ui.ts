import type { Registry } from "@/registry/schema";

export const ui: Registry = [
  {
    name: "smooth-cursor",
    type: "registry:ui",
    dependencies: ["@motion/react"],
    files: [
      {
        path: "ui/smooth-cursor.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["https://ui.atastech.com/r/button"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
    ],
  },
];
