"use client";

import * as React from "react";
import { Index } from "@/__registry__";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

import { cn } from "@/lib/utils";
import { useConfig } from "@/hooks/use-config";
import { styles } from "@/registry/registry-styles";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ComponentTabsProps extends React.ComponentPropsWithoutRef<"div"> {
  name: string;
  children: React.ReactNode;
  preventPreviewFocus?: boolean;
  scalePreview?: boolean;
  fullPreview?: boolean;
}

export function ComponentTabs({
  name,
  children,
  preventPreviewFocus,
  scalePreview,
  fullPreview,
  className,
}: ComponentTabsProps) {
  const [config] = useConfig();
  const index = styles.findIndex((style) => style.name === config.style);

  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[index];

  const [key, setKey] = React.useState(0);

  const Preview = React.useMemo(() => {
    const Component = Index[config.style][name]?.component;

    if (!Component) {
      return (
        <p className="text-muted-foreground text-sm">
          Component{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component />;
  }, [name, config.style]);

  return (
    <Tabs items={["Preview", "Code"]} className="bg-background rounded-md">
      <Tab
        value="Preview"
        className={cn("preview-block", {
          "focus-visible:ring-0 focus-visible:outline-hidden":
            preventPreviewFocus,
        })}
        tabIndex={preventPreviewFocus ? -1 : 0}
      >
        <div
          className={cn(
            "max-w-screen relative rounded-xl border bg-background",
            className
          )}
        >
          <div className="flex items-center justify-end gap-2 p-2">
            <OpenInV0Button url={`https://ui.atastech.com/r/${name}.json`} />
            <Button
              onClick={() => setKey((prev) => prev + 1)}
              className="flex items-center rounded-lg px-3 py-1"
              variant="ghost"
            >
              <RotateCcw aria-label="restart-btn" size={16} />
            </Button>
          </div>
          <div
            className={cn(
              "component-preview flex min-h-[350px] w-full items-center justify-center p-10",
              {
                "h-full p-0": fullPreview,
                "sm:p-10": scalePreview,
              }
            )}
            key={key}
          >
            {Preview}
          </div>
        </div>
      </Tab>
      <Tab value="Code" className="component-block py-0">
        {Code}
      </Tab>
    </Tabs>
  );
}
