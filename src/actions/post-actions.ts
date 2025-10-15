"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to create a post",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    const slug = slugify(title);

    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existingPost) {
      return {
        success: false,
        message: "A post with this title already exists",
      };
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      post: newPost,
      message: "Post created successfully",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "An error occurred while creating the post",
    };
  }
}

export async function updatePost(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to update a post",
      };
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const slug = slugify(title);

    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.slug, slug), ne(posts.id, postId)),
    });
    if (existingPost) {
      return {
        success: false,
        message: "A post with this title already exists",
      };
    }
    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        description,
        content,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    revalidatePath("/");
    revalidatePath(`/post/${slug}`);
    revalidatePath("/profile");
    return {
      success: true,
      post: updatedPost,
      message: "Post updated successfully",
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      message: "An error occurred while updating the post",
    };
  }
}

export async function deletePost(postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return {
        success: false,
        message: "You must be logged in to delete a post",
      };
    }

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.authorId, session.user.id)),
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found or you do not have permission to delete it",
      };
    }

    await db.delete(posts).where(eq(posts.id, postId));
    revalidatePath("/");
    revalidatePath("/profile");
    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message: "An error occurred while deleting the post",
    };
  }
}
