import Link from "next/link.js";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button, buttonVariants } from "@/registry/default/ui/button";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/registry/default/ui/preview-card";

export default function PreviewCardDemo() {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        render={
          <Button variant="link" className="p-0">
            @ATASTECH
          </Button>
        }
      />
      <PreviewCardContent className="flex w-80 items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage src="https://github.com/atastech.png" alt="@ATASTECH" />
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-sm font-semibold">@ATASTECH</p>
          <p className="text-sm">Innovating in reverse.</p>
          <Link
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mt-2"
            )}
            href="https://github.com/atastech"
          >
            Follow
          </Link>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}
