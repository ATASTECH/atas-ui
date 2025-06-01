"use client";
import React from "react";
import StoriesDemo from "@/components/ui/stories-demo";
import { cn } from "@/lib/utils";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import UseAutoScrollDemo from "@/components/ui/auto-scroll-demo";

export default function ComponentDemos() {
  const components = [StoriesDemo, UseAutoScrollDemo];
  const [keys, setKeys] = React.useState(() => components.map(() => 0));
  const words = ["Components", "Hooks"];

  return (
    <section id="component-demos" className="container max-w-5xl py-14">
      <h2 className="mb-2 text-center text-4xl md:text-7xl font-bold leading-[1.2] tracking-tighter text-foreground">
        <ContainerTextFlip words={words} /> Demos
      </h2>
      <h3 className="mx-auto mb-8 text-balance text-center text-lg font-medium tracking-tight text-foreground/80">
        Here are some of the components that you can use to build your landing pages.
      </h3>
      <div className="flex flex-col gap-8">
        {components.map((Component, idx) => {
          const resetKey = () => {
            setKeys((prev) => {
              const newKeys = [...prev];
              newKeys[idx]++;
              return newKeys;
            });
          };

          return (
            <div key={idx} className="max-w-5xl w-full mx-auto relative rounded-xl border bg-background py-4">
              <div className="flex items-center justify-end gap-2 p-2">
                <OpenInV0Button url={`https://ui.atastech.com/r/styles/default/${Component.name}.json`} />
                <Button
                  onClick={resetKey}
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
                    "h-full p-0": false,
                    "sm:p-10": false,
                  }
                )}
                key={keys[idx]}
              >
                <Component />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}