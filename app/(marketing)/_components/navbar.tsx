"use client";

import {useConvexAuth} from 'convex/react';
import {SignInButton, UserButton} from '@clerk/clerk-react';
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/spinner';
import Link from 'next/link';

export function Navbar() {
  const {isAuthenticated, isLoading} = useConvexAuth();

  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex transition-shadow  items-center w-full p-6",
        {
          "border-b shadow-sm": scrolled,
        }
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        {isLoading && (
          <Spinner />
        )}
        {
          !isAuthenticated && !isLoading && (
            <>
            <SignInButton mode='modal' >
              <Button variant={"ghost"} size={"sm"}>Login</Button>
            </SignInButton>
            <SignInButton mode='modal' >
              <Button  size={"sm"}>Get Motion Free</Button>
            </SignInButton>
            </>
          )
        }
        {
          isAuthenticated && !isLoading && (
            <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={'/documents'}>
                Enter Motion
              </Link>
            </Button>
                <UserButton afterSignOutUrl='/'/>
            </>
          )
        }
        <ToggleTheme />
      </div>
    </div>
  );
}
