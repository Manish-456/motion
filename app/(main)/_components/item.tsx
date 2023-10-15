"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  type LucideIcon,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenu,  DropdownMenuContent,
  DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  onClick?: () => void;
  onExpand?: () => void;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  label: string;
  icon: LucideIcon;
}

export default function Item({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onClick,
  label,
  onExpand,
  icon: Icon,
}: ItemProps) {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archived);
  const {user} = useUser()

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onArchive = (event : React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if(!id) return null;
    const promise = archive({id});
    toast.promise(promise, {
      loading : "Moving to trash...",
      success : "Note moved to trash.",
      error : "Failed to archived note."
    })
  }

  const onCreate = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        // todo; uncomment the below logic
        // router.push(`/documents/${documentId}`);
      }
    );
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        {
          "bg-primary/5 text-primary": active,
        }
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <>
          <Icon className="mr-2 h-[18px] text-muted-foreground shrink-0 " />
        </>
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none px-1.5 font-mono font-medium text-[10px] text-muted-foreground opacity-100 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(event) => event.stopPropagation()}
              asChild
            >
              <div
                role="button"
                onClick={(event) => event.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              forceMount
              align="start"
              side="right"
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2"/>
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="group-hover:opacity-100 opacity-0 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px",
      }}
      className={"flex gap-x-2 py-[3px]"}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
