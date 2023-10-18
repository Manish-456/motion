"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from '@clerk/clerk-react';

export function Heading() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl md:text-6xl sm:text-5xl font-bold">
        Your <span className="underline">wiki</span>, <span className="underline">docs</span> &amp; <span className="underline">projects</span>. Unified.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Motion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {isLoading && 
      <div className="w-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
      }
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href={'/documents'}>
          Enter Motion <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}

      {
        !isAuthenticated && !isLoading && (
          <>
          <SignInButton mode="modal" >
            <Button>
              Get Motion Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SignInButton>
          </>
        )
      }
    </div>
  );
}
