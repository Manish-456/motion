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

export const getTrash = query({
    handler : async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error('Not authenticated');
        const userId = identity.subject;

        const documents = await ctx.db.query("documents").withIndex("by_user", (q) => q.eq(("userId"), userId))
        .filter(q => q.eq(q.field("isArchived"), true))
        .order("desc").collect();

        return documents;
    }
});

export const restore = mutation({
    args : {
        id : v.id("documents")
    },
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(arg.id);

        if(!existingDocument) throw new Error("Not found");

        if(existingDocument.userId !== userId) throw new Error("Unauthorized");

        const recursiveRestore = async(documentId : Id<"documents">) => {
            const children = await ctx.db.query("documents").withIndex("by_user_parent", q => q.eq("userId", userId).eq("parentDocument", documentId)).collect();

            for(const child of children) {
                await ctx.db.patch(child._id, {isArchived : false});
               await recursiveRestore(child._id);
            }
        }

        const options : Partial<Doc<"documents">> = {
            isArchived : false
        }

        if(existingDocument.parentDocument){
            const parent = await ctx.db.get(existingDocument.parentDocument);

            if(parent?.isArchived){
                options.parentDocument = undefined;
            }
        }

       const document = await ctx.db.patch(arg.id, options);
         recursiveRestore(arg.id);
        return document;
    }
});

export const remove = mutation({
    args : {id : v.id("documents")},
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error('Not authenticated');

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(arg.id);

        if(!existingDocument) throw new Error("Not found");

        if(existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.delete(arg.id);
        return document;
    }
});

export const getSearch = query({
    handler : async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
 
        if(!identity) throw new Error("Not authenticated");

        const userId = identity.subject;

        const documents = await ctx.db.query("documents")
        .withIndex("by_user", q => q.eq("userId", userId))
        .filter(q => q.eq(q.field("isArchived"), false))
        .order("desc")
        .collect();

        return documents;
    }
})

export const getById = query({
    args: {
        documentId : v.id("documents")
    },
    handler : async (ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        const document = await ctx.db.get(arg.documentId);

        if(!document) throw new Error("Not found");

        if(document.isPublished && !document.isArchived) {
            return document;
        }

        if(!identity){
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        if(document.userId !== userId){
          throw new Error("Unauthorized")
        }

        return document;
    }
});

export const update = mutation({
    args : {
        id : v.id("documents"),
        title : v.optional(v.string()),
        content : v.optional(v.string()),
        coverImage : v.optional(v.string()),
        icon : v.optional(v.string()),
        isPublished : v.optional(v.boolean())
    },

    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const {id, ...rest} = arg;

        const existingDocument = await ctx.db.get(id)

        if(!existingDocument) throw new Error("Not found");

        if(existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(id, {
            ...rest
        });

        return document;
    }
});

export const removeIcon = mutation({
    args : {
        id : v.id("documents"),
    },
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(arg.id);

        if(!existingDocument) throw new Error("Not found");

        if(existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(arg.id, {
            icon : undefined
        });

        return document;
    }
})

export const removeCover = mutation({
    args : {
        id :v.id("documents")
    },
    handler : async(ctx, arg) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error("Unauthenticated");

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(arg.id);

        if(!existingDocument) throw new Error("Not found");

        if(existingDocument.userId !== userId) throw new Error("Unauthorized");

        const document = await ctx.db.patch(arg.id, {
            coverImage : undefined
        });

        return document;
    }
})