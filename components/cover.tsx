import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url: string;
  preview?: boolean;
}
export default function Cover({ url, preview }: CoverProps) {
  const params = useParams();
  const {edgestore} = useEdgeStore();
  const coverImage = useCoverImage();
  const removeCover = useMutation(api.documents.removeCover);

  const onRemove = async() => {
    await edgestore.publicFiles.delete({
        url : url
    })
    removeCover({
      id: params.documentId as Id<"documents">,
    });
  };

  return (
    <div
      className={cn("relative w-full h-[35vh] group", {
        "h-[12vh]": !url,
        "bg-muted": url,
      })}
    >
      {!!url && <Image src={url} alt="cover" className="object-cover" fill />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size={"sm"}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}

Cover.Skeleton = function CoverSkeleton(){
  return (
    <Skeleton className="h-[12vh] w-full" />
  )
}
