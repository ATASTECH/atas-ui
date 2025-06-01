"use client";
import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LineDecorator } from "@/components/line-decorator";
import { NumberTicker } from "../ui/number-ticker";
import { Icons } from "../lucide-icons";
import { StarIcon } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const [stars, setStars] = useState<number>(300);

  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/atastech/atas-ui",
          {
            headers: process.env.GITHUB_OAUTH_TOKEN
              ? {
                  Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
                  "Content-Type": "application/json",
                }
              : {},
            next: { revalidate: 3600 },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count || 300);
        }
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    }
    fetchStars();
  }, []);
  
  return (
 <div className="mx-auto flex h-full w-full items-center px-14 py-54">
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 sm:gap-6">
          <LineDecorator
            orientation="vertical"
            className="absolute bottom-0 left-[15%] -z-20 mask-y-from-80% duration-1300"
          />
          <LineDecorator className="mr-auto mask-x-from-90% duration-1300" />
          <Badge variant="outline" className="py-1.5 px-3">
            <span>Stories components are now available. 🎉</span>
            <Link
              href="/docs/ui/stories"
              className="text-muted-foreground underline-offset-2 hover:underline"
            >
              Check it out.
            </Link>
          </Badge>
          <h1 className="from-foreground text-center text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:leading-[1.1]">
            Craft Your Components & Hooks Library
          </h1>
          <LineDecorator className="ml-auto mask-x-from-90% duration-1300" />
          <p className="text-muted-foreground max-w-sm text-center text-sm font-normal tracking-tight sm:max-w-2xl sm:text-lg md:max-w-3xl lg:max-w-4xl">
            {siteConfig.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 items-center justify-center">
            <Link
              href="/docs/ui"
              prefetch
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-fit"
              )}
            >
              Get Started
            </Link>
          <a
            className="group relative flex h-9 w-fit items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-300 ease-out hover:bg-black/90 hover:ring-2 hover:ring-black hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex"
            href={siteConfig.links.github}
            target="_blank"
          >
            <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
            <div className="flex items-center">
              <Icons.gitHub className="size-4" />
              <span className="ml-1 text-white">Star on GitHub</span>
            </div>
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
              <StarIcon className="size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300" />
              <NumberTicker
                value={stars}
                className="font-display font-medium text-white dark:text-white"
              />
            </div>
          </a>
          </div>
          <LineDecorator
            orientation="vertical"
            className="absolute top-0 right-[15%] -z-20 mask-y-from-90% duration-1300"
          />
        </div>
      </div>
  );
}