import {v} from "convex/values";

import {mutation, query} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const archived = mutation({
    args : {
        id : v.id("documents")
    }, 
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error("Not authenticated");

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(arg.id);

        if(!existingDocument) throw new Error("Not Found");

        if(existingDocument.userId !== userId){
           throw new Error("Unauthorized");
        }

        const recursiveArchive = async(documentId : Id<"documents">) => {
             const children = await ctx.db.query("documents")
             .withIndex("by_user_parent", 
             q => q
             .eq("userId", userId)
             .eq("parentDocument", documentId)).collect();
             
             for(const child of children){
                await ctx.db.patch(child._id, {
                    isArchived : true
                })
                await recursiveArchive(child._id);
             }
        }

        const document = await ctx.db.patch(arg.id, {
            isArchived : true
        })

        recursiveArchive(arg.id);

        return document;
    }
})

export const getSidebar = query({
    args : {
        parentDocument : v.optional(v.id("documents"))
    },
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const documents = await ctx.db.query("documents")
        .withIndex("by_user_parent", q => 
        q
        .eq("userId", userId)
        .eq("parentDocument", arg.parentDocument)
        )
        .filter(q => q.eq(q.field("isArchived"), false))
        .order("desc")
        .collect();

        return documents
    }
})

export const create = mutation({
    args : {
        title : v.string(),
        parentDocument : v.optional(v.id("documents")),
    },
    handler : async (ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error('Not authenticated');
        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title : arg.title,
            parentDocument : arg.parentDocument,
            userId,
            isArchived : false,
            isPublished : false
        });

        return document;
    }
});