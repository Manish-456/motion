"use client";

// Importing necessary modules and components for the Navigation component.
import React, {
   useRef,
   useState,
   type ElementRef } from "react";

import { usePathname } from "next/navigation";
import {
  ChevronsLeft,
  MenuIcon,
  Search,
  PlusCircle,
  Settings,
  Plus,
  Trash,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import UserItem from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { toast } from "sonner";
import DocumentList from "./document-list";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

// Navigation component that manages the sidebar and navbar display behavior.
export function Navigation() {
  const search = useSearch();
  const settings = useSettings();
  // Getting the current path of the page.
  const pathname = usePathname();

  const create = useMutation(api.documents.create);

  // Checking if the screen width is considered mobile.
  const isMobile = useMediaQuery("(max-width : 768px)");

  // Tracking if the user is currently resizing the sidebar.
  const isResizingRef = useRef(false);

  // References to the sidebar and navbar elements for manipulation.
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  // States for managing animation and collapse behavior of the sidebar.
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // Handling the changes in mobile view.
  useEffect(() => {
    if (isMobile) {
      collapsed(); // Collapses the sidebar on mobile view.
    } else {
      resetWidth(); // Resets the width of the sidebar on desktop view.
    }
  }, [isMobile]);

  // Handling the changes in path and mobile view.
  useEffect(() => {
    if (isMobile) {
      collapsed(); // Collapses the sidebar on mobile view.
    } else {
      resetWidth(); // Resets the width of the sidebar on desktop view.
    }
  }, [pathname, isMobile]);

  // Event handler for mouse down event on the sidebar.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    // Enables the resizing state.
    isResizingRef.current = true;

    // Adds event listeners for mouse move and mouse up.
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Event handler for mouse move event during resizing.
  const handleMouseMove = (e: MouseEvent) => {
    // Skips if not in resizing mode.
    if (!isResizingRef.current) return;

    // Adjusting the width of the sidebar within certain limits.
    let newWidth = e.clientX;
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    // Manipulating the sidebar and navbar widths and positions.
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  // Event handler for mouse up event during resizing.
  const handleMouseUp = (e: MouseEvent) => {
    // Disables the resizing state.
    isResizingRef.current = false;

    // Removes the event listeners for mouse move and mouse up.
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Function to reset the width of the sidebar.
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      // Sets the states for animation and collapse behavior.
      setIsCollapsed(false);
      setIsResetting(true);

      // Adjusts the sidebar and navbar widths and positions.
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      // Sets a timeout to reset the resetting state.
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  // Function to collapse the sidebar.
  const collapsed = () => {
    if (sidebarRef.current && navbarRef.current) {
      // Sets the states for animation and collapse behavior.
      setIsCollapsed(true);
      setIsResetting(true);

      // Adjusts the sidebar and navbar widths and positions for collapse.
      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      // Sets a timeout to reset the resetting state.
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  // Create a untitled document
  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note",
    });
  };
  // Rendering the sidebar and navbar elements.
  return (
    <>
      {/* Sidebar section with necessary event handlers and style configurations. */}
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          {
            "transition-all ease-in-out duration-300": isResetting,
            "w-0": isMobile,
          }
        )}
      >
        {/* Collapse button for the sidebar in mobile view. */}
        <div
          role="button"
          onClick={collapsed}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute right-2 top-3 opacity-0 group-hover/sidebar:opacity-100 transition",
            {
              "opacity-100": isMobile,
            }
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        {/* Section for displaying action items. */}
        <div>
          <UserItem />

          <Item label="Search" icon={Search} isSearch onClick={() => search.onOpen()} />

          <Item onClick={() => settings.onOpen()} label={"Settings"} icon={Settings} />
          <Item onClick={handleCreate} label={"New page"} icon={PlusCircle} />
        </div>
        {/* Section for displaying documents. */}
        <div className="mt-4">
          <DocumentList />
          <Item 
          onClick={handleCreate}
           icon={Plus}
           label="Add a page" />
           <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
            className="w-72 p-0"
            side={isMobile ? "bottom" : "right"}>
               <TrashBox />
            </PopoverContent>
           </Popover>
        </div>
        {/* Resizable bar for adjusting the sidebar width. */}
        <div
          onClick={resetWidth}
          onMouseDown={handleMouseDown}
          className="opacity-0 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0 group-hover/sidebar:opacity-100"
        />
      </aside>

      {/* Navbar section with necessary event handlers and style configurations. */}
      <div
        ref={navbarRef}
        className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", {
          "transition-all ease-in-out duration-300": isResetting,
          "left-0 w-full": isMobile,
        })}
      >
        {/* Navbar element containing the menu icon for expanding the collapsed sidebar. */}
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
}
