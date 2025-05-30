import type { Registry } from "@/registry/schema";

export const ui: Registry = [
  {
    name: "smooth-cursor",
    type: "registry:ui",
    dependencies: ["@motion/react"],
    registryDependencies: ["https://ui.atastech.com/r/smooth-cursor"],
    files: [
      {
        path: "ui/smooth-cursor.tsx",
        type: "registry:ui",
      },
    ],
  },
    {
    name: "stories",
    type: "registry:ui",
    dependencies: ["@motion/react"],
    registryDependencies: ["https://ui.atastech.com/r/stories"],
    files: [
      {
        path: "ui/stories.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["https://ui.atastech.com/r/toast"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
    ],
  },
];
