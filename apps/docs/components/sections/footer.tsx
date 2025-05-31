"use client";
import Link from "next/link";
import { FlickeringGrid } from "../ui/flickering-grid";
import { useEffect, useState } from "react";

export default function Footer() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <footer className="relative w-full border-t border-border py-6 md:py-0">
            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden max-w-full">
                <FlickeringGrid
                    className="relative inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
                    squareSize={4}
                    gridGap={6}
                    color="#f97316"
                    maxOpacity={0.3}
                    flickerChance={0.1}
                    height={70}
                    width={dimensions.width}
                />
            </div>
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
               <h2 className="text-2xl md:text-4xl font-bold text-muted-foreground opacity-20 mix-blend-overlay select-none px-4 text-center">
                    Made with <span className="text-red-500">♥</span> by{" "}
                    <Link
                        href="https://github.com/ATASTECH"
                        target="_blank"
                        className="text-foreground underline-offset-4 transition-colors hover:underline"
                        prefetch
                    >
                        ATASTECH.
                    </Link>
                </h2>
            </div>
            <div className="relative z-10 container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">

            </div>
        </footer>
    );
}